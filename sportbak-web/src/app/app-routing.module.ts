import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {CanActivateManager} from './auth/can-activate-manager';
import {CanActivateHashtag} from './auth/can-active-hashtag';


const routes: Routes = [
  {path: '', loadChildren: () => import('./home/home.module').then((module) => module.HomeModule), canActivate: [CanActivateHashtag]},
  {path: '', loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule)},
  {path: 'manager', loadChildren: () => import('./manager/manager.module').then((module) => module.ManagerModule), canActivate: [CanActivateManager], runGuardsAndResolvers: 'always'},
  {path: '**', redirectTo: '', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
