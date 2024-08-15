import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScorerRoutingModule } from './scorer-routing.module';
import { ScorerComponent } from './scorer.component';

@NgModule({
  imports: [
    SharedModule,
    ScorerRoutingModule,
  ],
  declarations: [
    ScorerComponent
  ],
  exports: [
    SharedModule,
  ]
})
export class ScorerModule {}