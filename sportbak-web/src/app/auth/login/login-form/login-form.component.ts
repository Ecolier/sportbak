import {Component, ElementRef, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ManagerProvider, ManagerTokenService} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent extends FBKComponent {
  managerId: string = '';
  managerPassword: string = '';
  managerUserId: string = '';
  hasConnectionFailed: boolean;
  alert: any;
  hasSubmittedLogin: boolean = false;
  hasReceivedLoginAnswer: boolean = false;
  isLoginSuccess: boolean = undefined;
  superAdminCount: number = 0;
  superAdmin: boolean = false;
  @Output() alertMessage = new EventEmitter();


  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private route: ActivatedRoute,
    public request: FBKRequestProvider,
    protected translateService: TranslateService,
    private token: ManagerTokenService,
  ) {
    super(_refElement, translate, 'ManagerLoginComponent');
  }

  fbkOnInit() {

  }

  onValidate() {
    this.managerProvider.login({username: this.managerId, password: this.managerPassword, superAdmin: this.superAdmin})
    .subscribe({
      next: (response) => {
            const user = response['user'];
            if (user && user.role === 'superadmin') {
              console.log('alert admin');
              this.token.setAdminMode(response['token'], user.role, this.managerUserId);
              this.redirectToManagerPage();
            }
            if (user && user.role === 'complexmanager') {
              this.token.setToken(response['token']);
              this.redirectToManagerPage();
            } 
          },
          error: (error) => {
            if (error.status == 400) {
              this.alert = {
                content: this.getTranslation('credentials_error'),
                success: false,
              };
              this.alertMessage.emit(this.alert);
            }
          },
        });
  }

  redirectToManagerPage() {
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['origin']) {
      this.router.navigate(['/manager/' + this.route.snapshot.queryParams['origin']]);
    } else {
      this.router.navigate(['/manager/day']);
    }
  }

  setManagerId(event) {
    this.managerId = event;
  }

  setManagerPassword(event) {
    this.managerPassword = event;
  }

  setManagerUserId(event) {
    this.managerUserId = event;
  }

  activateSuperManager() {
    this.superAdminCount += 1;
    if (this.superAdminCount >= 10) {
      this.superAdmin = true;
    }
  }
}
