import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../../shared/manager-shared.module';
import {SessionSettingsFormComponent} from './session-settings-form.component';

@NgModule({
  imports: [
    ManagerSharedModule,
  ],
  declarations: [
    SessionSettingsFormComponent,
  ],
  exports: [
    ManagerSharedModule,
    SessionSettingsFormComponent,
  ],
})
export class SessionSettingsFormModule {}
