import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {ManagerSpaceComponent} from './manager-space.component';
import {ManagerSpaceRoutingModule} from './space-routing.module';

@NgModule({
  imports: [
    ManagerSpaceRoutingModule,
    ManagerSharedModule,
  ],
  declarations: [
    ManagerSpaceComponent,
  ],
  exports: [
    ManagerSpaceComponent,
    ManagerSharedModule,
  ],
})
export class SpaceModule {}
