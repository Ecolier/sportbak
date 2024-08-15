import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerSpaceComponent} from './manager-space.component';

const routes: Routes = [
  {path: '', component: ManagerSpaceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerSpaceRoutingModule {}
