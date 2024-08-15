import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerStatisticsComponent} from './manager-statistics.component';

const routes: Routes = [
  {path: '', component: ManagerStatisticsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
