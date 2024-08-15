import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScorerComponent } from './scorer.component';

const routes: Routes = [
  { path: '', component: ScorerComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScorerRoutingModule {}