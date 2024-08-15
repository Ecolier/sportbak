import {NgModule} from '@angular/core';
import {ManagerContactComponent} from './contact/manager-contact.component';
import {ManagerRoutingModule} from './manager-routing.module';
import {PasswordChangeComponent} from './password-change/password-change.component';
import {ManagerSharedModule} from './shared/manager-shared.module';
import {GetHomeComponent} from './get-home/get-home.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    ManagerRoutingModule,
  ],
  declarations: [
    PasswordChangeComponent,
    ManagerContactComponent,
    GetHomeComponent,
  ],
  exports: [
    ManagerSharedModule,
  ],
})
export class ManagerModule {}
