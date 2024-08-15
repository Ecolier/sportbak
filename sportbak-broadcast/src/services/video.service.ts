import { Inject, Service } from 'typedi';
import SportbakService from './sportbak.service';

import VideoModel, {IVideo, Video} from '../models/video.model';
import fs from 'fs-extra';
import FieldService from './field.service';
import _path from 'path';


const videoType = 'mp4';
const posterType = 'jpg';

@Service()
export default class VideoService {
    
    constructor(public sportbakService: SportbakService,
                private fieldService: FieldService, 
                @Inject("video.expiration") private expiration:number, 
                @Inject("video.mediaBaseUrl") private  mediaBaseUrl: string, 
                @Inject("video.directories") private videoDirectories: string[]){
            
    }

    async getParentDirectory(video : Video) : Promise<string> {
        let result = this.sportbakService.storageService.getDefaultDirectory(); 
        let videoWithSameSession = null;
        try {
            videoWithSameSession = await VideoModel.findOne({session : video.session});
        } catch(err) {};
        if (videoWithSameSession) {
            result = videoWithSameSession.directory;
        } else {
            result = await this.sportbakService.storageService.getNextDirectory();
        }
        return result;
    }

    async createLocalPath(video : Video) : Promise<string> {
        let result = null;
        const field = await this.fieldService.get(video.field.toString());
        if (field) {
            if (video.session && video.directory) {
                result = video.directory+ field.complexId + "/" + field.fieldId +'/' + 'session_' + video.session + '/' + video._id + "/";
            } else {
                // default path before update model
                const paretnDirectory = this.sportbakService.storageService.getDefaultDirectory();
                result = paretnDirectory + field.complexId + "/" + field.fieldId + "/" + video._id + "/";
            }
        }
        return result;
    }

    getFilenameVideo(video : Video) : string {
        return video._id + '.' + videoType;
    }

    getFilenamePoster(video : Video) : string {
        return video._id + '.' + posterType;
    }

    getSessionLocalDirectoryPath(video : Video) : Promise<string> {
        let result = null;
        if (video.path) {
            try {
                result = _path.join(video.path, '../');
            } catch(err) {}
        }
        return result;
    }

    async getLocalDirectoryPath(video : Video) : Promise<string> {
        let result = null;
        if (video.path) {
            result = video.path;
        } else {
            // default path before update model
            const field = await this.fieldService.get(video.field.toString());
            if (field) {
                const paretnDirectory = this.sportbakService.storageService.getDefaultDirectory();
                result = paretnDirectory + field.complexId + "/" + field.fieldId + "/" + video._id + "/";
            }
        }
        return result;
    }

    async getLocalPathFile(video : Video, filename: string ) : Promise<string>{
        return await this.getLocalDirectoryPath(video) + filename;
    }

    async getLocalPathVideo(video : Video) : Promise<string> {
        return await this.getLocalPathFile(video, this.getFilenameVideo(video));
    }

    async getLocalPathPoster(video : Video) : Promise<string> {
        return await this.getLocalPathFile(video, this.getFilenamePoster(video));
    }

    getMediaUrl(localPath) : string {
        return this.mediaBaseUrl + localPath;
    }

    async getMediaUrlVideo(video : Video) : Promise<string> {
        return this.getMediaUrl(await this.getLocalPathVideo(video));
    }

    async getMediaUrlVideoPoster(video : Video) : Promise<string> {
        return this.getMediaUrl(await this.getLocalPathPoster(video));
    }

    async remove(video : Video) {
        fs.removeSync(await this.getLocalDirectoryPath(video)); 
        const sessionPath = this.getSessionLocalDirectoryPath(video);
        if(sessionPath) {
            try {
                const isEmpty = fs.readdirSync(sessionPath).length === 0;
                if (isEmpty) {
                    fs.removeSync(sessionPath);
                }
            } catch(err){};
        }
        await this.sportbakService.disableURL(await this.getMediaUrlVideo(video));
        await video.remove()
    
    }

    async removeExpiredVideos(){
        let currentDate = new Date();
        const videos = await VideoModel.find({
            "expirationDate": { $lte: currentDate },
        });
        
        if (videos){
            videos.forEach(video => {
                console.log("Video - Removing  - " + video._id + " - expire : " + + video.expirationDate);
                this.remove(video);
            });
        }
    }
}