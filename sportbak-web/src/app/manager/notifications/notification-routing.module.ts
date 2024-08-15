import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerNotificationsComponent} from './manager-notifications.component';

const routes: Routes = [
  {path: '', component: ManagerNotificationsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
