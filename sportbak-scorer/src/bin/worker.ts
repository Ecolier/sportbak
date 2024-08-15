// Add context in req
import ContextService from '../services/context.service';
declare global {
  namespace Express {
    interface Request {
      context: ContextService,
      clientIp : string,
      fromLocalhost : boolean
    }
  }
}

import ConfigService from '../services/config.service';
import configFile from '../config/file.config';
import videoConfig from '../config/video.config';
import config from '../config/config';
import dateFormat from 'dateformat'
import UploaderService from '../services/uploader.service';
import { VideoManager } from '../services/video.service';
import Session, { EventType } from '../models/session.model';
import { load as loadMongoose } from '../loaders/mongoose';
import fs from 'fs-extra';
import moment from 'moment';
import externalUrlsConfig from '../config/externalUrls.config';
import axios from 'axios';
import cron from 'node-cron';
import BullQueueService from '../services/bull.queue.service';
import BullJobService from '../services/bull.job.service';

loadMongoose()

async function notifyManagerBackendNewVideoIsReady() {
  try {
    await axios.post(config.service_url + '/video/ready', {});
  } catch(err) {}
}


BullQueueService.processEncodeVideo(async function(job, done){
  const videoManager = new VideoManager();
  let error = null;
  let srcDirectory = null;
  let session = null;
  try{
    console.log('Starting encoding session ' + job.data.id + " - " + (job.data.videoSessionId || ''));
    const configService = new ConfigService(configFile.path);    
    const config = configService.read();
    session = await Session.findById(job.data.id);

    if (session && session.path){
      const prefixSrc = videoConfig.path+session.path;
      srcDirectory = prefixSrc;

      await BullJobService.startJob(job);
      await BullJobService.reformatEncoreVideoJobIfNeeded(job);
      
      // JOB - INIT
      const srcPlaylist = prefixSrc + '/playlist.m3u8';
      const srcHighVideo = prefixSrc + '/high.mp4';
      const srcLowVideo = prefixSrc + '/low.mp4';
      const srcLowThumbnailHigh = prefixSrc + '/high.jpg';
      const srcLowThumbnailLow = prefixSrc + '/low.jpg';
      
      if (BullJobService.processBlock(job, 'init', 0)) {
        await BullJobService.updateJobProgress(job, 'init', 0);
      }

      if (BullJobService.processBlock(job, 'init', 1)) {
        session.state = 'ENCODING';
        await session.save();
        await videoManager.convertM3u8ToMp4(srcPlaylist, srcHighVideo);
        await BullJobService.updateJobProgress(job, 'init', 1);
      }

      if (BullJobService.processBlock(job, 'init', 2)) {
        try {
          await videoManager.createThumbnail(srcHighVideo, 0, srcLowThumbnailHigh);
        } catch(err) {
          console.error('Error create thumbnail full video');
        }
        await BullJobService.updateJobProgress(job, 'init', 2);
      }

      if (BullJobService.processBlock(job, 'init', 3)) {
        const highVideoDuration = await videoManager.getVideoDuration(srcHighVideo);
        if (highVideoDuration >= 0) {
          session.highVideoDuration = highVideoDuration;
        }
        await session.save();
        notifyManagerBackendNewVideoIsReady();
        await BullJobService.updateJobProgress(job, 'init', 3);
      }

      // JOB - ENCODE MAIN VIDEO
      if (BullJobService.processBlock(job, 'encode_full_video', 0)) {
        await BullJobService.updateJobProgress(job, 'encode_full_video', 0);
      }

      if (BullJobService.processBlock(job, 'encode_full_video', 1)) {
        await videoManager.encodeToResolutionAndBitrate(srcHighVideo, config.height, config.bitrate, srcLowVideo);
        await BullJobService.updateJobProgress(job, 'encode_full_video', 1);
      }

      if (BullJobService.processBlock(job, 'encode_full_video', 2)) {
        await videoManager.createThumbnail(srcLowVideo, 0, srcLowThumbnailLow);
        await BullJobService.updateJobProgress(job, 'encode_full_video', 2);
      }

      if (BullJobService.processBlock(job, 'encode_full_video', 3)) {
        const lowVideoDuration = await videoManager.getVideoDuration(srcLowVideo);
        if (lowVideoDuration >= 0) {
          session.lowVideoDuration = lowVideoDuration;
        }
        await session.save();
        await BullJobService.updateJobProgress(job, 'encode_full_video', 3);
      }


      // JOB - ENCODE EVENT VIDEO
      if (BullJobService.processBlock(job, 'encode_event_videos', 0)) {
        console.log('Starting cut videos of session ' + job.data.id);
        await BullJobService.updateJobProgress(job, 'encode_event_videos', 0);
      }
      for (let i = 0; i < session.events.length; i++ ){
        let event = session.events[i];
        if (BullJobService.processBlock(job, 'encode_event_videos', i + 1)) {
          if (event.type !== EventType.PAUSE){
            const start = Math.max(0, event.time - config.buzzTime);
            const duration = Math.min(event.time, config.buzzTime);
            const filename = event.type.toLowerCase() + '_' + event.time;
            const relativeCurrPath = session.path + '/' + filename;
            const currPath = videoConfig.path + relativeCurrPath;
            const srcVideoCutted = currPath + '.mp4';
            const srcVideoThumbnail = currPath + '.jpg';
            await videoManager.cutVideo(srcLowVideo, start, duration, srcVideoCutted);
            try {
              await videoManager.createThumbnail(srcVideoCutted, 0, srcVideoThumbnail);
            } catch(err) {
              console.error('Error create thumbnail event video : ' + filename);
            }
            
            const currDuration = duration;
            session.events[i].duration = currDuration;
            if (currDuration >= 0) {
              session.events[i].videoDuration = currDuration;
              session.events[i].path = relativeCurrPath;
            }
          }
          await BullJobService.updateJobProgress(job, 'encode_event_videos', i + 1);
        }
      }

      // JOB - FINISHING VIDEO
      if (BullJobService.processBlock(job, 'finishing', 0)) {
        await BullJobService.updateJobProgress(job, 'finishing', 0);
      }

      if (BullJobService.processBlock(job, 'finishing', 1)) {
        session.state = 'READY_TO_SEND';
        await session.save();
        await BullJobService.updateJobProgress(job, 'finishing', 1);
      }

      if (BullJobService.processBlock(job, 'finishing', 2)) {
        notifyManagerBackendNewVideoIsReady();
        console.log("SendVideoAsSoon : " + config.sendVideoAsSoon)
        if (config.sendVideoAsSoon){
          console.log("sendVideoQueue : add at queue for now - " + job.data.id);
          const newJob = BullJobService.getJobDataSendVideoFromJobEncodeVideo(job.data, true);
          BullQueueService.addJobSendVideo(newJob);
        }
        await BullJobService.updateJobProgress(job, 'finishing', 2);
      }
      await BullJobService.jobFinished(job);
    } else {
      if (!session) {
        error = 'Failed to encode video. Session is undefined...';
      } else if (!session.path) {
        error = 'Failed to encode video. Session.path is undefined...';
      }
    }
  }catch (err){
    error = 'Failed to encode video ' + job.data.id+ ' ' + err;
    if (session && session.state){
      session.state = 'ENCODING_FAILED';
      await session.save();
    }
  }
  

  if (error) {
    console.log(error);
    done(new Error(error));
  } else {
    done(null);
    // Job if finished successfuly and High video is created. Ts files are useless now. 
    try {
      if (srcDirectory)
        videoManager.removeInitialTsFiles(srcDirectory);       
    } catch(err) {
      console.log("Error deleting initial ts files ...");
    }
  }
});

