export interface Stream {
  id: string;
  name: string;
  url: string;
}

export interface InitializedStream extends Stream {
  connection: RTCPeerConnection;
}