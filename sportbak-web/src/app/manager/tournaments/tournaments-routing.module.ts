import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerTournamentsComponent} from './manager-tournaments.component';
import {ManagerTournamentDetailsComponent} from './tournament-details/manager-tournament-details.component';
import {TournamentEditorComponent} from './tournaments-editor/tournament-editor.component';

const routes: Routes = [
  {path: '', component: ManagerTournamentsComponent},
  {path: 'edit', component: TournamentEditorComponent},
  {path: 'details', component: ManagerTournamentDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentsRoutingModule {}
