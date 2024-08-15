import Queue from 'bull';
import ReconnectingWebSocket from "reconnecting-websocket";
import ws, { OpenEvent } from 'ws';
import ffmpeg from 'fluent-ffmpeg';
import redisConfig from '../config/redis.config';
import { Service } from 'typedi';
import encoderConfig from '../config/encoder.config';
import videoConfig from '../config/video.config';
import fs from 'fs-extra';
import ContextService from './context.service';
import { DateConstants } from '../constants/data.constant';
import Session, { EventType } from '../models/session.model';
import { FileService } from './file.service';
import _path from 'path';

enum VideoTypes {
    goal = 'GOAL',
    buzz = 'BUZZ',
    var = 'VAR',
    full = "FULL"
}
export type VideoTypesRequested = VideoTypes | 'ALL';

interface VideoDetails {
    type : VideoTypes,
    startAt : Date;
    endedAt : Date;
    path : string,
    thumbnail : string,
    duration : number,
}

interface VideoSession {
    field : string
    startAt : Date;
    endedAt : Date;
    videos : VideoDetails[],
}

const options = {
        WebSocket: ws, // custom WebSocket constructor
        connectionTimeout: 1000
};


export enum VideoState {
        READY,
        RECORDING,
        UNCONNECTED,
        ERROR
}

@Service("video.manager")
export class VideoManager{

        async getVideoMetadata(src : string) : Promise<any> {
              return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(src, function (err, metadata) {
                                if (err) 
                                        return reject(err);
                                return resolve(metadata);
                        });
              }); 
        }

        async convertM3u8ToMp4(src: string, dest: string){
                return new Promise((resolve,reject)=>{
                        ffmpeg(src).output(dest)
                                .withVideoCodec('copy')
                                .on('end', () => {
                                        resolve(dest)
                                }).on('error',(err)=>{
                                        return reject(new Error(err))
                                }).run();
                     });
        }

        async getVideoDuration(src: string) : Promise<number> {
                let result = -1;
                let metadata = await this.getVideoMetadata(src);
                if (metadata?.format?.duration != undefined) {
                        result = metadata?.format?.duration;
                }
                return result;
        }

        
        async createThumbnail(src: string, time: number,  dest: string){
                return new Promise((resolve, reject) => {
                        ffmpeg(src)
                        .output(dest)
                        .noAudio()
                        .seek(time)
                        .frames(1).on('end', () => {
                                resolve(dest)
                        }).on('error',(err)=>{
                                return reject(new Error(err))
                        }).run();

                });
        }

        async encodeToResolutionAndBitrate(src: string, height: number, bitrate: number, dest: string){
                if (encoderConfig.encoder == "vaapi"){
                        return new Promise((resolve,reject)=>{
                                ffmpeg(src).inputOptions(['-hwaccel vaapi', '-hwaccel_output_format vaapi',  '-hwaccel_device /dev/dri/renderD128'])
                                        .output(dest)
                                        .videoBitrate(bitrate)
                                        .videoFilters(["scale_vaapi=w=trunc(oh*a/2)*2:h="+height])
                                        .outputOptions(['-c:v h264_vaapi', '-tune zerolatency', '-movflags faststart']).on('end', () => {
                                                resolve(dest)
                                        }).on('error',(err)=>{
                                                return reject(new Error(err))
                                        }).run();
                        });
                }else {
                        return new Promise((resolve,reject)=>{
                                ffmpeg(src).output(dest)
                                        .videoBitrate(bitrate)
                                        .size('?x'+height)
                                        .outputOptions(['-c:v libx264', '-preset veryfast', '-tune zerolatency', '-movflags faststart'])
                                        .on('end', () => {
                                                resolve(dest)
                                        }).on('error',(err)=>{
                                                return reject(new Error(err))
                                        }).run();
                             });
                }

        }
        
        async cutVideo(src: string, from: number, duration: number, dest: string){
                return new Promise((resolve,reject)=>{
                        ffmpeg(src)
                                .inputOptions(['-hwaccel vaapi', '-hwaccel_output_format vaapi',  '-hwaccel_device /dev/dri/renderD128'])
                                .setStartTime(from)
                                .setDuration(duration)
                                .output(dest)
                                .outputOptions(['-c:v h264_vaapi', '-tune zerolatency', '-movflags faststart'])
                                .on('end', () => {
                                        resolve(dest)
                                }).on('error',(err)=>{
                                        return reject(new Error(err))
                                }).run();
                     });
        }

        removeInitialTsFiles(directory : string) {
                const files = FileService.getFilesWithExtension(directory, "ts");
                console.log("Remove initial files - ts files count : ", files.length);
                for (let file of files) {
                        const path = _path.join(directory, file);
                        fs.removeSync(path); 
                }
        }
}

