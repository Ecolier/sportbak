import {NgModule} from '@angular/core';
import {GamesheetModule} from '../gamesheet/gamesheet.module';
import {TournamentSettingsComponent} from '../shared/components/tournament-settings/tournament-settings.component';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {ManagerDualChoiceComponent} from './manager-dual-choice/manager-dual-choice.component';
import {ManagerTournamentsComponent} from './manager-tournaments.component';
import {PlayoffsEditorComponent} from './playoffs-editor/playoffs-editor.component';
import {CompetitionsPlayoffsComponent} from './playoffs/playoffs';
import {PoolEditorComponent} from './pool-editor/pool-editor.component';
import {ManagerTournamentCreatorComponent} from './tournament-creator/manager-tournament-creator.component';
import {ManagerTournamentDetailsComponent} from './tournament-details/manager-tournament-details.component';
import {ManagerTournamentPlayoffsGameComponent} from './tournament-playoffs-game/manager-tournament-playoffs-game.component';
import {ManagerTournamentPlayoffsComponent} from './tournament-playoffs/manager-tournament-playoffs.component';
import {ManagerTournamentRankingComponent} from './tournament-ranking/manager-tournament-ranking.component';
import {TournamentEditorComponent} from './tournaments-editor/tournament-editor.component';
import {TournamentsRoutingModule} from './tournaments-routing.module';
import {PoolTableComponent} from './pool-table/pool-table.component';
import {PoolGamesComponent} from './pool-games/pool-games.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    TournamentsRoutingModule,
    GamesheetModule,
  ],
  declarations: [
    ManagerDualChoiceComponent,
    PlayoffsEditorComponent,
    PoolEditorComponent,
    TournamentSettingsComponent,
    ManagerTournamentCreatorComponent,
    ManagerTournamentDetailsComponent,
    ManagerTournamentPlayoffsComponent,
    CompetitionsPlayoffsComponent,
    ManagerTournamentPlayoffsGameComponent,
    ManagerTournamentRankingComponent,
    TournamentEditorComponent,
    ManagerTournamentsComponent,
    PoolTableComponent,
    PoolGamesComponent,
  ],
  exports: [
    ManagerSharedModule,
    ManagerDualChoiceComponent,
    PlayoffsEditorComponent,
    TournamentSettingsComponent,
    PoolEditorComponent,
    ManagerTournamentCreatorComponent,
    ManagerTournamentDetailsComponent,
    ManagerTournamentPlayoffsComponent,
    ManagerTournamentPlayoffsGameComponent,
    ManagerTournamentRankingComponent,
    TournamentEditorComponent,
    ManagerTournamentsComponent,
  ],
})
export class TournamentsModule {}
