import {Component, ElementRef, EventEmitter, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {DialogService} from 'src/app/shared/components/dialog/dialog.service';
import {ToastService} from 'src/app/shared/components/toast/toast.service';
import {Field} from 'src/app/shared/models/field.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SessionSettings, SessionSettingsRemote} from '../../settings/settings.model';
import {SessionSettingsService} from '../../settings/settings.service';
import {ManagerProvider} from '../../shared/services/manager.service';
import {SessionStartDialogComponent} from '../session-start-dialog/session-start-dialog.component';
import {Session} from '../session.model';
import {SessionService} from '../session.service';

@Component({
  selector: 'sbk-session-monitor',
  templateUrl: './session-monitor.component.html',
  styleUrls: ['./session-monitor.component.scss'],
})
export class SessionMonitorComponent extends FBKComponent implements OnDestroy {
  @Input() fieldId: string;
  @Input() settings?: SessionSettings & SessionSettingsRemote [];
  private readonly ngOnDestroy$ = new Subject<void>();
  private _isSessionStarting = false;
  get isSessionStarting() {
    return this._isSessionStarting;
  }
  selectedPreset:string;
  session$ = new EventEmitter<Session | undefined>();
  session?: Session;
  selectedSettings:SessionSettings;

  constructor(
    private elementRef: ElementRef,
    private translateService: TranslateAppProvider,
    private sessionService: SessionService,
    private sessionSettingsService: SessionSettingsService,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService) {
    super(elementRef, translateService, 'SessionMonitorComponent');
    this.sessionService.error$.subscribe((errorMessage) => {
      if (errorMessage === 'Session already exist') {
        this.toastService.open(this.getTranslation('sessionAlreadyStarted'), {class: 'error'});
      } else if (errorMessage === 'Session not started') {
        this.toastService.open(this.getTranslation('sessionNotStarted'), {class: 'error'});
      }
    });
  }

  fbkOnInit() {
    this.sessionService.onSession(this.fieldId).pipe(takeUntil(this.ngOnDestroy$)).subscribe((session) => {
      this.session = session;
      this._isSessionStarting = false;
    });
    this.sessionService.sendCommand(this.fieldId, 'session/current-session', {});
    if (this.settings?.length) {
      this.selectedPreset = this.settings[0].name
    }
  }
  
  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
  }
  
  pauseSession() {
    this.sessionService.pause(this.fieldId);
  }
  
  startSession(sessionOptions?: SessionSettings) {
    this.sessionService.start(this.fieldId, sessionOptions);
    this._isSessionStarting = true;
  }
  
  startOrPause() {
    if (this.session) this.session.isPaused ? this.sessionService.restart(this.fieldId) : this.sessionService.pause(this.fieldId);
    else this.startSession(this.selectedSettings);
  }

  restartSession() {
    this.sessionService.restart(this.fieldId);
  }

  resetSession() {
    this.sessionService.reset(this.fieldId);
  }

  stopSession() {
    this.sessionService.stop(this.fieldId);
  }

  openSettingsDialog(event: MouseEvent) {
    event.stopPropagation();
    this.sessionSettingsService.getDefaultSessionSettingsForField(this.fieldId).subscribe((sessionSettings) => {
      const [dialogRef, contentRef] = this.dialogService.open(SessionStartDialogComponent, {sessionSettings:sessionSettings, settings:this.settings});
      contentRef.instance.navigateToSettings.subscribe(() => {
        dialogRef.instance.close();
        this.router.navigate(['/manager/settings', this.fieldId]);
      });
      contentRef.instance.submitSettings.subscribe((settings) => {
        this.startSession(settings);
        dialogRef.instance.close();
      });
    });
  }
  
  stopPropagation(){
    event.stopPropagation();
  }

  selectPreset(presetName){
    this.selectedSettings = this.settings.find((settings) => settings.name === presetName);
  }

}
