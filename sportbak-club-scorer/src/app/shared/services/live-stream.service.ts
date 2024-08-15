import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable, Subject, throwError } from "rxjs";
import { LiveStreamErrorCode } from "../models/live-stream.errors";
import { ConfigService } from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class LiveStreamService {

  private _liveStreamLoaded$ = new Subject<RTCPeerConnection>();
  liveStreamLoaded$ = this._liveStreamLoaded$.asObservable();

  constructor(private logger: NGXLogger, private config: ConfigService) { }

  loadLiveStream() {
    this.logger.log(`Connecting to ${this.config.cameraServiceSocketUrl}...`);
    const client = new WebSocket(this.config.cameraServiceSocketUrl);
    var peerConnection = new RTCPeerConnection();

    client.onerror = () => this.logger.error('error');
    client.onclose = event => this.logger.error('error');

    client.onopen = () => {
      client.send(JSON.stringify({ "action": "start_webrtc", "params": {} }))
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          client.send(JSON.stringify({ "action": "send_ice", "params": { "id": "", "ice": event.candidate } }));
        }
      };
      this._liveStreamLoaded$.next(peerConnection);
    };

    client.onmessage = message => {
      const data = JSON.parse(message.data);
      console.log(data)
      if (data.action == "ice") {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.params.ice));
      } else if (data.action == "sdp") {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.params.sdp));
        peerConnection.createAnswer().then((answer) => {
          console.log(answer)
          peerConnection.setLocalDescription(answer);
          client.send(JSON.stringify({ 'action': 'send_sdp', 'params': { 'sdp': answer, 'id': data.params.id } }));
        });

      }
    };
  }

}

