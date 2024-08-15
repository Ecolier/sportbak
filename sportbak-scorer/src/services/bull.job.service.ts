import Bull from 'bull';
import SessionModel, { EventType, Session } from "../models/session.model";
import ConfigService from './config.service';
import configFile from '../config/file.config';
import { CurrentSession } from "./session.service";

const currentJobVersion = 1;

enum BullJobDataProgressStatus {
    waiting = 'waiting',
    processing = 'processing',
    finished = 'finished'
}

interface BullJobDataProgress {
    id : string,
    step : number,
    total : number,
    status : BullJobDataProgressStatus,
    totalProgress : number
}

interface BullJobData {
    progress : BullJobDataProgress[],
    jobCreatedAt : Date,
    jobStartedAt : Date,
    jobStartCount : number,
    jobUpdatedAt : Date,
    jobFinished : Date,
    _v : number // job version
}

interface BullJobDataSession extends BullJobData {
    id : string,
    videoSessionId : string,
    start : Date,
    end : Date,
    duration : number,
    buzzs : number,
    goals : number,
    vars : number,
    pauses : number,
    events : number,
    sport : string
    details? : string
}

export type BullJob<T = BullJobData> = Bull.Job<T>

export interface BullJobDataEncodeVideo extends BullJobDataSession{}
export interface BullJobDataSendVideo extends BullJobDataSession{
    send_full_video : boolean;
    send_goal_videos : boolean;
    send_buzz_videos : boolean;
    send_var_videos : boolean;
    asap? : boolean;
    fullVideoEntryId? : string;
}

export default abstract class BullJobService {
    private static getJobDataFromSession(session : Session, currentSession : CurrentSession = null) : BullJobDataSession {
        let result = null;
        if (session) {
            let goals = [];
            let buzzs = [];
            let pauses = [];
            let vars = [];
            if (session.events) {
                goals = session.events.filter((e) => e.type == EventType.GOAL);
                buzzs = session.events.filter((e) => e.type == EventType.BUZZ);
                vars = session.events.filter((e) => e.type == EventType.VAR);
                pauses = session.events.filter((e) => e.type == EventType.PAUSE);
            }
            result = {
                _v : currentJobVersion,
                id: session._id,
                videoSessionId : session.path,
                start : session.startAt,
                end : session.endedAt,
                duration : session.duration,
                buzzs : buzzs.length,
                goals : goals.length,
                vars : vars.length,
                pauses : pauses.length,
                events : session.events ? session.events.length : 0,
                sport : "foot5"
            }
        }
        if (currentSession) {
            const nameForQueue = currentSession.teamName1 + " VS " + currentSession.teamName2
            + " : " + currentSession.scoreTeam1 + "/" + currentSession.scoreTeam2;
            result['details'] = nameForQueue;
        }
        result.jobCreatedAt = new Date();
        result.jobStartedAt = null;
        result.jobStartCount = 0;
        result.jobUpdatedAt = null;
        return result;
    }
    static getJobDataEncodeVideoFromSession(session : Session, currentSession : CurrentSession = null) : BullJobDataEncodeVideo {
        let result = BullJobService.getJobDataFromSession(session, currentSession);
        result.progress = BullJobService.getJobDataProgressEncodeVideo(session);
        return result;
    }

    private static getJobDataProgressEncodeVideo(session : Session) : BullJobDataProgress[] {
        return [
            {
                id : 'init', step : 0, total : 3, totalProgress : 1, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'encode_full_video', step : 0, total : 3, totalProgress : 70, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'encode_event_videos', step : 0, total : session.events ? session.events.length : 0, totalProgress : 28, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'finishing', step : 0, total : 2, totalProgress : 1, 
                status : BullJobDataProgressStatus.waiting
            }
        ]
    }

    private static getJobDataProgressSendVideo(data : BullJobDataSession | Session) : BullJobDataProgress[] {
        let events = 0;
        if (data.events != undefined) {
            if (Array.isArray(data.events)) {
                events = data.events.length;
            } else {
                events = data.events;
            }
        }
        return [
            {
                id : 'init_publish_video', step : 0, total : 1, totalProgress : 1, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'publish_video', step : 0, total : null /* to defined */, totalProgress : 70, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'publish_event_videos', step : 0, total : events, totalProgress : 28, 
                status : BullJobDataProgressStatus.waiting
            },
            {
                id : 'finishing', step : 0, total : 1, totalProgress : 1, 
                status : BullJobDataProgressStatus.waiting
            }
        ]
    }

    static getJobDataSendVideoFromSession(session : Session, asap : boolean) : BullJobDataSendVideo {
        const configService = new ConfigService(configFile.path);    
        const config = configService.read();
        let result : BullJobDataSendVideo = {
            send_full_video : config.sendFullVideo,
            send_buzz_videos : config.sendBuzzVideo,
            send_goal_videos : config.sendGoalVideo,
            send_var_videos : config.sendVarVideo,
            ...BullJobService.getJobDataFromSession(session)
        };
        result.asap = asap;
        result.progress = BullJobService.getJobDataProgressSendVideo(result);
        return result;
    }

