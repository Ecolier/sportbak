import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionSettingsComponent} from './settings.component';

const routes: Routes = [
  {path: ':id', component: SessionSettingsComponent},
  {path: '', component: SessionSettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionSettingsRoutingModule { }
