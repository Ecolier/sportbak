import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {FieldSelectorComponent} from './field-selector/field-selector.component';
import {GamesheetRoutingModule} from './gamesheet-routing.module';
import {GsActionStackComponent} from './gs-action-stack/gs-action-stack.component';
import {GsCounterComponent} from './gs-counter/gs-counter.component';
import {GsFoulsComponent} from './gs-fouls/gs-fouls.component';
import {GsFutbuzzComponent} from './gs-futbuzz/gs-futbuzz.component';
import {GsGameActionsComponent} from './gs-game-actions/gs-game-actions.component';
import {GsPreviousActionComponent} from './gs-previous-action/gs-previous-action.component';
import {GsScoreEditorComponent} from './gs-score-editor/gs-score-editor.component';
import {GsTeamsComponent} from './gs-teams/gs-teams.component';
import {ManagerGameSheetComponent} from './manager-game-sheet.component';
import {ScoreSelectorComponent} from './score-selector/score-selector.component';
import {TimeSelectorComponent} from './time-selector/time-selector.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    GamesheetRoutingModule,
  ],
  declarations: [
    FieldSelectorComponent,
    GsActionStackComponent,
    GsCounterComponent,
    GsFoulsComponent,
    GsFutbuzzComponent,
    GsGameActionsComponent,
    GsPreviousActionComponent,
    GsScoreEditorComponent,
    GsTeamsComponent,
    ScoreSelectorComponent,
    TimeSelectorComponent,
    ManagerGameSheetComponent,
  ],
  exports: [
    FieldSelectorComponent,
    GsActionStackComponent,
    GsCounterComponent,
    GsFoulsComponent,
    GsFutbuzzComponent,
    GsGameActionsComponent,
    GsPreviousActionComponent,
    GsScoreEditorComponent,
    GsTeamsComponent,
    ScoreSelectorComponent,
    TimeSelectorComponent,
    ManagerGameSheetComponent,
    ManagerSharedModule,
  ],
})
export class GamesheetModule {}
