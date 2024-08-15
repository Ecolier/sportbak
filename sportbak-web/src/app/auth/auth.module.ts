import {NgModule} from '@angular/core';
import {HomeSharedModule} from '../home/shared/home-shared.module';
import {ManagerSharedModule} from '../manager/shared/manager-shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {ManagerLoginComponent} from './login/manager-login.component';
import {RegisterFormComponent} from './login/register-form/register-form.component';
import {LoginFormComponent} from './login/login-form/login-form.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    HomeSharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    ManagerLoginComponent,
    RegisterFormComponent,
    LoginFormComponent,
  ],
  exports: [
    ManagerSharedModule,
    HomeSharedModule,
    ManagerLoginComponent,
  ],
})
export class AuthModule {}
