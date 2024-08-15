import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MultiplexRoutingModule } from './multiplex-routing.module';
import { Multiplex } from './multiplex.component';
import { LiveModule } from '../live/live.module';
import { LiveService } from '../live/live.service';

@NgModule({
  imports: [
    CommonModule,
    LiveModule,
    MultiplexRoutingModule,
  ],
  declarations: [
    Multiplex,
  ],
  providers: [LiveService]
})
export class MultiplexModule {}