import moment from 'moment';
import VideoClient from './video.service';
import SessionModel, { EventType as SessionEventType, Session } from '../models/session.model';
import { Service } from 'typedi';
import ContextService from './context.service';
import defaultSession from '../config/session.config'
import SportbakService from './sportbak.service';
import { StartSessionInput } from '../models/start.session.input';
import BullJobService from './bull.job.service';
import BullQueueService from './bull.queue.service';
import { SocketCommandesMessageAction } from '../constants/socket.commandes.action.constant';

enum Period{
    WARMUP,
    PERIOD,
    HALF,
    PAUSE
}

enum GoalEventType{
    GOAL_TEAM_1 = 1,
    GOAL_TEAM_2,
}

enum EventType {
    BUZZ,
    VAR,
    PAUSE
}

interface GoalEvent{
    type: GoalEventType,
    time: number
}

interface Event{
    type: EventType,
    time: number,       // second
    duration?: number,  // second
}

interface Schedule{
    begin: number,
    pause: number,
    period: Period
}

export interface CurrentSession {
    id : string,
    createdAt: Date,
    now? : Date, // date of currentSession is "get"
    /** Total duration ( computed --> add pauses ) */
    duration: number,           // second
    currentTime : number,       // second
    currentPauseTime : number,  // second
    time: number,               // second
    pauseTime: number,          // second
    teamName1: string,
    teamName2: string,
    sounds: boolean,
    ambiance: boolean,
    warmup: number,             // second
    isPaused: boolean,
    events: Array<Event>,
    goalEvents: Array<GoalEvent>,
    scoreTeam1: number,
    scoreTeam2: number,
    period: number,
    schedule : Array<Schedule>,
    currentPeriod : number,
    videoSessionId : string
}

const redisKeyCurrentSession = "current-session";

@Service("session.service")
export default class SessionService{
    currentSession : CurrentSession;
    scheduler: any;
    onStop: CallableFunction;

    constructor(
        private contextService : ContextService,
        private videoClient : VideoClient){
        this.currentSession = null;
        this.contextService = contextService;
        this.videoClient = videoClient;
        this.videoClient.callbackVideoSession = (videoSessionId : string) => {
            //console.log("this.currentSession - " + videoSessionId + ": ",this.currentSession)
            if (this.currentSession) {
                if (videoSessionId) {
                    this.currentSession.videoSessionId = videoSessionId;
                } else if (this.currentSession.videoSessionId) {
                    this.initVideoRecorder()
                }
            }
        };
        this.scheduler = setInterval(() => {
            this.checkStopSession();
        }, 1000);
        this.onStop = () => {};
    }

    private generateSessionId() {
        return (this.contextService.sportbakService.field?._id || 'no_field') + '-' + new Date().getTime();
    }

    getStartSessionConfiguration(sportbakService : SportbakService, data : StartSessionInput) : StartSessionInput {
        let defaultExternalSession = sportbakService.defaultStartSession || {};
        return Object.assign({}, defaultSession, defaultExternalSession, data);;
    }

    checkStopSession(){
        if (!this.currentSession)
            return;

        const config = this.contextService.configService.getCurrent();
        if (this.currentSession.currentPeriod+1 < this.currentSession.schedule.length && moment().diff(this.currentSession.createdAt, 'second') >= this.currentSession.schedule[this.currentSession.currentPeriod + 1].begin) {
            this.currentSession.currentPeriod = this.currentSession.currentPeriod + 1 ;
            this.currentSession.currentTime = 0;

            if (this.currentSession.currentPeriod+1 < this.currentSession.schedule.length && moment().diff(this.currentSession.createdAt, 'second') >= this.currentSession.schedule[this.currentSession.currentPeriod + 1].begin){
                this.currentSession.currentPeriod = this.currentSession.currentPeriod + 1;
                this.currentSession.currentTime = 0;
            }
            this.setVideoSession();
        }

        if (this.currentSession.isPaused) { 
            this.currentSession.currentPauseTime += 1;
        } else {
            this.currentSession.currentTime += 1;
        }

        this.currentSessionUpdated();

        if (!this.currentSession.isPaused &&  moment().diff(this.currentSession.createdAt, 'second') >= this.currentSession.duration){
            this.stop();
        } else if (moment().diff(this.currentSession.createdAt, 'second') >= config.limitSessionTime) {
            this.contextService.socketCommandesService.broadcast(this.contextService, SocketCommandesMessageAction.LIMIT_REACHED_SESSION_TIME, {limit : config.limitSessionTime});
            this.stop();
        }
    }

