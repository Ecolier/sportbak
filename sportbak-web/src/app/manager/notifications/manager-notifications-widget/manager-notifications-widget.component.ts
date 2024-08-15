import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApplicationNotificationModel} from '../../shared/models/notification/application.notification.model';
import {FBKComponent} from '../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../shared/services/translate/translate.service';
import {SportType} from '../../../shared/values/sport';

@Component({
  selector: 'manager-notifications-widget',
  templateUrl: './manager-notifications-widget.component.html',
  styleUrls: ['./manager-notifications-widget.component.scss'],
})
export class ManagerNotificationsWidgetComponent extends FBKComponent {
  @Input() notification: ApplicationNotificationModel;

  hasSpecificSportType: boolean;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Notifications');
  }

  fbkOnInit(): void {
  }

  fbkInputChanged() {
    this.hasSpecificSportType = this.notification.sport !== ('everysport' as SportType);
  }
}
