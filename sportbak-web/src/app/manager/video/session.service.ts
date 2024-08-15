import { Inject, Injectable, InjectionToken } from '@angular/core';
import { from, fromEvent, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { buffer, bufferCount, filter, map, mergeAll, mergeMap, reduce, scan, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { Field } from '../../shared/models/field.model';
import { DEFAULT_SESSION } from '../settings/default-session-settings';
import { SessionSettings } from '../settings/settings.model';
import { SessionSettingsService } from '../settings/settings.service';
import { Session, SessionEvent } from './session.model';
import { Conf } from 'src/app/conf';
import { HttpClient } from '@angular/common/http';


type SocketError = { code?: number, message: string, data?: any };
export interface ScorerHost {
  localIPAddresses: string;
}

export type FieldHostList = { [fieldId: string]: ScorerHost };
export type HostMessage = [string, string, ScorerHost];
export type SessionMessage = [string, string, any];
export type IsConnectedMessage = [string, boolean];
export interface VideoSupportStatus {
  [fieldId: string]: boolean;
}

export interface VideoServiceMessage {
  action: string;
  params: any;
}

export interface VideoConnectionInfo {
  url: string;
  token: string;
};

export const SBK_VIDEO_CONNECTION_INFO = new InjectionToken<VideoConnectionInfo>('connection.info', {
  providedIn: 'root', factory: () => {
    return { token: localStorage.getItem('managerToken'), url: Conf.videoBaseUrl + '/manage' };
  }
});

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private socket?: Socket;

  private messages = new Map<string, ReplaySubject<SessionMessage>>();
  private hosts: FieldHostList = {};

  connect$ = new Subject<void>();
  disconnect$ = new Subject<void>();
  connectError$ = new Subject<any>();
  isConnected$ = new Subject<IsConnectedMessage>();
  session$: Observable<[string, Session?]>;
  error$ = new Subject<string>();

  checkIfConnected(field: Field) {
    this.isConnected(field._id);
    return this.isConnected$;
  }

  getVideoSupportStatusForFields(fields: Field[]) {
    return from(fields).pipe(
      switchMap((field) => this.checkIfConnected(field)),
      take(fields.length),
    ).pipe(
      reduce((acc, isConnectedMessage) => ({ ...acc, [isConnectedMessage[0]]: isConnectedMessage[1] }), {}),
    );
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(SBK_VIDEO_CONNECTION_INFO) private connectionInfo: VideoConnectionInfo,
    private sessionSettingsService: SessionSettingsService) { }


  getVideoToken() {
    return this.httpClient.get<{ token: string }>(`${Conf.videoBaseUrl}/manager/socket/token`, {
      headers: {
        Authorization: `Bearer ${this.connectionInfo.token}`,
      },
    });
  }

  private currentVideoToken?: string;

  private _connect(videoToken: string) {
    
  }

  connect(fields: Field[]) {

    const _connect = (videoToken) => {

      this.socket = io(this.connectionInfo.url, {
        query: {
          token: videoToken,
          _v: '1.1',
        },
      });

      fromEvent(this.socket, 'error').subscribe((data: SocketError) => {
        if (data.code === 7 || data.code === 8 || data.code === 10 || data.code === 11) {
          this.socket.disconnect();
          this.socket = null;
          this.getVideoToken().subscribe((response) => _connect(response.token));
        }
      });

      fromEvent(this.socket, 'connect').subscribe(this.connect$);
      fromEvent(this.socket, 'connect-error').subscribe(this.connectError$);
      fromEvent(this.socket, 'disconnect').subscribe(this.disconnect$);
      fromEvent(this.socket, 'isConnected').subscribe(this.isConnected$);

      fields.forEach((field) => {
        const subject = new ReplaySubject<SessionMessage>(1);
        this.messages.set(field._id, subject);
        fromEvent<SessionMessage>(this.socket, 'message').pipe(
          filter(([fieldId, action, params]) => fieldId === field._id),
        ).subscribe(subject);
        this.onMessage(field._id, 'session/error').pipe(
          map(([field, action, params]) => params),
        ).subscribe(this.error$);
      });
    }

    this.getVideoToken().subscribe((response) => _connect(response.token));
  }

  disconnect() {
    this.socket?.disconnect();
  }

  onHost(filterByField?: string): Observable<ScorerHost> {
    return this.onMessage(filterByField, 'status/ipaddresses').pipe(
      tap(([field, action, params]) => this.hosts[field] = params),
      map(([field, action, params]) => params),
    );
  }

  getHost(forField: string): Observable<ScorerHost> {
    if (this.hosts[forField]) return of(this.hosts[forField]);
    else return this.onHost(forField);
  }

  onSession(filterByField?: string): Observable<Session | undefined> {
    return this.onMessage(filterByField, 'session/current-session').pipe(
      map(([field, action, params]) => Object.keys(params).length !== 0 ? params : undefined),
    );
  }

  onMessage(fieldId?: string, action?: string) {
    return this.messages.get(fieldId).pipe(
      filter(([field, _action, params]) => action === _action),
    );
  }

  sendCommand(field: string, command: string, params: object = {}) {
    this.socket.emit('command', field, command, params);
  }

  isConnected(fieldId: string) {
    this.socket.emit('isConnected', fieldId);
  }

  async start(fieldId: string, overrideSettings?: SessionSettings) {
    const localSettings = overrideSettings;
    const fieldSettingsFallback = await this.sessionSettingsService.getDefaultSessionSettingsForField(fieldId).toPromise();
    const complexLocalFallback = await this.sessionSettingsService.getDefaultSessionSettingsForComplex().toPromise();
    const settings = localSettings ?? fieldSettingsFallback ?? complexLocalFallback ?? DEFAULT_SESSION;

    this.sendCommand(fieldId, 'session/start', {
      time: settings.time * 60,
      period: settings.period,
      pauseTime: settings.pauseTime * 60,
      teamName1: settings.teamName1,
      teamName2: settings.teamName2,
      sounds: settings.sound,
      ambiance: settings.ambiance,
      warmup: settings.warmup * 60,
    });
  }

  restart(fieldId: string) {
    this.sendCommand(fieldId, 'session/restart', {});
  }

  reset(fieldId: string) {
    this.sendCommand(fieldId, 'session/reset');
  }

  score(fieldId: string, scoreTeam1: number, scoreTeam2: number) {
    this.sendCommand(fieldId, 'session/score', { scoreTeam1: scoreTeam1, scoreTeam2: scoreTeam2 });
  }

  addGoalTeam1(fieldId: string) {
    this.sendCommand(fieldId, 'session/addGoalTeam1');
  }

  addGoalTeam2(fieldId: string) {
    this.sendCommand(fieldId, 'session/addGoalTeam2');
  }

  undo(fieldId: string) {
    this.sendCommand(fieldId, 'session/undo');
  }

  buzz(fieldId: string) {
    this.sendCommand(fieldId, 'session/buzz');
  }

  teamNames(fieldId: string, team1: string, team2: string) {
    this.sendCommand(fieldId, 'session/teamNames', { teamName1: team1, teamName2: team2 });
  }

  pause(fieldId: string) {
    this.sendCommand(fieldId, 'session/pause');
  }

  stop(fieldId: string) {
    this.sendCommand(fieldId, 'session/stop');
  }
}
