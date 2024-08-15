import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger, NGXLoggerMonitor } from 'ngx-logger';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { BehaviorSubject, from, fromEvent, of, ReplaySubject, Subject } from 'rxjs';
import { buffer, bufferWhen, filter, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { EventService } from './event.service';

export type VideoServiceAction = (params: any) => void;
export type ConnectionStatus = 'open' | 'close';

export interface VideoServiceActions {
  [action: string]: VideoServiceAction;
}

export interface VideoServiceMessage {
  action: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: WebSocket |null = null;
  private actions: VideoServiceActions = {};

  public status = new BehaviorSubject<ConnectionStatus>('close');

  private currentHost : string | null = null;

  private reconnect() {
    this.status.next('close')
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    setTimeout(() => {
      this.connect();
    }, 2000);
  }

  private _message$ = new ReplaySubject<VideoServiceMessage>(10);
  message$ = this._message$.asObservable();

  constructor(
    private configService: ConfigService, 
    private logger: NGXLogger,
    private http: HttpClient,
    private eventService : EventService) {
    this.connect();
    this.eventService.subscribe(this, "video_host_updated", () => {
      console.log("Reconnecting socket after host changed : " + this.configService.videoServiceEndpoint)
      this.reconnect();
    })
  }

  private connect() {
    const currentHost = this.configService.videoServiceEndpoint;
    const socketUrl = this.configService.videoServiceSocketUrl;
    this.currentHost = currentHost;
    console.log("Socket connecting : " + socketUrl);
    this.http.get('http://' + currentHost + '/token/frontend/socket').subscribe((data : any) => {
        if (data) {
          this.socket = new WebSocket(socketUrl + "?token=" + data.token);
          this.socket.onerror = event => this.logger.error(`Received unknown error from ${socketUrl}.`)
          this.socket.onclose = () => {
            if (currentHost == this.currentHost)
              this.reconnect();
          }
          this.socket.addEventListener('open', () => this.status.next('open'));
          fromEvent<MessageEvent>(this.socket, 'message').pipe(
            map(message => JSON.parse(message.data)),
            tap(message => this.logger.trace(`Received ${message.action} with params : ${JSON.stringify(message.params)}.`)),
          ).subscribe(this._message$);
        }
    }, error => {
      if (currentHost == this.currentHost)
        this.reconnect();
    });
  }

  message(action: string, buffer = false) {
    return this._message$.pipe(
      filter(message => message.action === action),
      map(message => message.params)
    );
  }

  use(message: string, action: VideoServiceAction) {
    this.actions = { ...this.actions, [message]: action };
  }

  send(message: string, params?: any) {
    this.socket?.send(JSON.stringify({ action: message, params: params ?? {} }))
  }
}