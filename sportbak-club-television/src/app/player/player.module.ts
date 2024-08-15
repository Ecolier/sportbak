import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerControls } from './player-controls/player-controls.component';
import { Player } from './player.component';

@NgModule({
  imports: [ CommonModule, RouterModule ],
  declarations: [
    Player,
    PlayerControls,
  ],
  exports: [
    Player,
    PlayerControls,
  ],
})
export class PlayerModule {}