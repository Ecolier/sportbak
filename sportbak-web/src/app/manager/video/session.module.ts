import {NgModule} from '@angular/core';
import {SessionSettingsFormModule} from '../settings/session-settings-form/session-settings-form.module';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {SessionControlComponent} from './session-control/session-control.component';
import {SessionRoutingModule} from './session-routing.module';
import {SessionStartDialogComponent} from './session-start-dialog/session-start-dialog.component';
import {SessionListComponent} from './session-list/session-list.component';
import {SessionMonitorComponent} from './session-monitor/session-monitor.component';
import {ScorerEditableComponent} from './scorer-editable/scorer-editable.component';
import {SessionScorerComponent} from './session-scorer/session-scorer.component';
import {LiveStreamPlayerComponent} from './live-stream/live-stream.component';
import {SessionListItemComponent} from './session-list-item/session-list-item.component';


@NgModule({
  imports: [
    ManagerSharedModule,
    SessionRoutingModule,
    SessionSettingsFormModule,
  ],
  declarations: [
    SessionListComponent,
    SessionMonitorComponent,
    LiveStreamPlayerComponent,
    SessionControlComponent,
    SessionScorerComponent,
    SessionStartDialogComponent,
    SessionListItemComponent,
    ScorerEditableComponent,
  ],
  exports: [
    ManagerSharedModule,
    SessionMonitorComponent,
    ScorerEditableComponent,
    SessionListItemComponent,
    LiveStreamPlayerComponent,
    SessionControlComponent,
    SessionScorerComponent,
    SessionStartDialogComponent,
    SessionListComponent,
    SessionSettingsFormModule,
  ],
})
export class SessionModule {}
