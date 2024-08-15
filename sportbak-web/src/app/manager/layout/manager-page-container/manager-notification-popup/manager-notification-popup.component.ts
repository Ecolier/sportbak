import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {NotificationModel} from '../../../shared/models/notification/notification.model';
import {SportType} from '../../../../shared/values/sport';

@Component({
  selector: 'notification-popup',
  templateUrl: './manager-notification-popup.component.html',
  styleUrls: ['./manager-notification-popup.component.scss'],
})
export class ManagerNotificationPopupComponent extends FBKComponent {
  @Input() notification: NotificationModel;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  hasSpecificSportType: boolean;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Notifications');
  }

  fbkOnInit() {
  }

  fbkInputChanged() {
    this.hasSpecificSportType = this.notification.payload.sport !== ('everysport' as SportType);
  }

  closeNotification($event: Event) {
    $event.stopPropagation();
    this.onClose.emit();
  }
}
