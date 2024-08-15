import {Component, ElementRef, HostBinding, Input} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'home-navigation',
  templateUrl: './home-navigation.component.html',
  styleUrls: ['./home-navigation.component.scss'],
})
export class HomeNavigationComponent extends FBKComponent {
  @Input() displayOptions = true;
  @HostBinding('class.active') get active() {
    return this.isMenuDisplayed;
  };
  isMenuDisplayed = false;
  isLoginRoute:boolean;
  isRegister:boolean;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
    private _router: Router,

  ) {
    super(_refElement, translate, 'HomePageComponent');
    _router.events.subscribe((val) => {
      this.checkIsRegister();
    });
  }

  fbkOnInit() {
    this.checkLoginRoute();
  }
  clickEvent() {
    this.isMenuDisplayed = !this.isMenuDisplayed;
  }
  onHomeClick() {
    if (this.route.routeConfig.component.name === 'MainPageComponent') {
      const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 150);
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    } else {
      this._router.navigate(['/']);
    }
  }
  onLogClick() {
    if (!this.isRegister) {
      console.log('ok');
      this._router.navigate(['.'], {relativeTo: this.route, queryParams: {signup: true}});
      this.isRegister = true;
    } else {
      this._router.navigate(['.'], {relativeTo: this.route, queryParams: { }});
      this.isRegister = false;
    }
  }
  checkLoginRoute() {
    if (this.route.routeConfig.path === 'manager-login') {
      this.isLoginRoute = true;
      this.checkIsRegister();
    } else {
      this.isLoginRoute = false;
    }
  }
  checkIsRegister() {
    if (this.route.routeConfig.path === 'manager-login') {
      this.isRegister = !!this.route.snapshot.queryParams['signup'];
    }
  }
}
