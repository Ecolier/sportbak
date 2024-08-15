import {Component, ElementRef, Input, OnDestroy, Output, EventEmitter, ViewChild} from '@angular/core';

export type CloseType = 'close-backdrop' | 'green-button' | 'red-button';
export type WebRTCError = {message : string, code? : number};

@Component({
  selector: 'sbk-live-stream-player',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
})
export class LiveStreamPlayerComponent implements OnDestroy {
  @ViewChild('liveFeedback') private liveFeedbackRef!: ElementRef<HTMLMediaElement>;

  @Input() token : string | null = null;
  @Input() url : string | null = null;
  @Input() mode : 'atConnexion' | 'atReadyCmd' = 'atReadyCmd';

  private socket : WebSocket | null = null;
  private peerConnection : RTCPeerConnection | null = null;

  @Output() onError = new EventEmitter<WebRTCError>();

  constructor() {
  }

  ngOnInit() {
    if (this.url) {
      this.socket= new WebSocket(this.url + (this.token ? '?token=' + this.token : ''));

      this.socket.onopen = (event) => {
        if (this.mode =='atConnexion') {
          this.peerConnection = this.startWebRTC(this.socket!);
        }
      };

      this.socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.action == 'ready' && this.mode == 'atReadyCmd') {
          this.peerConnection = this.startWebRTC(this.socket!);
        } else if (data.action == 'ice') {
          if (this.peerConnection) {
            this.peerConnection.addIceCandidate(new RTCIceCandidate(data.params.ice));
          }
        } else if (data.action == 'sdp') {
          if (this.peerConnection) {
            this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.params.sdp));
            this.peerConnection.createAnswer().then((answer) => {
              this.peerConnection!.setLocalDescription(answer);
              this.socket!.send(JSON.stringify({'action': 'send_sdp', 'params': {'sdp': answer, 'id': data.params.id}}));
            });
          }
        } else if (data.action == 'error') {
          this.onError.emit({code: data.code, message: data.message});
          this.socket?.close();
        }
      };

      this.socket.onclose = (event) => {
        this.peerConnection?.close();
      };
    }
  }

  private startWebRTC(socket : WebSocket) : RTCPeerConnection {
    const peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({'action': 'send_ice', 'params': {'id': '', 'ice': event.candidate}}));
      }
    };

    peerConnection.ontrack = (event) => {
      this.liveFeedbackRef.nativeElement.srcObject = event.streams[0];
      this.liveFeedbackRef.nativeElement.load();
    };
    socket.send(JSON.stringify({'action': 'start_webrtc', 'params': {}}));

    return peerConnection;
  }


  ngOnDestroy() {
    this.socket?.close();
    this.peerConnection?.close();
  }
}