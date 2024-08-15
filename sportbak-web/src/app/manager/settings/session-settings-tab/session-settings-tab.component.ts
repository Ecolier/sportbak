import {HttpErrorResponse} from '@angular/common/http';
import {Component, ElementRef, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ToastService} from '../../../shared/components/toast/toast.service';
import {Field} from '../../../shared/models/field.model';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {ManagerProvider} from '../../shared/services/manager.service';
import {DEFAULT_SESSION} from '../default-session-settings';
import {isHydratedSessionSettings, SessionSettings, SessionSettingsRemote} from '../settings.model';
import {SessionSettingsService} from '../settings.service';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";

@Component({
  selector: 'mgr-session-settings-tab',
  templateUrl: './session-settings-tab.component.html',
  styleUrls: ['./session-settings-tab.component.scss'],
})
export class SessionSettingsTabComponent extends FBKComponent {
  
  @Input() allSettings?;
  @Input() target: Field | ComplexModel;
  @Input() presets: SessionSettingsRemote [] = [];
  @Output() reloadData = new EventEmitter();
  settings: SessionSettings & SessionSettingsRemote;
  selectedPreset:string;
  newConfigurationName: string;
  isCreatingNewConfiguration: boolean = false;
  get modelType() {
    return 'fields' in this.target ? 'Complex' : 'Field';
  }
  
  settingsForm = this.formBuilder.group({
    session: {},
  })
  
  fbkOnInit() {
    this.initVariables();
    this.eventProvider.subscribe(this, SBKEventsIds.updateVideoSettings, (data) => {
    this.initVariables();
    })
  }
  fbkOnDestroy() {
    this.eventProvider.unsubscribeAllTopics(this);
  }

  initVariables(){
    this.setDefaultSettings();
    if (this.settings) {
      this.selectedPreset = this.settings.name
      this.settingsForm.setValue({
        session: {
          time: this.settings.time,
          period: this.settings.period,
          pauseTime: this.settings.pauseTime,
          sound: this.settings.sound,
          ambiance: this.settings.ambiance,
          warmup: this.settings.warmup,
          teamName1: this.settings.teamName1,
          teamName2: this.settings.teamName2,
        },
      });
    }
    this.getPresetsSettings();
  }

  setDefaultSettings(){
    this.settings = null;
    if (this.allSettings) {
      this.settings = this.allSettings.find((settings) => settings.target === this.target._id && settings.type === 'default');
      if (!this.settings) {
        this.settings = this.allSettings.find((settings) => settings.target === this.target._id);
      }
    }
  }

  saveDefaultSettings() {
    const sessionFormValue = this.settingsForm.value.session;
    if (this.settings && isHydratedSessionSettings(this.settings) && !this.isCreatingNewConfiguration) {
      if (this.modelType === 'Complex') {
        this.sessionSettingsService.updateDefaultSessionSettingsForComplex(this.settings._id, {
          type: this.settings.type,
          name: this.settings.name,
          time: parseInt(sessionFormValue.time),
          period: parseInt(sessionFormValue.period),
          warmup: parseInt(sessionFormValue.warmup),
          pauseTime: parseInt(sessionFormValue.pauseTime),
          teamName1: sessionFormValue.teamName1,
          teamName2: sessionFormValue.teamName2,
          ambiance: sessionFormValue.ambiance,
          sound: sessionFormValue.sound,
        }).subscribe(
            () => {
              this.toastService.open(this.getTranslation('updateSettingsSuccess')),
            (errorResponse: HttpErrorResponse) => {
              if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
            }
             this.reloadData.emit();
          }
        );
      } else {
        this.sessionSettingsService.updateDefaultSessionSettingsForField(this.target._id, this.settings._id, {
          type: this.settings.type,
          name: this.settings.name,
          time: parseInt(sessionFormValue.time),
          period: parseInt(sessionFormValue.period),
          warmup: parseInt(sessionFormValue.warmup),
          pauseTime: parseInt(sessionFormValue.pauseTime),
          teamName1: sessionFormValue.teamName1,
          teamName2: sessionFormValue.teamName2,
          ambiance: sessionFormValue.ambiance,
          sound: sessionFormValue.sound,
        }).subscribe(
            () => {this.toastService.open(this.getTranslation('updateSettingsSuccess')),
            (errorResponse: HttpErrorResponse) => {
              if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
            }
            this.reloadData.emit();
          }
        );
      }
    } else {
      if (this.modelType === 'Complex') {
        this.sessionSettingsService.setDefaultSessionSettingsForComplex({
          type: this.isCreatingNewConfiguration ? 'custom' : 'default',
          name: this.isCreatingNewConfiguration ? this.newConfigurationName : 'test',
          time: parseInt(sessionFormValue.time),
          period: parseInt(sessionFormValue.period),
          warmup: parseInt(sessionFormValue.warmup),
          pauseTime: parseInt(sessionFormValue.pauseTime),
          teamName1: sessionFormValue.teamName1,
          teamName2: sessionFormValue.teamName2,
          ambiance: sessionFormValue.ambiance,
          sound: sessionFormValue.sound,
        }).subscribe(
            () => {this.toastService.open(this.getTranslation('createSettingsSuccess')),
            (errorResponse: HttpErrorResponse) => {
              if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
            }
            this.reloadData.emit({modelType:this.modelType,settings:this.settings});
          }
        );
      } else {
        this.sessionSettingsService.setDefaultSessionSettingsForField(this.target._id, {
          type: this.isCreatingNewConfiguration ? 'custom' : 'default',
          name: this.isCreatingNewConfiguration ? this.newConfigurationName : 'test',
          time: parseInt(sessionFormValue.time),
          period: parseInt(sessionFormValue.period),
          warmup: parseInt(sessionFormValue.warmup),
          pauseTime: parseInt(sessionFormValue.pauseTime),
          teamName1: sessionFormValue.teamName1,
          teamName2: sessionFormValue.teamName2,
          ambiance: sessionFormValue.ambiance,
          sound: sessionFormValue.sound,
        }).subscribe(
            () => {this.toastService.open(this.getTranslation('createSettingsSuccess')),
            (errorResponse: HttpErrorResponse) => {
              if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
            }
            this.reloadData.emit({modelType:this.modelType,settings:this.settings});
          }
        );
      }
    }
  }

