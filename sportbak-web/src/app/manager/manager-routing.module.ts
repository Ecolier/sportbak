import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerContactComponent} from './contact/manager-contact.component';
import {GetHomeComponent} from './get-home/get-home.component';
import {PasswordChangeComponent} from './password-change/password-change.component';

const routes: Routes = [
  {path: '', redirectTo: 'space', pathMatch: 'full'},
  {path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then((module) => module.CalendarModule)},
  {path: 'day', loadChildren: () => import('./calendar/calendar.module').then((module) => module.CalendarModule)},
  {path: 'session', loadChildren: () => import('./video/session.module').then((module) => module.SessionModule)},
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then((module) => module.SessionSettingsModule)},
  {path: 'statistics', loadChildren: () => import('./statistics/statistics.module').then((module) => module.StatisticsModule)},
  {path: 'leagues', loadChildren: () => import('./leagues/leagues.module').then((module) => module.LeaguesModule)},
  {path: 'tournaments', loadChildren: () => import('./tournaments/tournaments.module').then((module) => module.TournamentsModule)},
  {path: 'announcements', loadChildren: () => import('./announcement/announcement.module').then((module) => module.AnnouncementModule)},
  {path: 'space', loadChildren: () => import('./space/space.module').then((module) => module.SpaceModule)},
  {path: 'game-sheet', loadChildren: () => import('./gamesheet/gamesheet.module').then((module) => module.GamesheetModule)},
  {path: 'contact', component: ManagerContactComponent},
  {path: 'password-change', component: PasswordChangeComponent},
  {path: 'notifications', loadChildren: () => import('./notifications/notification.module').then((module) => module.NotificationModule)},
  {path: 'get-home', component: GetHomeComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
