import {Component, ElementRef, Input} from '@angular/core';
import {ApplicationNotificationModel} from '../../../shared/models/notification/application.notification.model';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';

@Component({
  selector: 'menu-notification',
  templateUrl: './menu-notification.component.html',
  styleUrls: ['./menu-notification.component.scss'],
})
export class MenuNotificationComponent extends FBKComponent {
  @Input() notification: ApplicationNotificationModel;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Notifications');
  }

  fbkOnInit(): void {
  }
}
