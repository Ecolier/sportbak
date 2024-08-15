import { Injectable } from "@angular/core";
import { STREAMS } from "./stream-mock";
import { InitializedStream } from "./stream.model";

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  clients: WebSocket[];
  peerConnections: RTCPeerConnection[];

  initializeStream(id: string) : InitializedStream {

    const streamDescriptor = this.getStreamById(id);

    const client = new WebSocket(streamDescriptor.url);
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate !== null)
        client.send(JSON.stringify({ ice: event.candidate }));
    };

    client.onmessage = (message) => {
      const json = JSON.parse(message.data);
      if ("sdp" in json) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(json.sdp)).then(() => {
          peerConnection.createAnswer().then((answer) => {
            peerConnection.setLocalDescription(answer);
            client.send(JSON.stringify({ sdp: answer }));
          })
        })
      }
      if ("ice" in json) {
        peerConnection.addIceCandidate(new RTCIceCandidate(json.ice));
      }
    }

    return { ...streamDescriptor, connection: peerConnection };
  }

  initializeAllStreams() : InitializedStream[] {
    return this.getStreams().map(stream => this.initializeStream(stream.id));
  }

  getStreams() {
    return STREAMS;
  }
  
  getStreamById(id: string) {
    return STREAMS.find(stream => stream.id === id);
  }
}