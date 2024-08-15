import {Pipe, PipeTransform} from '@angular/core';
import {ApplicationNotificationModel} from '../models/notification/application.notification.model';

@Pipe({
  name: 'notificationIcon',
  pure: true,
})
export class NotificationIconPipe implements PipeTransform {
  constructor() {
  }

  transform(notification: {sport: string, type: string}): string {
    if (notification.type === 'booking') {
      return 'assets/img/icons/notifications/reservation_' + notification.sport + '.svg';
    }
    return 'assets/img/icons/notifications/notif_relation_foot5.svg';
  }
}
