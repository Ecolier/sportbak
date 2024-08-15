import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Conf} from 'src/app/conf';
import {ManagerProvider, ManagerTokenService} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {DataService} from 'src/app/shared/services/data.service';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-login',
  templateUrl: './manager-login.component.html',
  styleUrls: ['./manager-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerLoginComponent extends FBKComponent {
  managerId: string = '';
  managerPassword: string = '';
  hasConnectionFailed: boolean;
  errorMessage: string;
  simulateurForm: FormGroup;
  hasSubmittedLogin: boolean = false;
  hasReceivedLoginAnswer: boolean = false;
  isLoginSuccess: boolean = undefined;
  lang: string;
  srcCommercial: string;
  isLogin: boolean;
  alert: string;
  alertSuccess: boolean;
  offers:any
  isShowingPlayer: boolean = false;
  playerSrc: string;
  constructor(
    private dataService: DataService,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public request: FBKRequestProvider,
    protected translateService: TranslateService,
    private tokenService: ManagerTokenService,
  ) {
    super(_refElement, translate, 'ManagerLoginComponent');
    router.events.subscribe((val) => {
      this.isLogin = !route.snapshot.queryParams['signup'];
    });
  }

  fbkOnInit() {
    this.isLogin = true;
    this.getContentLang();
    this.offers = this.getTranslation('offers');
    if (this.isLoggingOut()) {
      this.tokenService.clear();
      this.managerProvider.hasLoaded = false;
    } else if (this.tokenService.getToken() && !this.route.snapshot.queryParams['forced_login']) {
      this.router.navigate(['/manager/space'], {queryParams: {date: new Date()}});
    }
  }

  isLoggingOut() {
    return this.route.snapshot.queryParams && this.route.snapshot.queryParams['additionalInfo'] === 'log_out';
  }

  get f() {
    return this.simulateurForm.controls;
  }

  redirectToDoc(link: string) {
    window.open(Conf.apiBaseUrl + link, '_blank');
  }

  getContentLang() {
    this.lang = this.translateService.currentLang;
    if (this.lang === 'fr') {
      this.srcCommercial = './assets/img/home-page/login/commercial-FR.png';
    } else if (this.lang === 'en') {
      this.srcCommercial = './assets/img/home-page/login/commercial-EN.png';
    }
  }

  getAlert(message) {
    setTimeout(() => {
      this.alert = null;
    }, 3000);
    this.alert = message.content;
    this.alertSuccess = message.success;
    if (!this.isLogin) {
      this.toggleLogin();
    }
  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
    this.changeQueryparams();
  }

  changeQueryparams() {
    if (!this.isLogin) {
      this.router.navigate(['.'], {relativeTo: this.route, queryParams: {signup: true}});
    } else {
      this.router.navigate(['.'], {relativeTo: this.route, queryParams: {}});
    }
  }

  toggleVideoPlayer(videoSrc:string) {
    this.isShowingPlayer = !this.isShowingPlayer;
    this.playerSrc = './assets/video/' +videoSrc;
  }
}