    isPeriod(){
        if (this.currentSession){
            let currrentTime = moment().diff(this.currentSession.createdAt, 'second');
            let found = false
            let position = 0;
            while (!found && position < this.currentSession.schedule.length-1){
                if (currrentTime > this.currentSession.schedule[position].begin && currrentTime < this.currentSession.schedule[position+1].begin){
                   found = true;
                } else {
	                position = position+1;	
		        }
            }
            return this.currentSession.schedule[position].period == Period.PERIOD; 
            
        }else {
		    return false;
        }

    }

    computeScheduler(){
        if (this.currentSession){
            this.currentSession.duration = this.currentSession.warmup + this.currentSession.period * this.currentSession.time + ( (this.currentSession.period - 1) * this.currentSession.pauseTime );
            this.currentSession.schedule = [
                {begin:0, period: Period.WARMUP, pause:0},
                {begin:this.currentSession.warmup, period: Period.PERIOD, pause:0}
            ];

            for (let i=2; i<=this.currentSession.period; i++){
                this.currentSession.schedule.push({begin:this.currentSession.schedule[this.currentSession.schedule.length-1].begin+this.currentSession.time, period: Period.HALF, pause:0});
                this.currentSession.schedule.push({begin:this.currentSession.schedule[this.currentSession.schedule.length-1].begin+this.currentSession.pauseTime, period: Period.PERIOD, pause:0});
            }

            for (const event of this.currentSession.events){
                if (event.type == EventType.PAUSE){
                    this.currentSession.duration += event.duration;
                    const from = event.time;
                    let found = false;
                    let position = 0;
                    while (!found && position < this.currentSession.schedule.length-1){
                        if (from >= this.currentSession.schedule[position].begin && from < this.currentSession.schedule[position+1].begin){
                            this.currentSession.schedule[position+1].begin += event.duration;
                            this.currentSession.schedule[position].pause += event.duration 
                            for (let i=position+2; i<this.currentSession.schedule.length; i++){
                                this.currentSession.schedule[i].begin = this.currentSession.schedule[i].begin + event.duration;
                            }
                            found = true;
                        }
                        position = position+1;
                    }
                }
            }
            this.currentSessionUpdated();
        }
    }

    hasCurrentSession(){
        return this.currentSession !== null;
    }

    getCurrentSession(){
        if (this.currentSession)
            this.currentSession.now = new Date();
        return this.currentSession;
    }

    pause(){
        if (this.hasCurrentSession() && this.currentSession.isPaused == false){
            this.contextService.overlayService.pauseSession();
            this.videoClient.pause()
            this.currentSession.isPaused = true;
            this.currentSession.events.push({type: EventType.PAUSE, time: moment().diff(this.currentSession.createdAt, 'second')});
            this.currentSessionUpdated();
        }
    }

