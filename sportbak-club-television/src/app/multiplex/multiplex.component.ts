import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../player/player.component';
import { InitializedStream, Stream } from '../live/stream.model';
import { LiveService } from '../live/live.service';
import { LiveComponent } from '../live/live.component';

@Component({
  selector: 'multiplex',
  templateUrl: './multiplex.component.html',
  styleUrls: ['./multiplex.component.scss']
})
export class Multiplex implements OnInit {
  streams: InitializedStream[];
  isOverlayModeEnabled: boolean;
  srcObjects: [id: string, media: MediaStream][]

  @ViewChildren(LiveComponent) lives!: QueryList<LiveComponent>;
  
  constructor(private router: Router, liveService: LiveService) {
    this.streams = liveService.initializeAllStreams();
  }

  ngOnInit() {
    this.streams.forEach(stream => {
      stream.connection.addEventListener('track', (event) => {
        console.log(this.streams);
        this.srcObjects.push([stream.id, event.streams[0]]);
      });
    });
  }

  promptForFullscreen(liveId: string) {
    this.isOverlayModeEnabled = true;
    const targetLive = this.lives.find(live => live.stream.id === liveId);
    const otherLives = this.lives.filter(live => live.stream.id !== liveId);
    targetLive.showFullscreenPrompt();
    otherLives.forEach(player => player.hideFullscreenPrompt());
  }

  toggleFullscreen(playerIndex: number) {
    this.router.navigate([`/replay/${playerIndex}`]);
  }
}