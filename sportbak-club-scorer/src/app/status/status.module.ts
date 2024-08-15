import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';

@NgModule({
  imports: [
    SharedModule,
    StatusRoutingModule
  ],
  declarations: [StatusComponent],
  exports: [
    SharedModule,
    StatusComponent
  ]
})
export class StatusModule {}