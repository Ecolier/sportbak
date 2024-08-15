import { Component, HostBinding, HostListener, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Player } from "../player/player.component";
import { LiveService } from "./live.service";
import { Stream } from "./stream.model";

@Component({
  selector: 'live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent extends Player implements OnInit {
  @Input() stream: Stream;
  isFullscreenPromptVisible: boolean;
  @Input() srcObject: any;

  @HostBinding('class.fullscreen') isFullscreen: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liveService: LiveService) {
      super();
    }
    
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const streamId = params.get('id');
      if (streamId) {
        this.isFullscreen = true;

        const stream = this.liveService.initializeStream(streamId);
        stream.connection.addEventListener('track', (event) => {
          this.srcObject = event.streams[0];
        });
        
        this.stream = this.liveService.getStreamById(streamId);
      }
    })
  }

  showFullscreenPrompt() {
    this.isFullscreenPromptVisible = true
  }

  hideFullscreenPrompt() {
    this.isFullscreenPromptVisible = false
  }

  goToFullscreenMode() {
    if (this.isFullscreenPromptVisible) {
      this.router.navigate([`/live/${this.stream.id}`]);
    }
  }
}