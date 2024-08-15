import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {CompetitionsGamesPlanningComponent} from './games-planning/games-planning.component';
import {HelpInfoComponent} from './help-info/help-info.component';
import {LeagueEditorComponent} from './league-editor/league-editor.component';
import {LeagueGamesComponent} from './league-games/league-games.component';
import {LeagueRankingComponent} from './league-ranking/league-ranking.component';
import {LeagueSettingsComponent} from './league-settings/league-settings.component';
import {LeaguesRoutingModule} from './leagues-routing.module';
import {ManagerLeagueCreatorComponent} from './manager-league-creator/manager-league-creator.component';
import {ManagerLeagueDetailsComponent} from './manager-league-details/manager-league-details.component';
import {ManagerLeaguesComponent} from './manager-leagues.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    LeaguesRoutingModule,
  ],
  declarations: [
    LeagueSettingsComponent,
    CompetitionsGamesPlanningComponent,
    HelpInfoComponent,
    LeagueEditorComponent,
    LeagueGamesComponent,
    LeagueRankingComponent,
    ManagerLeagueCreatorComponent,
    ManagerLeagueDetailsComponent,
    ManagerLeaguesComponent,
  ],
  exports: [
    ManagerSharedModule,
    LeagueSettingsComponent,
    CompetitionsGamesPlanningComponent,
    HelpInfoComponent,
    LeagueEditorComponent,
    LeagueGamesComponent,
    LeagueRankingComponent,
    ManagerLeagueCreatorComponent,
    ManagerLeagueDetailsComponent,
    ManagerLeaguesComponent,
  ],
})
export class LeaguesModule {}
