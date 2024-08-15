import {Component, ElementRef, EventEmitter, Inject, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBK_DIALOG_DATA} from '../../../shared/components/dialog/dialog.service';
import {DEFAULT_SESSION} from '../../settings/default-session-settings';
import {SessionSettings} from '../../settings/settings.model';

export interface StartSessionSettings {
  time: number; // in seconds
  period: number;
  pauseTime: number; // in seconds
  teamName1: string;
  teamName2: string,
  sound: boolean;
  ambiance: boolean;
  warmup: number; // in seconds
}

@Component({
  selector: 'mgr-session-start-dialog',
  templateUrl: './session-start-dialog.component.html',
  styleUrls: ['./session-start-dialog.component.scss'],
})
export class SessionStartDialogComponent extends FBKComponent {
  @Output() navigateToSettings = new EventEmitter<void>();
  @Output() submitSettings = new EventEmitter<SessionSettings>();
  selectedPreset:string ;
  selectedSettings:any ;
  settingsForm = this.formBuilder.group({
    session: DEFAULT_SESSION,
  });
  settings:any;
  constructor(
    @Inject(FBK_DIALOG_DATA) public settingsObject,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    protected translateProvider: TranslateAppProvider) {
    super(elementRef, translateProvider, 'SessionStartDialogComponent');
    if (settingsObject) {
      this.settings = settingsObject.settings;
      if (settingsObject.settings?.length) {
        this.selectPreset(settingsObject.settings[0].name);
      } else if (settingsObject.sessionSettings) {
        this.setForm(settingsObject.sessionSettings);
      }
    }
  }
  
  fbkOnInit() {}
  
  selectPreset(presetName){
    this.selectedPreset = presetName;
    this.selectedSettings = this.settings.find((settings) => settings.name === presetName);
    this.setForm(this.selectedSettings);
  }
  
  setForm(settings){
    this.settingsForm.setValue({
      session: {
        time: settings.time,
        period: settings.period,
        pauseTime: settings.pauseTime,
        sound: settings.sound,
        ambiance: settings.ambiance,
        warmup: settings.warmup,
        teamName1: settings.teamName1,
        teamName2: settings.teamName2,
      },
    });
  }

  valuesToComputedSessionSettings(): StartSessionSettings {
    const formOptions = this.settingsForm.value.session;
    const SessionSettings = formOptions;
    return SessionSettings;
  }
}
