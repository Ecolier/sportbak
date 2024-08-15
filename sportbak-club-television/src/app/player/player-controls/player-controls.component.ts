import { Component, Input } from '@angular/core';

@Component({
  selector: 'player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControls { 

  @Input() title: string;
  controlsVisible: boolean;

  constructor() {}

  showControls() {
    this.controlsVisible = true;
    setTimeout(() => this.hideControls(), 2000);
  }

  hideControls() {
    this.controlsVisible = false;
  }
}