@Service("video.service")
export default class VideoClient{

        client : ReconnectingWebSocket;
        state: VideoState = VideoState.UNCONNECTED;
        videoSessionId: string;
        alreadyInitialised : boolean = false;
        callbackVideoSession : (videoSessionId : string) => void = null;

        constructor(){
        }

        connect(serviceUrl : string) {
                this.client = new ReconnectingWebSocket(serviceUrl, [], options);
                this.client.onclose = (event : CloseEvent) => {
                        this.state = VideoState.UNCONNECTED;
                }
                this.client.onopen = (event : OpenEvent) => {
                        this.alreadyInitialised = false;
                }
                this.client.onmessage = (message: any)  => {
                        let messageObj = JSON.parse(message.data);
                        if ('action' in messageObj){
                                if (messageObj['action'] == "status"){
                                        if (messageObj['params']['recording'] /*&& !messageObj['params']['error']*/){
                                                this.state = VideoState.RECORDING;
                                                this.videoSessionId = messageObj['params']['session_name'];
                                                if (this.callbackVideoSession) {
                                                        this.callbackVideoSession(this.videoSessionId);
                                                }
                                        } else if (messageObj['params']['ready'] /*&& !messageObj['params']['error']*/){
                                                this.state = VideoState.READY;
                                                if (this.callbackVideoSession) {
                                                        this.callbackVideoSession(null);
                                                }
                                        }
                                }
                        }
                };
        }

        async initVideoRecorder(currentVideoSessionId : string, overlay = false) {
                if (this.alreadyInitialised)
                        return;
                this.alreadyInitialised = true;
                if (currentVideoSessionId) {
                    if (this.state != VideoState.RECORDING) {
                        this.videoRestart(currentVideoSessionId, overlay);
                    }
                } else {
                    if (this.state == VideoState.RECORDING) {
                        this.stop();
                    }
                }
        }

        showOverlay() {
                this.client.send(JSON.stringify({'action': 'show_overlay', 'params': {}}));
        }

        hideOverlay() {
                this.client.send(JSON.stringify({'action': 'hide_overlay', 'params': {}}));
        }

        reloadOverlay() {
                this.client.send(JSON.stringify({'action': 'reload_overlay', 'params': {}}));
        }
        
        start(overlay = false) {
                if (this.state == VideoState.READY){
                        this.client.send(JSON.stringify({'action': 'start', 'params': {overlay : overlay}}));
                } else if (this.state != VideoState.UNCONNECTED) {
                        throw new Error('Video Service is not ready ' + this.client.readyState + " - this.state : " + this.state);
                }
        }

        setTeams(team_1, team_2){
               this.client.send(JSON.stringify({'action': 'set_teams', 'params': { 'team_1': team_1, 'team_2': team_2 }}));
        }
 
        setScore(team_1, team_2){
                this.client.send(JSON.stringify({'action': 'set_score', 'params': { 'team_1': team_1, 'team_2': team_2 }}));
        }        
        
        pause(){
                this.client.send(JSON.stringify({'action': 'pause', 'params': {}}));
        }  
        
        restart(){
                this.client.send(JSON.stringify({'action': 'restart', 'params': {}}));
        }   
        
        newPeriod(period: string){
                this.client.send(JSON.stringify({'action': 'switch_period', 'params' : {'name': period}}));
        }   

        setSession(score_team1 : number, score_team2 : number, team1 : string, team2 : string, time : number, period : string, isPaused : boolean) {
                const params = {
                        score_team1 : score_team1,
                        score_team2 : score_team2,
                        team1 : team1,
                        team2 : team2,
                        time : time,
                        period : period,
                        isPaused : isPaused
                }
                this.client.send(JSON.stringify({'action' : 'set_session', 'params' : params}));
        }
        