  createDefaultSettings() {
    this.settings = {
      target: '',
      targetModel: '',
      updatedAt: '',
      _id: '',
      createdAt: '',
      type: '',
      name: '',
      ...DEFAULT_SESSION,
    };
    this.settingsForm.setValue({
      session: DEFAULT_SESSION,
    });
  }

  getPresetsSettings(){
      if (this.allSettings && this.settings) {
        this.presets = this.allSettings.filter(settings => settings.targetModel == this.modelType && settings.target == isHydratedSessionSettings(this.settings));
      }
  }

  setPreset(presetName){   
    this.getPresetsSettings(); 
    let selectedPreset = this.presets.filter(preset => preset.name == presetName);
    this.selectedPreset = presetName;
    this.settings = selectedPreset[0];
    this.settingsForm.setValue({
      session: {
        time: this.settings.time,
        period: this.settings.period,
        pauseTime: this.settings.pauseTime,
        sound: this.settings.sound,
        ambiance: this.settings.ambiance,
        warmup: this.settings.warmup,
        teamName1: this.settings.teamName1,
        teamName2: this.settings.teamName2,
      },
    });
  }

  saveConfiguration(configurationName){
    if (configurationName) {
      this.newConfigurationName = configurationName;
      this.isCreatingNewConfiguration = true;
      this.saveDefaultSettings();
      this.isCreatingNewConfiguration = false;
    }
  }
 
  deleteConfiguration(configurationName){
    if (isHydratedSessionSettings(this.settings)) {
        if (this.settings.type !== 'default') {
          if (this.modelType === 'Complex') {            
            this.sessionSettingsService.deleteConfigurationSessionSettingsForField(this.target._id, this.settings._id).subscribe(
                () => {this.toastService.open(this.getTranslation('deleteSettingsSuccess')),
                (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
                }
                this.reloadData.emit({modelType:this.modelType,settings:this.settings});
              }
            );
          }
          if (this.modelType === 'Field') {
            this.sessionSettingsService.deleteConfigurationSessionSettingsForField(this.target._id, this.settings._id).subscribe(
                (response) => {
                  this.toastService.open(this.getTranslation('deleteSettingsSuccess')),
                (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.status === 400) this.toastService.open(this.getTranslation('requestError'), {class: 'error'});
                },
                this.reloadData.emit({modelType:this.modelType,settings:this.settings});
              }
            );
          }
        }
      }
  }
  constructor(
    private formBuilder: FormBuilder,
    private sessionSettingsService: SessionSettingsService,
    private toastService: ToastService,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    protected managerMenuService: ManagerMenuService,
    private activatedRoute: ActivatedRoute,
    private eventProvider : SBKEventsProvider,
    private _router: Router) {
    super(_refElement, translate, 'SessionSettingsTabComponent');
  }
}
