import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerLoginComponent} from './login/manager-login.component';

const routes: Routes = [
  {path: 'manager-login', component: ManagerLoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