    static getJobDataSendVideoFromJobEncodeVideo(job : BullJobDataEncodeVideo, asap : boolean) : BullJobDataSendVideo {
        const configService = new ConfigService(configFile.path);    
        const config = configService.read();
        let result : BullJobDataSendVideo = {
            ... job, 
            send_full_video : config.sendFullVideo,
            send_buzz_videos : config.sendBuzzVideo,
            send_goal_videos : config.sendGoalVideo,
            send_var_videos : config.sendVarVideo,
            asap : asap, 
            progress : BullJobService.getJobDataProgressSendVideo(job)
        };
        result.jobCreatedAt = new Date();
        result.jobStartedAt = null;
        result.jobStartCount = 0;
        result.jobUpdatedAt = null;
        return result;
    }

    static getTotalProgress(jobData : BullJobData) {
        let result = 0;
        if (jobData?.progress) {
            for (let p of jobData.progress) {
                if (p.status == BullJobDataProgressStatus.processing) {
                    result+= Math.floor(p.totalProgress * p.step / p.total)
                } else if (p.status == BullJobDataProgressStatus.finished) {
                    result+= p.totalProgress;
                }
            }
        }
        return result;
    }

    static async updateJobProgress(job : BullJob, id : string, step : number, total : number = null) {
        //console.log("Update job progress - " + (job.data as any).id + " - " + id + " : " + step);
        if (job.data?.progress) {
            for (let i = 0; i < job.data.progress.length; i++) {
                if (job.data.progress[i].id == id) {
                    job.data.progress[i].step = step;
                    if (total !== null) {
                        job.data.progress[i].total = total;
                    }
                    if (step >= job.data.progress[i].total) {
                        job.data.progress[i].status = BullJobDataProgressStatus.finished;
                    } else {
                        job.data.progress[i].status = BullJobDataProgressStatus.processing;
                    }
                    job.data.jobUpdatedAt = new Date();
                    await job.update(job.data);
                    await job.progress(BullJobService.getTotalProgress(job.data));
                    break;
                }
            }
        }
    }

    static async jobFinished(job : BullJob) {
        if (job.data?.progress) {
            job.data.jobUpdatedAt = new Date();
            job.data.jobFinished = new Date();
            await job.update(job.data);
        }
    }

    static processBlock(job : BullJob, id : string, step : number) : boolean {
        const jobData = job.data;
        let result = true;
        if (jobData?.progress) {
            for (let i = 0; i < jobData.progress.length; i++) {
                if (jobData.progress[i].id == id) {
                    if (jobData.progress[i].step >= step || jobData.progress[i].status == BullJobDataProgressStatus.finished) {
                        result = false;
                        if (step == 0 && jobData.progress[i].status == BullJobDataProgressStatus.waiting) {
                            result = true;
                        }
                    }
                    break;
                }
            }
        }
        return result;
    }

    static partIsFinished(job : BullJob, id : string) : boolean {
        const jobData = job.data;
        let result = false;
        if (jobData?.progress) {
            for (let i = 0; i < jobData.progress.length; i++) {
                if (jobData.progress[i].id == id) {
                    if (jobData.progress[i].status == BullJobDataProgressStatus.finished) {
                    }
                    break;
                }
            }
        }
        return result;
    }

    static async reformatEncoreVideoJobIfNeeded(job : BullJob<BullJobDataEncodeVideo>) {
        let data = job.data;
        let updateNeeded = false;

        if (!data.progress) {
            try {
                const sessionId = data.id;
                const session = await SessionModel.findById(sessionId);
                if (session) {
                    data.progress = BullJobService.getJobDataProgressEncodeVideo(session);
                    updateNeeded = true;
                }
            } catch (err) {}
        }

        if (updateNeeded) {
            await job.update(data);
        }
    }

    static async reformatSendVideoJobIfNeeded(job : BullJob<BullJobDataSendVideo>) {
        let data = job.data;
        let updateNeeded = false;

        if (!data.progress) {
            try {
                const sessionId = data.id;
                const session = await SessionModel.findById(sessionId);
                if (session) {
                    data.progress = BullJobService.getJobDataProgressSendVideo(session);
                    updateNeeded = true;
                }
            } catch (err) {}
        }

        if (updateNeeded) {
            await job.update(data);
        }
    }

    static async startJob(job : BullJob) {
        let data = job.data;
        if (data) {
            data.jobStartedAt = new Date();
            data.jobUpdatedAt = new Date();
            data.jobStartCount = data.jobStartCount ? data.jobStartCount + 1 : 1;
            await job.update(data);
        }
    }
}