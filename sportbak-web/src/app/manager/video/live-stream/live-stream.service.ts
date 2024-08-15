import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SessionService} from '../session.service';
import {Conf} from 'src/app/conf';
import {ManagerTokenService} from '../../shared/services/manager.service';
import {Subject} from 'rxjs';
import { io, Socket } from 'socket.io-client';

export enum RTCPeerConnectionState  {
  CLOSED = "closed",
  CONNECTED = "connected",
  CONNECTING = "connecting",
  DISCONNECTED = "disconnected",
  FAILED = "failed",
  NEW = "new"
}

export type LiveStreamState = 'Connecting' | 'Ready';
export type LiveStreamError = { liveStream : LiveStream, message : string, code? : number };

export interface LiveStreamTokenResponse {
  token: string;
  expireAt: Date;
}


export interface LiveStream {
  socket: Socket;
  connection?: RTCPeerConnection;
  state: LiveStreamState;
  connectionState? : RTCPeerConnectionState;
  fieldId: string,
  alreadyConnected : boolean
}

export type LiveStreamList = {
  [fieldId: string]: LiveStream;
}

@Injectable({
  providedIn: 'root',
})
export class LiveStreamService {
  liveStreams: LiveStreamList = {};

  private _loaded$ = new Subject<LiveStream>();
  loaded$ = this._loaded$.asObservable();

  private _error$ = new Subject<LiveStreamError>();
  error$ = this._error$.asObservable();

  private _closed$ = new Subject<LiveStream>();
  closed$ = this._closed$.asObservable();

  private _state$ = new Subject<LiveStream>();
  state$ = this._state$.asObservable();

  constructor(
    private sessionService: SessionService,
    private tokenService: ManagerTokenService,
    private httpClient: HttpClient) { }

  requestToken(fieldId: string) {
    return this.httpClient.get<LiveStreamTokenResponse>(Conf.videoBaseUrl + "/webrtc/socket/token/" + fieldId, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getToken()),
    });
  }

  requestLiveStream(fieldId: string, token: string) {
    let socket = io(Conf.videoBaseUrl + '/webrtc', {
      query: {
        token: token,
      },
      forceNew : true,
      reconnection : false
    });
    const liveStream: LiveStream = {
      socket: socket,
      state: 'Ready',
      fieldId : fieldId,
      alreadyConnected : false
    };

    liveStream.socket.on('connected', (event) => {
      if (liveStream.state == 'Connecting') {
        this.startWebRTC(liveStream);
      }
    });

    liveStream.socket.on('message', (data) => {
      if (!data) return;
      if (data.action === 'ready' && liveStream.state === 'Ready') this.startWebRTC(liveStream);
      else if (data.action === 'ice') {
        if (liveStream.connection) liveStream.connection.addIceCandidate(new RTCIceCandidate(data.params.ice));
      } else if (data.action === 'sdp') {
        if (liveStream.connection) {
          liveStream.connection.setRemoteDescription(new RTCSessionDescription(data.params.sdp));
          liveStream.connection.createAnswer().then((answer) => {
            liveStream.connection.setLocalDescription(answer);
            liveStream.socket.send(JSON.stringify({'action': 'send_sdp', 'params': {'sdp': answer, 'id': data.params.id}}));
          });
        }
      } else if (data.action == 'error') {
        this._error$.next({liveStream : liveStream, code: data.code, message: data.message});
        this.stopWebRTC(liveStream)
      }
    });

    liveStream.socket.on('close', (event) => {
      this.stopWebRTC(liveStream);
    });


    this.liveStreams[fieldId] = liveStream;
  }

  private startWebRTC(liveStream: LiveStream, finished : () => void = null) {
    let connection = new RTCPeerConnection();
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        liveStream.socket.send(JSON.stringify({'action': 'send_ice', 'params': {'id': '', 'ice': event.candidate}}));
      }
    };
    connection.onconnectionstatechange = (event) => {
      const state = liveStream.connection.connectionState; // 
      if (state == RTCPeerConnectionState.FAILED || state == RTCPeerConnectionState.DISCONNECTED || state == RTCPeerConnectionState.CLOSED) {
        this._error$.next({liveStream : liveStream, code: null, message: state});
        this.stopWebRTC(liveStream);
      } else if (state == RTCPeerConnectionState.CONNECTED) {
        liveStream.alreadyConnected = true;
      }
      console.log("Connection state : " + state);
      this._state$.next(liveStream);
    }
    liveStream.connection = connection;
    this._loaded$.next(liveStream);
    liveStream.socket.send(JSON.stringify({'action': 'start_webrtc', 'params': {}}));
  }

  stopWebRTC(liveStream: LiveStream) {
    liveStream?.socket.send(JSON.stringify({action: 'stop_webrtc', params: {}}));
    liveStream?.socket.close();
    liveStream?.connection?.close();
    this._closed$.next(liveStream);
  }

  destroy(forHost: string) {
    this.liveStreams[forHost]?.socket.close();
    this.liveStreams[forHost]?.connection.close();
  }
}