BullQueueService.processSendVideo(async function(job, done){
  console.log("Sending videos ...");  
  let error = null;
  let session = null;
  console.log("Session to upload : " + job.data.id);

  try{
    const configService = new ConfigService(configFile.path);    
    const config = configService.read();
    const uploaderService = new UploaderService(externalUrlsConfig.apiVideo, config.apiKey, config.apiSecret, config.chunkSizeUpload);
    session = await Session.findById(job.data.id);

    if (session && session.path) {
      await BullJobService.startJob(job);
      await BullJobService.reformatSendVideoJobIfNeeded(job);

      const video = videoConfig.path+session.path+'/'+'low.mp4';
      const preview = videoConfig.path+session.path+'/'+'low.jpg';
      const lowVideoDuration = session.lowVideoDuration || session.duration;
      const sendFullVideo = (job.data.send_full_video || job.data.send_full_video === undefined);
      const sendGoalVideos = (job.data.send_goal_videos || job.data.send_goal_videos === undefined);
      const sendBuzzVideos = (job.data.send_buzz_videos || job.data.send_buzz_videos === undefined);
      const sendVarVideos = (job.data.send_var_videos || job.data.send_var_videos === undefined);

      // JOB - PUBLISH VIDEO
      if (BullJobService.processBlock(job, 'init_publish_video', 0)) {
        await BullJobService.updateJobProgress(job, 'init_publish_video', 0);
      }

      let videoEntryId = job.data.fullVideoEntryId;
      if (sendFullVideo) {
        if (BullJobService.processBlock(job, 'init_publish_video', 1)) {
          videoEntryId = await uploaderService.createVideoEntry(session.id, 'mp4', 'full', session.startAt, lowVideoDuration);
          console.log('Video entry created : '+ videoEntryId + ' now publishing poster');
          if (fs.existsSync(preview)) {
            try {
              await uploaderService.publishPoster(videoEntryId, preview);
            } catch(err) {
              console.error('Error send thumbnail full video');
            }
          }
          console.log('Video poster uploaded : '+ videoEntryId + ' now publishing video');  
          job.update({
            ...job.data,
            fullVideoEntryId : videoEntryId
          })
          await BullJobService.updateJobProgress(job, 'init_publish_video', 1);
        }
  
        if (!BullJobService.partIsFinished(job, 'publish_video')) {
          if (!videoEntryId) {
            throw new Error('videoEntryId is undefined : ' + videoEntryId)
          }
          await uploaderService.publishMp4(videoEntryId, video, async (progress, step, total) => {
            if (BullJobService.processBlock(job, 'publish_video', step))
              await BullJobService.updateJobProgress(job, 'publish_video', step, total);
          }, (step) => {
            return BullJobService.processBlock(job, 'publish_video', step);
          });
        }
      } else {
        console.log("NO - Sending full video");
        await BullJobService.updateJobProgress(job, 'init_publish_video', 0, 0);
        await BullJobService.updateJobProgress(job, 'publish_video', 0, 0);
      }

      // JOB - PUBLISH EVENTS
      if (BullJobService.processBlock(job, 'publish_event_videos', 0)) {
        await BullJobService.updateJobProgress(job, 'publish_event_videos', 0);
      }
      
      for (let i = 0; i < session.events.length; i++ ){
        let event = session.events[i];
        if (BullJobService.processBlock(job, 'publish_event_videos', i + 1)) {
          if ((event.type == EventType.GOAL && sendGoalVideos) ||
            (event.type == EventType.BUZZ && sendBuzzVideos) || 
            (event.type == EventType.VAR && sendVarVideos)) {
            // TODO - distinct BUZZ & VAR Video
            console.log('Publishing event video at time : '+ event.time);
            const dateStartBuzz = new Date(session.startAt.getTime() + event.time * 1000);
            const currDuration = event.videoDuration || config.buzzTime;
            const id = await uploaderService.createVideoEntry(session.id, 'mp4', 'buzz', dateStartBuzz, currDuration);
            const filename = event.type.toLowerCase()+'_'+event.time;
            const video = videoConfig.path+session.path+'/'+ filename +'.mp4';
            const poster = videoConfig.path+session.path+'/'+ filename +'.jpg';
            console.log("Sending video "+ video);
            if (fs.existsSync(poster)) {
              try {
                await uploaderService.publishPoster(id, poster);
              } catch(err) {
                console.error('Error send thumbnail event video : ' + filename);
              }
            }
            await uploaderService.publishMp4(id, video);
          } else {
            if (event.type == EventType.GOAL) {
              console.log("NO - Sending goal video");
            } else if (event.type == EventType.BUZZ) {
              console.log("NO - Sending buzz video");
            } else if (event.type == EventType.VAR) {
              console.log("NO - Sending var video");
            }
          }
          await BullJobService.updateJobProgress(job, 'publish_event_videos', i + 1);
        }
      }
      
      // JOB - FINISHING
      if (BullJobService.processBlock(job, 'finishing', 0)) {
        await BullJobService.updateJobProgress(job, 'finishing', 0);
      }

      if (BullJobService.processBlock(job, 'finishing', 1)) {
        console.log("Video successfully sent");
        session.state = 'SENT';
        await session.save();
        await BullJobService.updateJobProgress(job, 'finishing', 1);
      }
      await BullJobService.jobFinished(job);
    }
    else {
      if (!session) {
        error = 'Failed to send video. Session is undefined...';
      } else if (!session.path) {
        error = 'Failed to send video. Session.path is undefined...';
      }
    }
  }catch (e){
    error = "Can't send video" + e.toString();
    console.log("Error : ", e)
    if (session && session.state){
      session.state = 'UPLOAD_FAILED';
      await session.save();
    }
  }
  
  
  if (error) {
    console.log(error);
    done(new Error(error));
  } else {
    done(null);
  }
});


