import {Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output} from '@angular/core';
import {AbstractControl, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fn} from 'jquery';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {ManagerProvider} from '../../shared/services/manager.service';
import {DEFAULT_SESSION} from '../default-session-settings';
import {SessionSettings} from '../settings.model';
import {SessionSettingsService} from '../settings.service';

let nextId = 0;

@Component({
  selector: 'session-form',
  templateUrl: './session-settings-form.component.html',
  styleUrls: ['./session-settings-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SessionSettingsFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SessionSettingsFormComponent),
      multi: true,
    },
  ],
})
export class SessionSettingsFormComponent extends FBKComponent {
  @HostBinding('attr.theme') @Input() theme: string;
  @Input() session: SessionSettings;
  @Output() sessionChange = new EventEmitter<SessionSettings>();
  id = `sbk-session-form-${nextId++}`

  defaultFormValues = DEFAULT_SESSION;

  sessionFormGroup = this.formBuilder.group({
    time: ['', Validators.pattern('([0-9]{2}:?){3}')],
    period: [this.defaultFormValues.period],
    pauseTime: ['', Validators.pattern('([0-9]{2}:?){3}')],
    warmup: ['', Validators.pattern('([0-9]{2}:?){3}')],
    teamName1: ['', Validators.pattern('[a-zA-Z0-9_]*')],
    teamName2: ['', Validators.pattern('[a-zA-Z0-9_]*')],
    sound: [this.defaultFormValues.sound],
    ambiance: [this.defaultFormValues.ambiance],
  });

  constructor(
    private formBuilder: FormBuilder,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private sessionSettingsService: SessionSettingsService,
    protected managerMenuService: ManagerMenuService,
    private activatedRoute: ActivatedRoute,
    private _router: Router) {
    super(_refElement, translate, 'SessionSettingsFormComponent');
    this.sessionFormGroup.get('period').valueChanges.subscribe((period) => {
      if (period <= 1) {
        this.sessionFormGroup.get('pauseTime').disable();
        this.sessionFormGroup.get('pauseTime').setValue(0);
      } else this.sessionFormGroup.get('pauseTime').enable();
    });
  }

  fbkOnInit() {}

  writeValue(obj: any): void {
    this.sessionFormGroup.patchValue(obj);
  }

  registerOnChange(fn: any): void {
    this.sessionFormGroup.valueChanges.subscribe((form) => {
      if (!form.pauseTime) form.pauseTime = 0;
    });
    this.sessionFormGroup.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  validate(control: AbstractControl): ValidationErrors | void {

  }

  registerOnValidatorChange?(fn: () => void): void { }
}
