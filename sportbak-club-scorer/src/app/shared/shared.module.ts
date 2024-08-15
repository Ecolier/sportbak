import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import { InlineStatusComponent } from './components/inline-status/inline-status.component';
import { PopupComponent } from './components/popup/popup.component';
import { ScreensaverComponent } from './components/screensaver/screensaver.component';
import { OptionComponent, SelectComponent } from './components/select/select.component';
import { TextFieldComponent, TextFieldInputDirective } from './components/text-field/text-field.component';
import { ToastComponent } from './components/toast/toast.component';
import { WebRTCPlayerComponent } from './components/webRTCPlayer/webRTCPlayer.component';
import { AudioDirective } from './directives/audio.directive';
import { MinutesSecondsPipe } from './pipes/minutes-seconds.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
    MinutesSecondsPipe,
    ButtonComponent,
    InlineStatusComponent,
    SelectComponent,
    TextFieldComponent,
    ToastComponent,
    TextFieldInputDirective,
    OptionComponent,
    PopupComponent,
    WebRTCPlayerComponent,
    ScreensaverComponent,
    AudioDirective
  ],
  exports: [
    MinutesSecondsPipe,
    CommonModule,
    FormsModule,
    InlineStatusComponent,
    RouterModule,
    ButtonComponent,
    OptionComponent,
    ToastComponent,
    SelectComponent,
    TextFieldComponent,
    TextFieldInputDirective,
    PopupComponent,
    WebRTCPlayerComponent,
    ScreensaverComponent,
    AudioDirective
  ]
})
export class SharedModule {}