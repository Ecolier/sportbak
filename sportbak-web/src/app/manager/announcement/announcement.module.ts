import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {ManagerAnnouncementWidgetComponent} from './manager-announcement-widget/manager-announcement-widget.component';
import {ManagerAnnouncementComponent} from './manager-announcement.component';
import {AnnouncementRoutingModule} from './announcement-routing.module';
import {ManagerAnnouncementCreatorComponent} from './manager-announcement-creator/manager-announcement-creator.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    AnnouncementRoutingModule,
  ],
  declarations: [
    ManagerAnnouncementWidgetComponent,
    ManagerAnnouncementComponent,
    ManagerAnnouncementCreatorComponent,
  ],
  exports: [
    ManagerAnnouncementWidgetComponent,
    ManagerAnnouncementComponent,
    ManagerSharedModule,
  ],
})
export class AnnouncementModule {}
