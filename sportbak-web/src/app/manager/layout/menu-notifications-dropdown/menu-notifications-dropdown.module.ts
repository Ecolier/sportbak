import {NgModule} from '@angular/core';
import {MenuNotificationsDropdownComponent} from './menu-notifications-dropdown.component';
import {MenuNotificationComponent} from './menu-notification/menu-notification.component';
import {SharedModule} from '../../../shared/shared.module';
import {ManagerSharedModule} from '../../shared/manager-shared.module';

@NgModule({
  imports: [
    SharedModule,
    ManagerSharedModule,
  ],
  declarations: [
    MenuNotificationsDropdownComponent,
    MenuNotificationComponent,
  ],
  exports: [
    MenuNotificationsDropdownComponent,
    MenuNotificationComponent,
  ],
})
export class MenuNotificationsDropdownModule {}
