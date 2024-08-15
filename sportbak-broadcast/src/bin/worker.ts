'use strict';

// Add context in req
declare global {
  namespace Express {
    interface Request {
      clientIp : string,
      fromLocalhost : boolean
    }
  }
}

import 'reflect-metadata';


import { load as loadMongoose } from '../loaders/mongoose.loader'
import { load as loadConfig } from '../loaders/config.loader'
import SportbakService from '../services/sportbak.service';
import Container from 'typedi';
import VideoService from '../services/video.service';
import cron from 'node-cron';

loadMongoose();
loadConfig();

const videoService = Container.get(VideoService);

function cleanVideos() {
  let currentDate = new Date();
  console.log("Deleting old video files where expirationDate <= " + currentDate);
  videoService.removeExpiredVideos();      
  console.log("End video check for " + currentDate);
}
  
cron.schedule('* 2 * * *', () => {
  cleanVideos();
});
cleanVideos();

console.log("Worker ready");
