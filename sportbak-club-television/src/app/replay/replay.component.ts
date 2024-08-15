import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Player } from "../player/player.component";
import { Replay } from "./replay.model";
import { ReplayService } from "./replay.service";
import { throttle } from '../utilities/throttle';

@Component({
  selector: 'replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent 
  extends Player 
  implements OnInit, AfterViewInit {
  @Input() replay: Replay;

  @ViewChild('video') video;
  @ViewChild('locator')
  videoDuration: string;
  currentTime: string;
  progress: string;
  isPinSelected: boolean;

  pinSelectedOffset: number;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event) {
    if (this.isPinSelected) {
      this.pinSelectedOffset = event.pageX;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isPinSelected = false
  }

  constructor(
    private route: ActivatedRoute,
    private replayService: ReplayService) {
      super();
    }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const replayId = params.get('id');
      if (replayId) {
        this.replay = this.replayService.getReplayById(replayId);
      }
    })
    
  }

  ngAfterViewInit() {
    const nativeVideoElement = this.video.nativeElement;
    nativeVideoElement.onloadedmetadata = () => {
      this.videoDuration = new Date(nativeVideoElement.duration * 1000).toISOString().substr(14, 5)
    }
    nativeVideoElement.addEventListener('timeupdate', throttle(() => {
      this.progress = (nativeVideoElement.currentTime * 100 / nativeVideoElement.duration).toString();
      this.currentTime = new Date(nativeVideoElement.currentTime * 1000).toISOString().substr(14, 5)
    }, 1000, 250))
  }

  selectPin() {
    this.isPinSelected = true
  }

}