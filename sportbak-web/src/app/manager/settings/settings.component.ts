import {Component, ElementRef, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {Field} from 'src/app/shared/models/field.model';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {HydratedSessionSettingsRemote} from './settings.model';
import {SessionSettingsService} from './settings.service';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";

@Component({
  selector: 'mgr-session-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SessionSettingsComponent extends FBKComponent {
  selectedSettingsTabIndex = 0;
  complex = this.managerProvider.allManagerData$.complex;
  fields = this.managerProvider.allManagerData$.complex.fields;
  complexSettings: any;
  allSettings: any;
  settingLoadedStep : number = 0;
  @Input() targetId?: string;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private sessionSettingsService: SessionSettingsService,
    protected managerMenuService: ManagerMenuService,
    private activatedRoute: ActivatedRoute,
    private eventProvider : SBKEventsProvider,
    private _router: Router) {
      super(_refElement, translate, 'ManagerPageComponent');
      this.managerMenuService.setActiveMenuItemKey('settings');
    }
    
    fbkOnInit() {
      this.initSettings();
    }
    fbkOnDestroy() {
      this.eventProvider.unsubscribeAllTopics(this);
    }
    
    initSettings(){
      this.settingLoadedStep = 0;
      this.sessionSettingsService.getDefaultSessionSettingsForComplex().subscribe((complexSettings) => {
        this.complexSettings =  complexSettings;
        this.settingLoadedStep ++;
      });
      this.sessionSettingsService.getAllDefaultSessionSettings().subscribe((allSettings) => {
        this.allSettings =  allSettings;
        this.settingLoadedStep ++;
        this.eventProvider.publish(SBKEventsIds.updateVideoSettings, true)
      });
    }
    presetsForTarget(target: any, settings: HydratedSessionSettingsRemote[]) {
      let preset = []; 
      if (target) {
        if (target.target) {
          preset = settings.filter(settings => settings.target == target.target);
        }else{
          preset = settings.filter(settings => settings.target == target._id);
        }
      }
      return preset
    }
  navigateToSettings(id: string) {
    // this._router.navigate([`manager/settings/${id}`])
  }
}
