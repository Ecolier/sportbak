import axios from 'axios';
import fs from 'fs';
import sleep from 'sleep-promise';
import { Service } from 'typedi';
import moment from 'moment';
import { start } from '../controllers/session.controller';

const Ko = 1024;
const Mo = 1024 * Ko;

const retryTimeout = 2000;
const maxRetryCount = 50;

class UploaderException{
    fileId: string;
    byteSent: number;

    constructor(fileId, byteSent){
        this.fileId = fileId;
        this.byteSent = byteSent;
    }

    toString() {
        return JSON.stringify(this, null,2);
    }
}

@Service("uploader.service")
export default class UploaderService{
    serviceURL: string;
    apiKey: string;
    apiSecret: string;
    chunkSizeUpload : number;

    constructor(serviceUrl: string, apiKey: string, apiSecret: string, chunkSizeUpload : number){
        this.serviceURL = serviceUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.chunkSizeUpload = chunkSizeUpload;
    }

    async createVideoEntry(sessionId: string, fileType: string, type: string, startAt: Date, duration: number){
        const headers = {
            'X-APIKEY': this.apiKey, 
            'X-APISECRET': this.apiSecret
        }
        const resp = await axios.post(this.serviceURL + '/videos', {'sessionId' : sessionId, 'fileType': fileType, 'type': type, 'startAt': startAt, 'endAt': moment(startAt).add(duration, 'second').toDate(), 'duration': duration }, {
            headers: headers
        });
        console.log("Entry created "+ resp.data['_id']);
        return resp.data['_id'];
    }

    private async publishFile(id, file, endpoint: string, 
        callback: (progress, step, total)=> Promise<void> = null,
        sendChunk : (chunkIndex) => boolean = (chunkIndex) => {return true;}){
        try{
            const size = fs.statSync(file).size;
            const fd = fs.openSync(file, 'r');
            
            const chunkSizeUpload = Math.ceil(this.chunkSizeUpload * Mo);

            let start = 0;
            let chunkCount = Math.ceil(size/chunkSizeUpload);
            let sentChunkCount = 0;
            let success = false;
            let retry = 0;
            if (callback) {
                await callback(0, 0, chunkCount);
            }
            const buf = Buffer.alloc(chunkSizeUpload);
            while (true){
                const end = Math.min(size, start + chunkSizeUpload);
                fs.readSync(fd, buf, 0, end-start, null);
                try {
                    if (!sendChunk || sendChunk(sentChunkCount + 1)) {
                        const response = await axios.post(endpoint, buf, {
                            headers: {
                                'X-APIKEY': this.apiKey, 
                                'X-APISECRET': this.apiSecret,
                                'Content-Type': 'application/octet-stream', 
                                'Range': 'bytes='+start+'-'+end+'/'+size+''
                            }
                        });
                        if (callback) {
                            await callback(sentChunkCount/chunkCount, sentChunkCount + 1, chunkCount);
                        }
                    }

                    sentChunkCount = sentChunkCount + 1;
                    
                    start = end;
                    retry = 0;
                }
                catch (e) {
                    console.log('Exception when sending chunck ... retrying catch ' + e);
                    if (retry >= maxRetryCount){
                        throw new UploaderException(id, sentChunkCount);
                    }
                    retry = retry + 1 ;
                    await sleep(retryTimeout);
                }
                
                if (sentChunkCount >= chunkCount){
                    if (callback) {
                        await callback(100, sentChunkCount, chunkCount);
                    }
                    success = true;
                    break;
                }

            }

            fs.closeSync(fd);
        } catch (e){
            throw new UploaderException(id, 0);
        }
    }

    async publishPoster(id:string, file:string, 
        callback: (progress, step, total)=>Promise<void> = null,
        sendChunk : (chunkIndex) => boolean = (chunkIndex) => {return true;}){          
        const endpoint = this.serviceURL + '/videos/' + id + '/poster'
        await this.publishFile(id, file, endpoint, callback, sendChunk);
    }

    async publishMp4(id:string, file: string,
        callback: (progress, step, total)=>Promise<void> = null,
        sendChunk : (chunkIndex) => boolean = (chunkIndex) => {return true;}){
        const endpoint = this.serviceURL + '/videos/' + id;
        await this.publishFile(id, file, endpoint, callback, sendChunk);
    }

}
