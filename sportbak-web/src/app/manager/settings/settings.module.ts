import {NgModule} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {SessionSettingsFormModule} from './session-settings-form/session-settings-form.module';
import {SessionSettingsRoutingModule} from './settings-routing.module';
import {SessionSettingsTabComponent} from './session-settings-tab/session-settings-tab.component';
import {SessionSettingsComponent} from './settings.component';
import { SessionSettingsPresetsComponent } from './session-settings-presets/session-settings-presets.component';

@NgModule({
  imports: [
    ManagerSharedModule,
    SharedModule,
    SessionSettingsRoutingModule,
    SessionSettingsFormModule,
  ],
  declarations: [
    SessionSettingsComponent,
    SessionSettingsTabComponent,
    SessionSettingsPresetsComponent,
  ],
  exports: [
    ManagerSharedModule,
    SharedModule,
    SessionSettingsComponent,
    SessionSettingsTabComponent,
  ],
})
export class SessionSettingsModule {}
