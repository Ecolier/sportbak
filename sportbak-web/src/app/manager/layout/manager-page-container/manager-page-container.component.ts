import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {NotificationModel} from '../../shared/models/notification/notification.model';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {BookingModel} from '../../../shared/models/booking.model';
import {NotificationsService} from '../../shared/services/notifications.service';
import {ApplicationNotificationModel} from '../../shared/models/notification/application.notification.model';
import {UserModel} from '../../../shared/models/user/user.model';
import {ModalDataModel} from '../../shared/models/modal-data.model';
import {setErrorEventsProvider} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-page-container',
  templateUrl: './manager-page-container.component.html',
  styleUrls: ['./manager-page-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerPageContainerComponent extends FBKComponent {
  notifications: { notification: NotificationModel, hidden: boolean }[] = [];
  isShowingPopupModal = false;
  modalData: { booking?: BookingModel, user?: UserModel };
  isShowingErrorPopup = false;
  errorMessage: string;
  displayTimeout = 10000;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private eventsProvider: SBKEventsProvider,
    private notificationsService: NotificationsService,
  ) {
    super(_refElement, translate, 'ManagerPageContainerComponent');
    setErrorEventsProvider(eventsProvider);
  }

  fbkOnInit() {
    this.eventsProvider.subscribe(this, SBKEventsIds.notifications, (notification: NotificationModel) => {
      if (notification.isSilent) {
        return;
      }
      this.displayPopupNotification(notification);
    });
    this.eventsProvider.subscribe(this, SBKEventsIds.openPopupModal, (data: ModalDataModel) => {
      this.displayPopupModal(data);
    });
    this.eventsProvider.subscribe(this, SBKEventsIds.openPopupError, (errorMessage: string) => {
      this.displayErrorPopup(errorMessage);
    });
  }

  fbkOnDestroy() {
    this.eventsProvider.unsubscribeAllTopics(this);
  }

  openNotification(event: Event, notification: NotificationModel) {
    event.stopPropagation();
    this.hidePopupNotification(notification);
    if (notification?.payload?.reference) {
      const notificationToOpen = new ApplicationNotificationModel();
      notificationToOpen._id = notification.payload.reference;
      this.notificationsService.openAnApplicationNotifications(notificationToOpen)
          .subscribe({
            next: () => this.eventsProvider.publish(SBKEventsIds.notificationUpdated, {
              id: notification.payload.reference,
              openedAt: new Date(),
            }),
            error: (err) => this.displayErrorPopup('error_with_server'),
          });
    }
    if (notification?.payload?.data?.booking) {
      this.displayPopupModal({booking: new BookingModel(notification.payload.data.booking)});
    } else if (notification.payload?.data?.user) {
      this.displayPopupModal({user: new UserModel(notification.payload.data.user)});
    } else {
      this.displayErrorPopup('no_data');
    }
  }

  displayPopupNotification(notification: NotificationModel) {
    this.notifications.push({notification, hidden: false});
    setTimeout(() => this.hidePopupNotification(notification), this.displayTimeout);
  }

  hidePopupNotification(notification: NotificationModel) {
    const index = this.notifications.findIndex((n) => n.notification === notification);
    if (index >= 0) {
      this.notifications[index].hidden = true;
      setTimeout(() => this.notifications.splice(index, 1), 1000);
    }
  }

  displayPopupModal(data: ModalDataModel) {
    this.modalData = data;
    this.isShowingPopupModal = true;
  }

  hidePopupModal() {
    this.isShowingPopupModal = false;
  }

  displayErrorPopup(message: string) {
    this.errorMessage = this.getTranslation(message);
    this.isShowingErrorPopup = true;
    console.log(message);
    setTimeout(() => this.hideErrorPopup(), this.displayTimeout);
  }

  hideErrorPopup() {
    this.isShowingErrorPopup = false;
  }
}
