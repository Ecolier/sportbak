import express from 'express';
import Video, {IVideo} from '../models/video.model';
import videoConfig from '../config/video.config';

import fs from 'fs'
import moment from 'moment';
import SportbakService from '../services/sportbak.service';
import sportbakConfig from '../config/sportbak.config';
import VideoService from '../services/video.service';
import Container from 'typedi';

export async function create(req : any, res: express.Response){
    const videoService = Container.get(VideoService);
    if(!req.body && !req.body.type && !req.body.startAt && !req.body.endAt && ! req.body.duration){
        return res.status(400).send({
            message: "Video can not be empty"
        });
    }

    console.log("Create video expiration date "+ moment().add(videoConfig.expiration, 'day'));
    
    //console.log("Req : ",req.body);
    const sessionId = req.body.sessionId;
    let data : IVideo = {
        field: req.field['_id'],
        type: req.body.type,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        duration: req.body.duration,
        expirationDate: moment().add(videoConfig.expiration, 'day').toDate(),
        session : sessionId,
        directory : null,
        path : null
    };
    const video = new Video(data);
    video.directory = await videoService.getParentDirectory(video);
    video.path = await videoService.createLocalPath(video);

    video.save()
    .then(data => {
        videoService.sportbakService.storageService.updateDirectoryFocused(video.directory);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Video."
        });
    });
}

export function findAll(req : express.Request, res: express.Response){
    Video.find()
    .then(videos => {
        res.send(videos);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving videos."
        });
    });
}

export function findOne(req : express.Request, res: express.Response){
    Video.findById(req.params.id)
    .then(video => {
        if(!video) {
            return res.status(404).send({
                message: "Video not found with id " + req.params.id
            });            
        }
        res.send(video);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Video not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving video with id " + req.params.id
        });
    });
}

/**
 * Handle poster upload
 * @param req 
 * @param res 
 */
export function poster(req : any, res: express.Response){
    const videoService = Container.get(VideoService);

    const regex = /bytes=([0-9]+)\-([0-9]+)\/([0-9]+)/;
    const ranges = req.headers.range.match(regex);
    if (!ranges){
        return res.status(400).send("Wrong format");
    }

    Video.findById(req.params.id)
    .then(async video => {
        if(!video) {
            return res.status(404).send({
                message: "Video not found with id " + req.params.id
            });            
        }

        if (!video.field.toString() == req.field._id.toString()){
            return res.status(403).send({
                message: "Forbidden for video with id " + req.params.id
            });          
        }
        const localDirectoryPath = await videoService.getLocalDirectoryPath(video);
        if (!fs.existsSync(localDirectoryPath)) {
           fs.mkdirSync(localDirectoryPath, {recursive: true})
        }

        const localPath = await videoService.getLocalPathPoster(video);
        fs.open(localPath, 'a+', (err, fd) => {
            if (err){
                console.log(err.message);
                return res.status(500).send({"message": err.message});
            }
            
            const start = parseInt(ranges[1])
            const end = parseInt(ranges[2])

            fs.write(fd, req.body, 0, end-start, start, () => {
                fs.closeSync(fd);
                return res.send({"message": "success"});
            });

        });

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Video not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving video with id " + req.params.id
        });
        
    });
}

/**
 * Handle chunked upload
 * @param req 
 * @param res 
 */
export function append(req : any, res: express.Response){
    const videoService = Container.get(VideoService);

    const regex = /bytes=([0-9]+)\-([0-9]+)\/([0-9]+)/;
    const ranges = req.headers.range.match(regex);
    if (!ranges){
        return res.status(400).send("Wrong format");
    }

    Video.findById(req.params.id)
    .then(async video => {
        if(!video) {
            return res.status(404).send({
                message: "Video not found with id " + req.params.id
            });            
        }
        const localDirectoryPath = await videoService.getLocalDirectoryPath(video);
        const videoPath = await videoService.getLocalPathVideo(video);
        const videoUrl = await videoService.getMediaUrlVideo(video);
        const posterUrl = await videoService.getMediaUrlVideoPoster(video);

        if (!video.field.toString() == req.field._id.toString()){
            return res.status(403).send({
                message: "Forbidden for video with id " + req.params.id
            });          
        }
        
        if (!fs.existsSync(localDirectoryPath)) {
           fs.mkdirSync(localDirectoryPath, {recursive: true})
        }

        fs.open(videoPath, 'a+', (err, fd) => {
            if (err){
                console.log(err.message);
                return res.status(500).send({'message': err.message});
            }
            
            const start = parseInt(ranges[1]);
            const end = parseInt(ranges[2]);
            const size = parseInt(ranges[3]);

            fs.write(fd, req.body, 0, end-start, start, async () => {
                fs.closeSync(fd);
                if (end == size){
                    console.log('Login to Sportbak app')
                    const service = new SportbakService(sportbakConfig.url, sportbakConfig.user, sportbakConfig.password);
                    if (video.type == 'full'){
                        await service.addFullVideo(videoUrl, posterUrl, video.duration, video.expirationDate, video.startAt, video.endAt, req.field.complexId, req.field.fieldId);
                    }else if(video.type == 'buzz'){
                        await service.addPhysicalBuzzer(videoUrl, posterUrl, video.duration, video.expirationDate, video.startAt, video.endAt, req.field.complexId, req.field.fieldId);
                    }
                }
                return res.send({"message": "success"});
            });

        });

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Video not found with id ' + req.params.id
            });                
        }
        return res.status(500).send({
            message: 'Error retrieving video with id ' + req.params.id
        });
        
    });

}

export function remove(req : any, res: express.Response){
    
}
