import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LiveComponent } from './live.component';
import { LiveRoutingModule } from './live-routing.module';
import { PlayerModule } from '../player/player.module';

@NgModule({
  imports: [ CommonModule, LiveRoutingModule, PlayerModule ],
  declarations: [ LiveComponent ],
  exports: [ LiveComponent ],
})
export class LiveModule {}