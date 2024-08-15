import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeagueEditorComponent} from './league-editor/league-editor.component';
import {ManagerLeagueDetailsComponent} from './manager-league-details/manager-league-details.component';
import {ManagerLeaguesComponent} from './manager-leagues.component';

const routes: Routes = [
  {path: '', component: ManagerLeaguesComponent},
  {path: 'edit', component: LeagueEditorComponent},
  {path: 'details', component: ManagerLeagueDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaguesRoutingModule {}
