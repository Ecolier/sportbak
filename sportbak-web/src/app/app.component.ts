import {Component, Directive, Input} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DataService} from './shared/services/data.service';
import {SBKEventsProvider} from './shared/services/events.provider';
import {TranslateAppProvider} from './shared/services/translate/translate.service';
import {SBKEventsIds} from './shared/values/events-ids';

declare const $: any;

const eventTarget = 'app-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  manager = false;
  status: boolean = false;
  simulation: boolean = false;
  simulateur: boolean = false;
  isManagerMenuVisible = true;

  constructor(
    private dataService: DataService,
    private translateService: TranslateAppProvider,
    private activatedRoute: ActivatedRoute,
    private events: SBKEventsProvider,
    private router: Router) {
    dataService.init();

    this.events.subscribe(eventTarget, SBKEventsIds.showManagerMenu, this.showManagerMenu.bind(this));
    this.events.subscribe(eventTarget, SBKEventsIds.hideManagerMenu, this.hideManagerMenu.bind(this));

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.url.includes('manager') ? this.manager = true : this.manager = false;
        event.url.includes('simulation') ? this.simulation = true : this.simulation = false;
        event.url.includes('simulateur') ? this.simulateur = true : this.simulateur = false;

        if (event.url.includes('whitepaper') ||
          event.url.includes('main-page') ||
          event.url.includes('manager-login') ||
          event.url.includes('competition') ||
          event.url.includes('complex-ctn') ||
          event.url.includes('my-complex') ||
          event.url.includes('get-home')) {
          this.hideManagerMenu();
        } else {
          this.showManagerMenu();
        }
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  clickEvent() {
    this.status = !this.status;
  }

  showManagerMenu() {
    this.isManagerMenuVisible = true;
  }

  hideManagerMenu() {
    this.isManagerMenuVisible = false;
  }

  ngOnDestroy() {
    this.events.unsubscribeAllTopics(eventTarget);
  }
}