    reset(){
        if (this.hasCurrentSession()){
            const config = this.contextService.configService.read();
            this.videoClient.stop();
            const now = new Date();
            this.currentSession = { 
                "id" : this.generateSessionId(),
                "createdAt": now,
                "duration": 0,
                "currentTime" : 0,
                "currentPauseTime" : 0,
                "time": this.currentSession.time, 
                'period': this.currentSession.period,
                "pauseTime": this.currentSession.pauseTime, 
                "teamName1": this.currentSession.teamName1,
                "teamName2": this.currentSession.teamName2,
                "sounds": this.currentSession.sounds,
                "ambiance": this.currentSession.ambiance,
                "warmup": this.currentSession.warmup,
                "isPaused": false,
                "events": [],
                "goalEvents": [],
                "scoreTeam1": 0,
                "scoreTeam2": 0,
                "schedule": [],
                "currentPeriod": 0,
                "videoSessionId" : null
            }
            
            this.computeScheduler();

            if (this.currentSession.warmup > 0){
                this.currentSession.currentPeriod = 0;
            }else{
                this.currentSession.currentPeriod = 1;
            }
            this.currentSessionUpdated();
        
            this.setVideoSession();
            this.videoClient.start(config.overlay.enabled);
            this.contextService.overlayService.resetSession();
            
        }else{
            throw Error("Session not already exist");
        }
    }

    stop(){
        if (this.hasCurrentSession()){
            const session = new SessionModel();
            const now = new Date();
            
            session.path = this.videoClient.videoSessionId;
            session.state = "READY_TO_ENCODE";
            session.startAt = this.currentSession.createdAt;
            session.duration = moment(now).diff(moment(session.startAt), 'second'); //this.currentSession.duration;
            session.endedAt = now;
            session.events = [];
            for (const event of this.currentSession.goalEvents){
                session.events.push({time: event.time, type: SessionEventType.GOAL});
            }

            for (const event of this.currentSession.events){
                if (event.type == EventType.PAUSE){
                    session.events.push({time: event.time, duration: event.duration, type: SessionEventType.PAUSE});
                } else if (event.type == EventType.BUZZ) {
                    session.events.push({time: event.time, type: SessionEventType.BUZZ});
                } else if (event.type == EventType.VAR) {
                    session.events.push({time: event.time, type: SessionEventType.VAR});
                }
            }

            const newJob = BullJobService.getJobDataEncodeVideoFromSession(session, this.currentSession)
            session.save().then(( session ) => {
                BullQueueService.addJobEncodeVideo(newJob);
                this.videoClient.stop();
            });

            this.currentSession = null;
            this.currentSessionUpdated();   
            this.contextService.overlayService.stopSession();         
        }else {
            throw new Error("Session not started");
        }
        this.onStop();
    }

    setTeamName(teamName1:string, teamName2:string){
        if(this.hasCurrentSession()){
            this.currentSession.teamName1 = teamName1;
            this.currentSession.teamName2 = teamName2;
            this.currentSessionUpdated();
            this.setVideoSession();
        }
    }

    setScore(scoreTeam1: number, scoreTeam2:number){
        if (this.hasCurrentSession()){
            if (scoreTeam1 >= 0 && scoreTeam2 >= 0){
                this.currentSession.scoreTeam1 = scoreTeam1;
                this.currentSession.scoreTeam2 = scoreTeam2;
                this.currentSessionUpdated();
                this.setVideoSession();
            }else {
                throw new TypeError("scoreTeam1 and scoreTeam2 must be positive or null");
            }            
        }else {
            throw new Error("Session not started");
        }
    }

    restart(){
        if (this.hasCurrentSession() && this.currentSession.isPaused){
            this.currentSession.isPaused = false;
            this.currentSession.events[this.currentSession.events.length-1].duration = moment().diff(this.currentSession.createdAt, 'second') - this.currentSession.events[this.currentSession.events.length-1].time;
            this.computeScheduler();
            this.currentSessionUpdated();
            this.videoClient.restart()
            this.contextService.overlayService.restartSession(); 
        }
    }

    private addGoal(goalEvent : GoalEventType) {
        if (this.hasCurrentSession() && !this.currentSession.isPaused && this.isPeriod()){
            this.currentSession.goalEvents.push({type: goalEvent, time: moment().diff(this.currentSession.createdAt, 'second')});
            if (goalEvent == GoalEventType.GOAL_TEAM_1) {
                this.currentSession.scoreTeam1 += 1;
                this.contextService.overlayService.addGoalTeam1();
            }
            else if (goalEvent == GoalEventType.GOAL_TEAM_2) {
                this.currentSession.scoreTeam2 += 1;
                this.contextService.overlayService.addGoalTeam2();
            }
            this.currentSessionUpdated();
            this.setVideoSession();
            return true;
        }
        return false;
    }

