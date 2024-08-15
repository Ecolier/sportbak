import {Component, ElementRef} from '@angular/core';
import {ApplicationNotificationModel} from '../shared/models/notification/application.notification.model';
import {SSEProvider} from '../shared/services/sse.provider';
import {NotificationsService} from '../shared/services/notifications.service';
import {ManagerProvider} from '../shared/services/manager.service';
import {SBKEventsProvider} from '../../shared/services/events.provider';
import {SBKEventsIds} from '../../shared/values/events-ids';
import {FBKComponent} from '../../shared/components/base.component';
import {TranslateAppProvider} from '../../shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {ApplicationErrorsIds, showError} from '../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-notifications',
  templateUrl: './manager-notifications.component.html',
  styleUrls: ['./manager-notifications.component.scss'],
})
export class ManagerNotificationsComponent extends FBKComponent {
  isLoaded = false;
  isLoadingMore = false;
  hasMore = false;
  hasNotif = true;

  limit = 20;
  notifications: ApplicationNotificationModel[] = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private sse: SSEProvider,
    private notificationService: NotificationsService,
    private eventsProvider: SBKEventsProvider,
    private managerProvider: ManagerProvider,
    private managerMenuService: ManagerMenuService,
  ) {
    super(_refElement, translate, 'Notifications');
    this.managerMenuService.setActiveMenuItemKey('calendar');
  }

  fbkOnInit(): void {
    this.init();
  }

  fbkOnDestroy() {
    this.eventsProvider.unsubscribeAllTopics(this);
  }

  private init() {
    this.getNotifications(this.limit);
    this.eventsProvider.subscribe(this, SBKEventsIds.notifications, () => this.getNotifications(this.notifications.length + 1));
    this.eventsProvider.subscribe(this, SBKEventsIds.notificationUpdated, (notification: { id: string, openedAt: Date }) => {
      const notificationToUpdate = this.notifications.find((notif) => notif._id === notification.id);
      if (notificationToUpdate) {
        notificationToUpdate.openedAt = notification.openedAt;
        notificationToUpdate.seenAt = notification.openedAt;
      }
    });

    this.isLoaded = true;
  }

  private getNotifications(limit: number) {
    this.notificationService.getNotifications(limit)
        .then((notifications: ApplicationNotificationModel[]) => {
          this.notifications = notifications;
          if (this.notifications.length === 0) {
            this.hasNotif = false;
          }
          this.hasMore = notifications.length >= this.limit;
        },
        )
        .catch((err) => showError(err, ApplicationErrorsIds.notifications.error_getting_notifications))
        .finally(() => this.isLoadingMore = false);
  }

  getMoreNotifications() {
    this.isLoadingMore = true;
    if (this.notifications.length === 0) {
      this.getNotifications(this.limit);
    } else {
      this.notificationService.getNotificationsBefore(this.notifications[this.notifications.length - 1], this.limit)
          .then((notifications) => {
            this.notifications.push(...notifications);
            if (notifications.length < this.limit) {
              this.hasMore = false;
            }
          })
          .catch((err) => showError(err, ApplicationErrorsIds.notifications.error_getting_notifications))
          .finally(() => this.isLoadingMore = false);
    }
  }

  openNotification(event: Event, notification: ApplicationNotificationModel) {
    this.notificationService.openNotification(event, notification);
  }
}
