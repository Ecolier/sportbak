import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {AnnouncementModel} from 'src/app/shared/models/complex/announcementModel';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {FBKComponent} from 'src/app/shared/components/base.component';

@Component({
  selector: 'manager-announcements',
  templateUrl: './manager-announcement.component.html',
  styleUrls: ['./manager-announcement.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerAnnouncementComponent extends FBKComponent {
  complex: ComplexModel;
  notificationTitle: string = '';
  notificationContent: string = '';
  previousNotificationsLoaded:boolean = false;
  failureMsg: string = '';
  hasFailedSending: boolean;
  hasSucceededSending: boolean;
  hasSubmitted: boolean = false;
  previousNotifications: AnnouncementModel[] = [];
  failureCounts: number = 0;
  isLoading: boolean = false;
  hasNotifications: boolean = true;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('announcements');
  }

  fbkOnInit() {
    this.initializeVariables();
    this.failureMsg = this.getTranslation('notification_failure');
  }


  initializeVariables() {
    if (this.activatedRoute.snapshot.queryParams['send']) {
      this.hasSubmitted = true;
      this.hasFailedSending = false;
      this.hasSucceededSending = true;
      setTimeout(() =>{
        this.hasSubmitted = false;
      }, 2000);
    }
    this.complex = this.managerProvider.getComplex();
    this.previousNotifications = this.managerProvider.getAnnouncements();
    this.sortNotificationsByDate();
    this.checkHasNotifications();
  }

  checkHasNotifications() {
    if (this.previousNotifications.length < 1) {
      this.hasNotifications = false;
    }
  }

  sortNotificationsByDate() {
    this.previousNotifications = this.previousNotifications.sort((a, b)=> {
      return Number(b.createdAt) - Number(a.createdAt);
    });
    this.previousNotificationsLoaded = true;
  }

  onNotificationTitleChange(event) {
    this.notificationTitle = event;
  }

  onNotificationContentChange(event) {
    this.notificationContent = event;
  }

  newAnnoucement() {
    this._router.navigate(['/manager/announcements/new']);
  }
}
