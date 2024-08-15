import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {ManagerMenuComponent} from './manager-menu/manager-menu.component';
import {ManagerPageContainerComponent} from './manager-page-container/manager-page-container.component';
import {ManagerNotificationPopupComponent} from './manager-page-container/manager-notification-popup/manager-notification-popup.component';
import {MenuNotificationsDropdownModule} from './menu-notifications-dropdown/menu-notifications-dropdown.module';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {ManagerPopupModalComponent} from './manager-page-container/manager-popup-modal/manager-popup-modal.component';
import {ManagerErrorPopupComponent} from './manager-page-container/manager-error-popup/manager-error-popup.component';

@NgModule({
  imports: [
    SharedModule,
    MenuNotificationsDropdownModule,
    ManagerSharedModule,
  ],
  declarations: [
    ManagerMenuComponent,
    ManagerPageContainerComponent,
    ManagerNotificationPopupComponent,
    ManagerPopupModalComponent,
    ManagerErrorPopupComponent,
  ],
  exports: [
    SharedModule,
    ManagerMenuComponent,
    ManagerPageContainerComponent,
    ManagerNotificationPopupComponent,
    MenuNotificationsDropdownModule,
  ],
})
export class ManagerLayoutModule {}
