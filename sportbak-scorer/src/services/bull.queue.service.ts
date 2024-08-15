import redisConfig from '../config/redis.config';
import Queue from 'bull';
import Bull from 'bull';
import { BullJobDataEncodeVideo, BullJobDataSendVideo } from './bull.job.service';

const sendVideoQueue = new Queue('sendVideo', redisConfig.url);
const encodeVideoQueue = new Queue('encodeVideo', redisConfig.url);
const test = new Queue('test', redisConfig.url);

type BullQueueGeneric<T> = Bull.Queue<T>;
type BullQueueGenericCallback<T> = Bull.ProcessCallbackFunction<T>;

export type BullQueueSendVideoCallback = BullQueueGenericCallback<BullJobDataSendVideo>;
export type BullQueueEncodeVideoCallback = BullQueueGenericCallback<BullJobDataEncodeVideo>;

export default abstract class BullQueueService {

    // ------------------------------------------ //
    // --------------- PROCESS ------------------ //
    // ------------------------------------------ //

    private static process<T = any>(queue : BullQueueGeneric<T>, callback : BullQueueGenericCallback<T>) {
        return queue.process(callback);
    }

    static processSendVideo(callback : BullQueueSendVideoCallback) {
        return BullQueueService.process<BullJobDataSendVideo>(sendVideoQueue, callback);
    }

    static processEncodeVideo(callback : BullQueueEncodeVideoCallback) {
        return BullQueueService.process<BullJobDataSendVideo>(encodeVideoQueue, callback);
    }

    // ------------------------------------------ //
    // --------------- JOB ------------------ //
    // ------------------------------------------ //

    private static addJob<T = any>(queue : BullQueueGeneric<T>, data : T) {
        return queue.add(data);
    }

    static addJobSendVideo(job : BullJobDataSendVideo) {
        return BullQueueService.addJob<BullJobDataSendVideo>(sendVideoQueue, job);
    }

    static addJobEncodeVideo(job : BullJobDataEncodeVideo) {
        return BullQueueService.addJob<BullJobDataEncodeVideo>(encodeVideoQueue, job);
    }   
    
    // ------------------------------------------ //
    // --------------- JOB ------------------ //
    // ------------------------------------------ //

    /*static processTest() {
        BullQueueService.process<any>(test, async (job, done) => {
            //console.log("Job : ", job);
            console.log("Job - data : ", job.data);
            await new Promise((resolve) => {
                let index = 0;
                setInterval(async () => {
                    index++;
                    console.log("Progress : " + index);
                    job.progress(index)
                    await job.update({
                        ...job.data,
                        step : 1,
                        progress : index
                    })
                },5000) 
            });
            done();
        });
    }

    static addTest() {
        BullQueueService.addJob<any>(test, {id : "test1"});
    }*/
}

/*BullQueueService.processTest();
BullQueueService.addTest();*/