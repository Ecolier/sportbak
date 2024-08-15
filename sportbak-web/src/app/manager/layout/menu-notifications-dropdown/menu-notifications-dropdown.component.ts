import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ApplicationNotificationModel} from '../../shared/models/notification/application.notification.model';
import {FBKComponent} from '../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../shared/services/translate/translate.service';
import {NotificationsService} from '../../shared/services/notifications.service';
import {showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'menu-notifications-dropdown',
  templateUrl: './menu-notifications-dropdown.component.html',
  styleUrls: ['./menu-notifications-dropdown.component.scss'],
})
export class MenuNotificationsDropdownComponent extends FBKComponent {
  @Input() isShowingNotifications: boolean;
  @Input() notifications: ApplicationNotificationModel[];

  @Output() toggleNotifications: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  isLoading = true;
  private hasUnreadNotifications = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {
    super(_refElement, translate, 'Notifications');
  }

  fbkOnInit(): void {
  }

  fbkInputChanged() {
    if (this.notifications) {
      this.isLoading = false;
      this.computeUnreadNotificationsNumber();
      this.seeAllNotifications();
    }
    if (!this.isShowingNotifications && this.notifications) {
      setTimeout(() => this.scrollToTop(), 2000);
    }
  }

  redirectToNotifications() {
    this.toggleNotifications.emit();
    this.closeMenu.emit();
    this.router.navigate(['/manager/notifications']);
  }

  scrollToTop() {
    document.getElementById('notifications').scroll(0, 0);
  }

  computeUnreadNotificationsNumber() {
    let unreadNotificationsNumber = 0;
    if (this.notifications && this.notifications.length !== 0) {
      for (const notification of this.notifications) {
        if (!notification.seenAt) {
          unreadNotificationsNumber++;
        }
      }
    }
    this.hasUnreadNotifications = unreadNotificationsNumber !== 0;
    return unreadNotificationsNumber;
  }

  onBellClick() {
    this.seeAllNotifications();
    this.toggleNotifications.emit();
  }

  private seeAllNotifications() {
    if (this.hasUnreadNotifications && this.isShowingNotifications) {
      for (const notification of this.notifications) {
        notification.seenAt = new Date();
      }
      this.notificationsService.seenAllApplicationNotifications().subscribe({
        error: (err) => showError(err, 'error_with_server'),
      });
    }
    this.hasUnreadNotifications = false;
  }

  openNotification(event: Event, notification: ApplicationNotificationModel) {
    this.notificationsService.openNotification(event, notification);
    this.closeMenu.emit();
  }
}