    addGoalTeam1(){
        return this.addGoal(GoalEventType.GOAL_TEAM_1);
    }

    addGoalTeam2(){
        return this.addGoal(GoalEventType.GOAL_TEAM_2);

    }

    private getGoalCount(goalEvent : GoalEventType) {
        if (this.hasCurrentSession()) {
            if (goalEvent == GoalEventType.GOAL_TEAM_1)
                return this.currentSession.scoreTeam1;
            else if (goalEvent == GoalEventType.GOAL_TEAM_2)
                return this.currentSession.scoreTeam2;
        }
        return 0;
    }

    getGoalCountTeam1() {
        return this.getGoalCount(GoalEventType.GOAL_TEAM_1);
    }

    getGoalCountTeam2() {
        return this.getGoalCount(GoalEventType.GOAL_TEAM_2);
    }

    private canAddGoal(goalEvent : GoalEventType, limit : number) {
        if (limit > 0) {
            return this.getGoalCount(goalEvent) < limit;
        }
        return true;
    }

    canAddGoalTeam1(limit : number) {
        return this.canAddGoal(GoalEventType.GOAL_TEAM_1, limit);
    }

    canAddGoalTeam2(limit : number) {
        return this.canAddGoal(GoalEventType.GOAL_TEAM_2, limit);
    }

    undo(){
        if (this.hasCurrentSession() && this.currentSession.goalEvents?.length){
            let goalEvent = this.currentSession.goalEvents[this.currentSession.goalEvents.length-1];
            if (goalEvent.type == GoalEventType.GOAL_TEAM_1){
                this.currentSession.scoreTeam1 = this.currentSession.scoreTeam1 - 1;
            }else if (goalEvent.type == GoalEventType.GOAL_TEAM_2){
                this.currentSession.scoreTeam2 = this.currentSession.scoreTeam2 - 1;
            }
            this.currentSession.goalEvents.splice(this.currentSession.goalEvents.length-1, 1);
            this.currentSessionUpdated();
            this.setVideoSession()
        }
    }

    private getEventCount(event : EventType) {
        if(this.hasCurrentSession() && this.currentSession.events) {
            return this.currentSession.events.filter((e) => e.type == event).length;
        }
        return 0;
    }

    getBuzzCount() {
        return this.getEventCount(EventType.BUZZ);
    }

    getVarCount() {
        return this.getEventCount(EventType.VAR);
    }

    private canExecuteEvent(event : EventType, limit : number) {
        if (limit > 0) {
            return this.getEventCount(event) < limit;
        }
        return true;
    }

    private executeEvent(event : EventType) {
        if(this.hasCurrentSession() && !this.currentSession.isPaused){
            this.currentSession.events.push({type: event, time: moment().diff(this.currentSession.createdAt, 'second')});
            this.currentSessionUpdated();
            return true;
        }
        return false;
    }

    canExecuteBuzz(limit : number) {
        return this.canExecuteEvent(EventType.BUZZ, limit);
    }

    canExecuteVar(limit : number) {
        return this.canExecuteEvent(EventType.VAR, limit);
    }

    buzz(){
        this.contextService.overlayService.buzz();
        return this.executeEvent(EventType.BUZZ);
    }

    var(){
        this.contextService.overlayService.var();
        return this.executeEvent(EventType.VAR);
    }

