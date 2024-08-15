import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Multiplex } from './multiplex.component';

const routes: Routes = [
  {
    path: '',
    component: Multiplex
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiplexRoutingModule { }