import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarDayComponent} from './calendar-day/calendar-day.component';

const routes: Routes = [
  {path: '', component: CalendarDayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
