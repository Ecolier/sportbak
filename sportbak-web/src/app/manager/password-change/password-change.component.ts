import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider, ManagerTokenService} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {ManagerMenuProvider} from '../shared/services/menu.provider';
import {SSEProvider} from '../shared/services/sse.provider';

@Component({
  selector: 'password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PasswordChangeComponent extends FBKComponent {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  canValidate: boolean = false;
  hasSubmitted: boolean = false;
  hasFailedSending: boolean = false;
  isLoading: boolean = false;
  failureText: string;
  isNecessary: boolean = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
    private menu: ManagerMenuProvider,
    private sse: SSEProvider,
    private managerTokenService: ManagerTokenService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('password-change');
  }

  fbkOnInit() {
    if (this.activatedRoute.snapshot.queryParams['options'] && this.activatedRoute.snapshot.queryParams['options'].includes('necessary')) {
      this.menu.hide();
      this.isNecessary = true;
    }
  }

  onUsernameChange(value) {
    this.checkCanValidate();
  }

  onCurrentPasswordChange(value) {
    this.currentPassword = value;
    this.checkCanValidate();
  }

  onNewPasswordChange(value) {
    this.newPassword = value;
    this.checkCanValidate();
  }

  onNewPasswordConfirmationChange(value) {
    this.newPasswordConfirmation = value;
    this.checkCanValidate();
  }

  checkCanValidate() {
    this.canValidate = this.currentPassword && this.currentPassword.trim().length > 0 &&
      this.newPassword && this.newPassword.trim().length > 0 && this.newPassword == this.newPasswordConfirmation;
  }

  onValidateClick() {
    this.isLoading = true;
    this.managerProvider.changePassword({password: this.currentPassword, newPassword: this.newPassword}).subscribe((response) => {
      this.hasFailedSending = false;
      this.isLoading = false;
      this.hasSubmitted = true;
      ManagerProvider.isNewPasswordSet = true;
      setTimeout(() => {
        this._router.navigate(['manager/space']);
      }, 2000);
    },
    (error) => {
      if (error.error.code == -4) {
        this.failureText = this.getTranslation('invalid_current_password');
      } else {
        this.failureText = this.getTranslation('password_change_failure');
      }
      this.hasFailedSending = true;
      this.isLoading = false;
      this.hasSubmitted = true;
    });
    this.resetFields();
  }

  resetFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.newPasswordConfirmation = '';
    this.checkCanValidate();
  }

  redirectToContact() {
    this._router.navigate(['manager/contact']);
  }

  return() {
    this._router.navigate(['manager/space']);
  }

  isNewPasswordNeeded() {
    return this.managerProvider.getNewPasswordNeeded();
  }

  logOut() {
    localStorage.removeItem('user_id');
    this.managerProvider.hasLoaded = false;
    this.managerTokenService.clear();
    this.sse.disconnect();
    this._router.navigate(['']);
  }
}
