import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from '../shared/services/config.service';
import { ConnectionStatus, SocketService } from '../shared/services/socket.service';

export interface Status {
  localIPAddress: string;
  vpnIpAddress : string;
  internetConnection: boolean;
  estimatedDownloadRate: number;
  vpnIPAddress: string;
  videoServiceConnection: boolean;
  gamepadConnection: boolean;
  cameraConnection: boolean;
  USBConnection: boolean;
  HDMIConnection: boolean;
  sendsVideoImmediately: boolean;
  videoSendTime: string;
  bitrate: number;
  height: number;
  buzzTime: number;
  varTime : number;
  deleteVideo: number;
  launchSessionFromFrontend : boolean;
  launchSessionFromFrontendWithWarmup : boolean;
  pauseSessionFromFrontend : boolean;
  stopSessionFromFrontend : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  // @ts-ignore
  private _internetConnection? = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  internetConnection?: Observable<any>;
  videoServiceConnection: Observable<ConnectionStatus>;
  online = new BehaviorSubject<boolean>(navigator.onLine);

  private _status = new Subject<Status>();
  get status() {
    return this._status.asObservable();
  }

  constructor(
    private socketService: SocketService,
    private httpClient: HttpClient,
    private configService: ConfigService) {
    this.videoServiceConnection = this.socketService.status.asObservable();
    this.socketService.message('status').subscribe(this._status);
    fromEvent(window, 'online').subscribe(() => this.online.next(true));
    fromEvent(window, 'offline').subscribe(() => this.online.next(false));
    if (this._internetConnection) {
      this.internetConnection = fromEvent(this._internetConnection, 'change').pipe(
        startWith(this._internetConnection),
        map(event => this._internetConnection)
      );
    }
  }

  getStatus() {
    this.socketService.send('status');
  }
}