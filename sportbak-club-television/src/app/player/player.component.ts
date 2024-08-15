import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class Player {

  @Input() url: string;
  @Input() isFullscreen: boolean;
  @Input() isLive: boolean;
  @Input() id: number;
  
  controlsVisible: boolean;
  title: string;

  @HostListener('mousemove')
  move() {
    this.showControls();
  }

  showControls() {
    this.controlsVisible = true;
    setTimeout(() => this.hideControls(), 2000);
  }

  hideControls() {
    this.controlsVisible = false;
  }

}