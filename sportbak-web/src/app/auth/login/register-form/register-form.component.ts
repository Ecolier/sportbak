import {Component, ElementRef, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterFormComponent extends FBKComponent {
  hasConnectionFailed: boolean;
  simulateurForm: FormGroup;
  hasSubmittedLogin: boolean = false;
  hasReceivedLoginAnswer: boolean = false;
  isLoginSuccess: boolean = undefined;
  alert:any;
  @Output() alertMessage = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private formBuilder: FormBuilder,
    public request: FBKRequestProvider,
    protected translateService: TranslateService,
  ) {
    super(_refElement, translate, 'ManagerLoginComponent');
    this.initializeLoginFields();
  }

  fbkOnInit() {

  }
  get f() {
    return this.simulateurForm.controls;
  }
  onSubmit() {
    this.hasSubmittedLogin = true;
    const currentLanguage = this.translateProvider.getLanguage();
    this.managerProvider.postSubscription({...this.simulateurForm.value, language: currentLanguage}).subscribe((response) => {
      this.hasSubmittedLogin = false;
      this.initializeLoginFields();
      if (response['success']) {
        this.isLoginSuccess = true;
        this.hasSubmittedLogin = false;
        this.alert = {
          content: this.getTranslation('signup_success'),
          success: true,
        };
        this.alertMessage.emit(this.alert);
      } else {
        this.isLoginSuccess = false;
        this.hasSubmittedLogin = false;
      }
    }, (error) => {
      this.initializeLoginFields();
      this.hasSubmittedLogin = false;
      this.isLoginSuccess = false;
      this.alert = {
        content: this.getTranslation('signup_failure'),
        success: true,
      };
      this.alertMessage.emit(this.alert);
    });
  }
  initializeLoginFields() {
    this.simulateurForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      mail: ['', Validators.email],
      complex: [''],
      playgrounds: [''],
      countries: [''],
    });
  }
}
