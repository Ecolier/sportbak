import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Conf} from 'src/app/conf';
import {ApplicationNotificationModel} from '../models/notification/application.notification.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {BookingModel} from '../../../shared/models/booking.model';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {BookingService} from './bookings.service';
import {UserModel} from '../../../shared/models/user/user.model';
import {ApplicationErrorsIds, showError} from '../helpers/manager-errors.helper';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  static notificationURL = '/notifications/';

  constructor(
    private http: HttpClient,
    private eventProvider: SBKEventsProvider,
    private bookingService: BookingService,
  ) {
  }

  getNotifications(limit: number = 5): Promise<any> {
    const params = new HttpParams({
      fromObject: {
        limit,
      },
    });
    return this.makeGetRequest(params);
  }

  getNotificationsBefore(notification: ApplicationNotificationModel = null, limit: number = 5): Promise<any> {
    let selectors = {};
    if (notification) {
      selectors = {createdAt: {$lt: notification.createdAt}};
    }
    const params = new HttpParams({
      fromObject: {
        selectors: JSON.stringify(selectors),
        limit,
      },
    });
    return this.makeGetRequest(params);
  }

  makeGetRequest(params: HttpParams): Promise<any> {
    const notifications: ApplicationNotificationModel[] = [];
    return new Promise((resolve, reject) => {
      this.http.get(Conf.apiBaseUrl + NotificationsService.notificationURL, {params}).subscribe({
        next: (value: ApplicationNotificationModel[]) => {
          value.forEach((notification) => {
            notifications.push(new ApplicationNotificationModel(notification));
          });
          resolve(notifications);
        },
        error: (err) => {
          console.log('Error while getting notifications : ', err);
          reject(err);
        },
      });
    });
  }

  public openAnApplicationNotifications(appNotification: ApplicationNotificationModel): Observable<any> {
    return this.http.patch<any>(Conf.apiBaseUrl + NotificationsService.notificationURL + appNotification._id + '/opened', {})
        .pipe(map((response) => {
          return response;
        }));
  }

  public seenAllApplicationNotifications(): Observable<any> {
    return this.http.patch<any>(Conf.apiBaseUrl + NotificationsService.notificationURL + 'seen', {})
        .pipe(map((response) => {
          return response;
        }));
  }

  openNotification(event: Event, notification: ApplicationNotificationModel) {
    event.stopPropagation();
    if (!notification.openedAt) {
      this.sendOpenNotification(notification);
    }
    if (notification?.data?.booking) {
      this.showBooking(notification);
    } else if (notification?.data?.user) {
      this.showNewFollower(notification);
    } else {
      showError('No notification data', ApplicationErrorsIds.notifications.no_notification_data);
    }
  }

  private showNewFollower(notification: ApplicationNotificationModel) {
    this.bookingService.getUserById(notification.data.user).subscribe({
      next: (user) => this.eventProvider.publish(SBKEventsIds.openPopupModal, {user: new UserModel(user)}),
      error: (err) => showError(err, ApplicationErrorsIds.error_with_server),
    });
  }

  private showBooking(notification: ApplicationNotificationModel) {
    this.bookingService.getBookingById(notification.data.booking)
        .subscribe({
          next: (booking) => {
            this.eventProvider.publish(SBKEventsIds.openPopupModal, {booking: new BookingModel(booking)});
          },
          error: (err) => showError(err, ApplicationErrorsIds.error_with_server),
        });
  }

  private sendOpenNotification(notification: ApplicationNotificationModel) {
    const openDate = new Date();
    notification.openedAt = openDate;
    notification.seenAt = openDate;
    this.openAnApplicationNotifications(notification)
        .subscribe({
          next: () => this.eventProvider.publish(SBKEventsIds.notificationUpdated, {id: notification._id, openedAt: notification.openedAt}),
          error: (err) => showError(err, ApplicationErrorsIds.error_with_server),
        });
  }
}
