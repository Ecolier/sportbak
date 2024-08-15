import {KeyValue} from '@angular/common';
import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Conf} from 'src/app/conf';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService, MenuItem, MenuItems} from './manager-menu.service';
import {NotificationsService} from '../../shared/services/notifications.service';
import {ApplicationNotificationModel} from '../../shared/models/notification/application.notification.model';
import {NotificationModel} from '../../shared/models/notification/notification.model';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-menu',
  templateUrl: './manager-menu.component.html',
  styleUrls: ['./manager-menu.component.scss'],
})
export class ManagerMenuComponent extends FBKComponent {
  isShowingNotifications = false;

  serviceMenuItems: MenuItems;
  preferenceMenuItems: MenuItems;
  actionMenuItems: MenuItems;
  logoURL = Conf.staticBaseUrl + '/images/complexes/logos/';
  isHidden: boolean = false;
  complex: ComplexModel;
  isMobileMenuDisplayed: boolean = false;
  activeMenuItemKey$: Observable<string>;

  notifications: ApplicationNotificationModel[];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
    private router:Router,
    private managerProvider: ManagerProvider,
    private eventsProvider: SBKEventsProvider,
    private notificationsService: NotificationsService,
    protected managerMenuService: ManagerMenuService) {
    super(_refElement, translate, 'ManagerMenuComponent');
    this.activeMenuItemKey$ = this.managerMenuService.getActiveMenuItemKey();
    this.serviceMenuItems = this.managerMenuService.serviceMenuItems;
    this.preferenceMenuItems = this.managerMenuService.preferenceMenuItems;
    this.actionMenuItems = this.managerMenuService.actionMenuItems;
  }

  originalMenuOrder(a: KeyValue<string, MenuItem>, b: KeyValue<string, MenuItem>): number {
    return 0;
  }

  fbkOnInit() {
    this.eventsProvider.subscribe(this, SBKEventsIds.notifications, (notification: NotificationModel) => {
      if (notification.isSilent) {
        return;
      }
      this.getNotifications();
    });
    this.eventsProvider.subscribe(this, SBKEventsIds.notificationUpdated, (notification: { id: string, openedAt: Date }) => {
      const notificationToUpdate = this.notifications.find((notif) => notif._id === notification.id);
      if (notificationToUpdate) {
        notificationToUpdate.openedAt = notification.openedAt;
        notificationToUpdate.seenAt = notification.openedAt;
      }
    });
    this.initVariables();
  }

  toggleMobileMenu() {
    this.hideNotifications();
    this.isMobileMenuDisplayed = !this.isMobileMenuDisplayed;
  }

  checkIfNeedsReloading(redirection: string) {
    if (redirection && redirection.length > 0 && this.route.snapshot.routeConfig.path.includes(redirection)) {
      window.location.reload();
    }
  }

  toggleNotifications() {
    this.isShowingNotifications = !this.isShowingNotifications;
  }

  private hideNotifications() {
    this.isShowingNotifications = false;
  }

  getNotifications() {
    this.notificationsService.getNotifications(10)
        .then((notifications) => this.notifications = notifications)
        .catch((err) => showError(err, ApplicationErrorsIds.notifications.error_getting_notifications));
  }

  fbkOnDestroy() {
    this.eventsProvider.unsubscribeAllTopics(this);
  }

  private initVariables() {
    this.complex = this.managerProvider.getComplex();
    this.notifications = this.managerProvider.getNotifs();
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
