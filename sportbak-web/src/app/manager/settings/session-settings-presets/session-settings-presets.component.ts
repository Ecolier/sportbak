import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";

@Component({
  selector: 'settings-presets',
  templateUrl: './session-settings-presets.component.html',
  styleUrls: ['./session-settings-presets.component.scss']
})


export class SessionSettingsPresetsComponent extends FBKComponent {
  @Input() presets: any;
  @Input() settings: any;
  @Input() selectedPreset;
  @Output() saveConfiguration = new EventEmitter();
  @Output() deleteConfiguration = new EventEmitter();
  @Output() setPreset = new EventEmitter();
  @Output() debug = new EventEmitter();
  configurationName: string;
  isShowingModal:boolean;
  actionModal:string;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private eventProvider : SBKEventsProvider,

  ) {
    super(_refElement, translate, 'SessionSettingsPresetsComponent');
  }

  fbkOnInit(): void { 
    this.eventProvider.subscribe(this, SBKEventsIds.updateVideoSettings, (data) => {
        this.selectedPreset = this.presets[0].name;
      })
  }

  toggleIsShowingModal(action?){
    this.actionModal = action;
    this.isShowingModal = !this.isShowingModal;
  }

  validateModal(){
    if (this.actionModal == 'save') {
      if (this.configurationName.length > 0) {
        this.saveConfiguration.emit(this.configurationName);
        this.toggleIsShowingModal();
      }
    }
    if (this.actionModal == 'delete') {
      this.deleteConfiguration.emit(this.configurationName);
      this.toggleIsShowingModal();
    }
  }
  selectPreset(presetName){
    this.setPreset.emit(presetName)
  }
}
