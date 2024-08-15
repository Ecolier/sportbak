import { Injectable } from '@angular/core';
import config from 'src/config.json';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly videoServicePort = config.videoServicePort;
  private _videoServiceHost = config.videoServiceHost;
  set videoServiceHost(value) { 
    let valueChanged = value != this._videoServiceHost;
    this._videoServiceHost = value;
    if (valueChanged) {
      this.sendEventVideoServiceHostChange();
    }
  }
  get videoServiceHost() { return this._videoServiceHost;}
  get videoServiceEndpoint() { return this.videoServiceHost + ":" + this.videoServicePort};
  get videoServiceSocketUrl() { return `ws://${this.videoServiceEndpoint}`;}
  get cameraServiceSocketUrl() { return `ws://${this.videoServiceEndpoint}/webrtc`;}
  readonly staticUrl = config.staticUrl;

  constructor(private eventService : EventService) {
  }

  sendEventVideoServiceHostChange() {
    this.eventService.publish("video_host_updated");
  }
}