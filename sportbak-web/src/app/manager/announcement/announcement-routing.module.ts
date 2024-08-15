import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerAnnouncementComponent} from './manager-announcement.component';
import {ManagerAnnouncementCreatorComponent} from './manager-announcement-creator/manager-announcement-creator.component';

const routes: Routes = [
  {path: '', component: ManagerAnnouncementComponent},
  {path: 'new', component: ManagerAnnouncementCreatorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementRoutingModule {}
