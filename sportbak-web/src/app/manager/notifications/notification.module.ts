import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {NotificationRoutingModule} from './notification-routing.module';
import {AnnouncementModule} from '../announcement/announcement.module';
import {ManagerNotificationsWidgetComponent} from './manager-notifications-widget/manager-notifications-widget.component';
import {ManagerNotificationsComponent} from './manager-notifications.component';


@NgModule({
  imports: [
    ManagerSharedModule,
    NotificationRoutingModule,
    AnnouncementModule,
  ],
  declarations: [
    ManagerNotificationsWidgetComponent,
    ManagerNotificationsComponent,
  ],
  exports: [
    ManagerSharedModule,
    ManagerNotificationsWidgetComponent,
    ManagerNotificationsComponent,
  ],
})
export class NotificationModule {}