        stop(overlay = false){
                /*if (this.state == VideoState.RECORDING){
                        this.client.send(JSON.stringify({'action': 'stop', 'params': {}}));
                        this.state = VideoState.READY;
                } else if (this.state != VideoState.UNCONNECTED) {
                        console.log('Video Service is not recording : ' + this.state)
                        //throw new Error('Video Service is not recording');
                }*/
                this.client.send(JSON.stringify({'action': 'stop', 'params': {overlay : overlay}}));
        }

        videoRestart(videoSessionId : string, overlay = false) {
                this.client.send(JSON.stringify({'action': 'video_restart', 'params': {sessionId: videoSessionId, overlay: overlay}}));
        }

        async getVideos(context : ContextService, type : VideoTypesRequested = 'ALL', from : Date = null, to : Date = null) {
                const now = new Date();
                if (!from)
                    from = new Date(now.getTime() - 1 * DateConstants.day);
                if (!to)
                    to = new Date(now.getTime());
                const selectors = {
                    state : {$ne : 'RECORDING'},
                    startAt : {$lt : to},
                    endedAt : {$gte : from},
                    path : {$exists : true}
                }
                const sort = {
                    createdAt : -1
                }
                const sessions = await Session.find(selectors).sort(sort);
                let result = [];
                const fieldId = context.sportbakService.field?._id;
                for (let s of sessions) {
                    const relativePathFullVideo = s.path + '/high.mp4';
                    const relativePathThumbnailFullVideo = s.path + '/high.jpg';
                    const videoSession : VideoSession = {
                        startAt : s.startAt,
                        endedAt : s.endedAt,
                        videos : [],
                        field : fieldId 
                    };
            
                    if ((type == VideoTypes.full || type == 'ALL') && 
                        fs.existsSync(videoConfig.path + relativePathFullVideo)) {
                        const videoDetails = {
                            type : VideoTypes.full,
                            startAt : videoSession.startAt,
                            endedAt : videoSession.endedAt,
                            duration : s.duration,
                            path : '/' + relativePathFullVideo,
                            thumbnail : null
                        }
            
                        if (s.highVideoDuration) {
                            videoDetails.endedAt = new Date(videoDetails.startAt.getTime() + s.highVideoDuration * DateConstants.second);
                            videoDetails.duration = s.highVideoDuration;
                        }
                        if (fs.existsSync(videoConfig.path + relativePathThumbnailFullVideo)) {
                            videoDetails.thumbnail = '/' + relativePathThumbnailFullVideo;
                        }
                        videoSession.videos.push(videoDetails);
                    }
            
                    if (s.events) {
                        for (let e of s.events) {
                            if (e.path) {
                                const relativePathCurrVideo = e.path + '.mp4';
                                const relativePathThumbnailCurrVideo = e.path + '.jpg';
                                let currType = null;
                                if (e.type == EventType.GOAL) {
                                    if (type == VideoTypes.goal || type == 'ALL') {
                                        currType = VideoTypes.goal;
                                    }
                                } else if (e.type == EventType.BUZZ || e.type == EventType.VAR) {
                                    if (type == VideoTypes.buzz || type == 'ALL') {
                                        currType = VideoTypes.buzz;
                                    }
                                }
            
                                if (currType) {
                                    if (fs.existsSync(videoConfig.path + relativePathCurrVideo)) {
                                        const duration = e.videoDuration || e.duration;
                                        const startAt = new Date(videoSession.startAt.getTime() + e.time * DateConstants.second);
                                        const endAt = new Date(startAt.getTime() + duration * DateConstants.second);
                                        const videoDetails = {
                                            type : currType,
                                            startAt : startAt,
                                            endedAt : endAt,
                                            duration : duration,
                                            path : '/' + relativePathCurrVideo,
                                            thumbnail : null
                                        }
                                        if (fs.existsSync(videoConfig.path + relativePathThumbnailCurrVideo)) {
                                            videoDetails.thumbnail = '/' + relativePathThumbnailCurrVideo;
                                        }
                                        videoSession.videos.push(videoDetails);
                                    }
                                    
                                }
                            }
                        }
                    }
            
                    if (videoSession.videos.length) {
                        result.push(videoSession);
                    }
                }
                return result;
        }
}