    createSession(time: number, period: number, pauseTime: number, 
                  teamName1: string, teamName2: string, sounds: boolean, ambiance: boolean, 
                  warmup: number){
        const config = this.contextService.configService.read();
        if (this.currentSession === null){
            let now = new Date();
            this.currentSession = {
                "id" : this.generateSessionId(),
                "createdAt": now,
                "duration": 0,
                "currentTime" : 0,
                "currentPauseTime" : 0,
                "time": time, 
                'period': period,
                "pauseTime": pauseTime, 
                "teamName1": teamName1,
                "teamName2": teamName2,
                "sounds": sounds,
                "ambiance": ambiance,
                "warmup": warmup,
                "isPaused": false,
                "events": [],
                "goalEvents": [],
                "scoreTeam1": 0,
                "scoreTeam2": 0,
                "schedule": [],
                "currentPeriod" : warmup > 0 ? 0 : 1,
                "videoSessionId" : null
            }
            this.setVideoSession();
            this.videoClient.start(config.overlay.enabled)
            this.computeScheduler();
            this.currentSessionUpdated();
        }else{
            throw Error("Session already exist");
        }
    }

    private currentSessionUpdated() {
        this.save();
    }

    private updateTimes() {
        if (this.currentSession) {
            const cs = this.currentSession;
            let currentPauseTime = 0;
            let currentTime = 0;
            const relCurrentTimeMatch = moment().diff(cs.createdAt, 'second');
            let found = false;
            let currentPeriod = 1;
            while (!found && currentPeriod < cs.schedule.length) {
                if (relCurrentTimeMatch < cs.schedule[currentPeriod].begin) {
                    currentPeriod = currentPeriod - 1
                    found = true;
                } else {
                    currentPeriod++;
                }
            }

            if (!found) {
            currentPeriod = cs.schedule.length - 1;
            }

            let currentPauseTimeInPeriod = 0;
            for (let e of cs.events) {
                if (e.type == EventType.PAUSE) {
                    if (e.duration) {
                        currentPauseTime += e.duration;
                    } else {
                        currentPauseTimeInPeriod = (moment().diff(cs.createdAt, 'second')- e.time);
                        currentPauseTime += currentPauseTimeInPeriod;
                    }
                }
            }
    
            currentTime = relCurrentTimeMatch - cs.schedule[currentPeriod].begin - cs.schedule[currentPeriod].pause - currentPauseTimeInPeriod;

            this.currentSession.currentTime = currentTime;
            this.currentSession.currentPauseTime = currentPauseTime;
            this.currentSession.currentPeriod = currentPeriod;
        }
    }

    // ------------------------------------ //
    // ------------- VIDEO CLIENT ---------------- //
    // ------------------------------------ //

    async initVideoRecorder() {
        if (this.currentSession && !this.videoClient.alreadyInitialised) {
            const config = this.contextService.configService.read();
            this.setVideoSession();
            this.videoClient.initVideoRecorder(this.currentSession.videoSessionId, config.overlay.enabled);
        }
    }

    async setVideoSession() {
        const cs = this.currentSession;
        let period = "";
        if (this.currentSession.currentPeriod == 0){
            period = "Échauffement"
        } else if (this.currentSession.currentPeriod % 2 == 0) { // pause
            period = "Mi-temps";
        } else if (this.currentSession.currentPeriod % 2 == 1) { // play
            if(this.currentSession.currentPeriod == 1) {
                period = "1re période"
            } else {
                period = Math.ceil(this.currentSession.currentPeriod / 2) + "e période";
            }
        }
        this.videoClient.setSession(cs.scoreTeam1, cs.scoreTeam2, cs.teamName1, cs.teamName2, 
            cs.currentTime, period, cs.isPaused);
    }


    // ------------------------------------ //
    // ------------- REDIS ---------------- //
    // ------------------------------------ //

    async reload() {
        this.currentSession = await this.contextService.redisService.get(redisKeyCurrentSession);
        this.updateTimes();
    }

    private async save() {
        let data : any = null;
        if (this.currentSession) {
            data = {... this.currentSession};
            delete data.now;
        }
        await this.contextService.redisService.set(redisKeyCurrentSession, data);
    }
}
