import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayerModule } from '../player/player.module';
import { ReplayRoutingModule } from './replay-routing.module';
import { ReplayComponent } from './replay.component';

@NgModule({
  imports: [ CommonModule, ReplayRoutingModule, PlayerModule ],
  declarations: [ ReplayComponent ]
})
export class ReplayModule { }