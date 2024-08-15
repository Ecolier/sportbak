import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {AnnouncementModel} from 'src/app/shared/models/complex/announcementModel';
import {Router} from '@angular/router';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-announcement-creator',
  templateUrl: './manager-announcement-creator.component.html',
  styleUrls: ['./manager-announcement-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerAnnouncementCreatorComponent extends FBKComponent {
  numberOfFollowers = 0;
  notificationTitle = '';
  notificationContent = '';
  isLoading = false;
  hasFailedSending: boolean;
  hasSucceededSending: boolean;
  hasSubmitted = false;
  failureMsg = '';
  failureCounts = 0;
  canCreateNotifications = true;
  delayBetweenNotifications: number;
  previousNotifications: AnnouncementModel[] = [];
  timeBeforeNextNotification = 0;


  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private _router: Router,
    private managerMenuService: ManagerMenuService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('announcements');
  }

  fbkOnInit() {
    this.isLoading = true;
    this.initializeVariables();
    this.failureMsg = this.getTranslation('notification_failure');
  }

  initializeVariables() {
    this.previousNotifications = this.managerProvider.getAnnouncements();
    this.managerProvider.getNumberOfFollowers().subscribe({
      next: (response) => {
        this.numberOfFollowers = response['result'];
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.unable_to_get_nb_followers);
      },
    });
    this.checkIfCanCreateNotification();
    this.isLoading = false;
  }

  onNotificationTitleChange(event) {
    this.notificationTitle = event;
  }

  onNotificationContentChange(event) {
    this.notificationContent = event;
  }

  resetInputs() {
    this.notificationTitle = '';
    this.notificationContent = '';
  }

  onSendClick() {
    if (this.notificationTitle.length < 1 || this.notificationContent.length < 1) {
      return;
    }
    this.isLoading = true;
    this.managerProvider.sendAnnouncement({
      title: this.notificationTitle,
      content: this.notificationContent,
      targets: 0,
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.hasFailedSending = false;
        this.hasSucceededSending = true;
        this.resetInputs();
        this._router.navigate(['/manager/announcements'], {queryParams: {send: this.hasSucceededSending}}).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.hasSubmitted = true;
        this.hasSucceededSending = false;
        this.hasFailedSending = true;
        this.failureCounts++;
        if (error['error']['status'] === 1) {
          this.failureMsg = this.getTranslation('delay_not_respected');
        }
      },
    });
  }

  checkIfCanCreateNotification() {
    const latestNotification = this.getLatestNotification();
    this.delayBetweenNotifications = this.managerProvider.getDelayBetweenNotifications();
    const today = new Date(Date.now());
    if (!latestNotification) {
      this.canCreateNotifications = true;
    } else if (today.getTime() - latestNotification.createdAt.getTime() <= this.delayBetweenNotifications) {
      this.initTimeBeforeNextNotification();
      this.canCreateNotifications = false;
    }
  }

  getLatestNotification() {
    return this.previousNotifications[0];
  }

  initTimeBeforeNextNotification() {
    const now = new Date(Date.now()).getMilliseconds();
    const latestNotifDate = this.getLatestNotification().createdAt.getMilliseconds();
    const timeSinceLatestNotif = now - latestNotifDate;
    const timeBeforeNextNotifMilliseconds = this.delayBetweenNotifications - timeSinceLatestNotif;
    this.timeBeforeNextNotification = (timeBeforeNextNotifMilliseconds / 86400000);
    this.timeBeforeNextNotification = Math.ceil(this.timeBeforeNextNotification);
  }

  millisecondsToDay(milliseconds: number) {
    return Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  }

  goBack() {
    this._router.navigate(['/manager/announcements']);
  }
}
