import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketCommandesMessageAction } from '../constant/socket.commandes.action.constant';
import { Replay } from '../models/replay.model';
import { Session } from '../models/session.model';
import { ConfigService } from './config.service';
import { SocketService } from './socket.service';

export enum SessionLimitReachedType {
  BUZZ,
  VAR,
  GOAL,
  GOAL_TEAM_1,
  GOAL_TEAM_2,
  SESSION_TIME
}

export interface SessionLimitReached {
  type : SessionLimitReachedType;
  team: number; 
  limit: number;
}

export interface SessionStartOptions {
  period: number; 
  warmup: number;
  time: number;
  pauseTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _session$ = new ReplaySubject<Session>(1);
  private _error$ = new ReplaySubject<string>(1);
  private _goal$ = new Subject<void>();
  private _buzz$ = new Subject<void>();
  private _limitReached$ = new Subject<SessionLimitReached>();
  private _replay$ = new Subject<Replay>();

  get session$() { return this._session$.asObservable(); }
  get error$() { return this._error$.asObservable(); }
  get goal$() { return this._goal$.asObservable(); }
  get buzz$() { return this._buzz$.asObservable(); }
  get replay$() { return this._replay$.asObservable(); }
  get limitReached$() { return this._limitReached$.asObservable(); }

  constructor(
    private configService: ConfigService,
    private socketService: SocketService) {
    this.socketService.message(SocketCommandesMessageAction.SESSION_CURRENT_SESSION).pipe(
      map((data : any) => {
        if (data && Object.keys(data).length !== 0) {
          if (data.createdAt) 
            data.createdAt = new Date(data.createdAt);
          if (data.now)
            data.now = new Date(data.now);
          return data;
        }
        return null;
      })).subscribe(this._session$);
    this.socketService.message(SocketCommandesMessageAction.SESSION_ERROR).subscribe(this._error$);
    this.socketService.message(SocketCommandesMessageAction.ACTION_ERROR).subscribe(this._error$);
    this.socketService.message(SocketCommandesMessageAction.SESSION_GOAL).subscribe(this._goal$);
    this.socketService.message(SocketCommandesMessageAction.SESSION_BUZZ).subscribe(this._buzz$);
    this.socketService.message(SocketCommandesMessageAction.SESSION_VAR).subscribe(this._replay$);

    // limits
    this.socketService.message(SocketCommandesMessageAction.LIMIT_REACHED_GOALS).pipe(map((data : SessionLimitReached) => {
      data.type = SessionLimitReachedType.GOAL;
      if (data.team == 1) {
        data.type = SessionLimitReachedType.GOAL_TEAM_1;
      } else if (data.team == 2) {
        data.type = SessionLimitReachedType.GOAL_TEAM_2;
      }
      return data;
    })).subscribe(this._limitReached$);
    this.socketService.message(SocketCommandesMessageAction.LIMIT_REACHED_BUZZS).pipe(map((data : SessionLimitReached) => {
      data.type = SessionLimitReachedType.BUZZ;
      return data;
    })).subscribe(this._limitReached$);
    this.socketService.message(SocketCommandesMessageAction.LIMIT_REACHED_VARS).pipe(map((data : SessionLimitReached) => {
      data.type = SessionLimitReachedType.VAR;
      return data;
    })).subscribe(this._limitReached$);
    this.socketService.message(SocketCommandesMessageAction.LIMIT_REACHED_SESSION_TIME).pipe(map((data : SessionLimitReached) => {
      data.type = SessionLimitReachedType.SESSION_TIME;
      return data;
    })).subscribe(this._limitReached$);

  }
  
  startSession(options?: Partial<SessionStartOptions>) { this.socketService.send(SocketCommandesMessageAction.SESSION_START, options); }
  stopSession() { this.socketService.send(SocketCommandesMessageAction.SESSION_STOP); }
  pauseSession() { this.socketService.send(SocketCommandesMessageAction.SESSION_PAUSE); }
  restartSession() { this.socketService.send(SocketCommandesMessageAction.SESSION_RESTART); }
  addGoalTeam1() { this.socketService.send(SocketCommandesMessageAction.SESSION_ADD_GOAL_TEAM_1); }
  addGoalTeam2() { this.socketService.send(SocketCommandesMessageAction.SESSION_ADD_GOAL_TEAM_2); }
  buzz() { this.socketService.send(SocketCommandesMessageAction.SESSION_BUZZ); }
  undo() { this.socketService.send(SocketCommandesMessageAction.SESSION_UNDO); }
  var() { this.socketService.send(SocketCommandesMessageAction.SESSION_VAR); }
}