async function sendAllVideos(){
    console.log("CRON - Send all video check")
    let configService = new ConfigService(configFile.path);    
    let config = configService.read();

    if (!config.sendVideoAsSoon && dateFormat(new Date(), "HH:MM") === config.dailySendHour){
      console.log("Sending ready videos");
      const sessions = await Session.find({state: 'READY_TO_SEND'});
      sessions.forEach(( session )=> {
        console.log("Video "+ session._id + " is ready to send");
        const newJob = BullJobService.getJobDataSendVideoFromSession(session, false);
        BullQueueService.addJobSendVideo(newJob);
      });

    }
};

async function removeOldVideos() {
  let configService = new ConfigService(configFile.path);    
  let config = configService.read();
  console.log("CRON - Remove old video check");
  const sessions = await Session.find({
    "createdAt": { $lte:  moment().subtract(config.deleteVideo, 'day').toDate()},
  });

  if (sessions){
    for (let session of sessions){
      console.log("Remove session " + session._id);
      try{
        if (session.path)
          fs.removeSync(videoConfig.path+session.path); 
      }finally{
        await session.remove();
      }
    }
  }
};

cron.schedule('*/1 * * * *', () => {
  sendAllVideos();
});
cron.schedule('*/10 * * * *', () => {
  removeOldVideos();
});

console.log("Worker ready");
