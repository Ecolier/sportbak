import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {AnnouncementModel} from 'src/app/shared/models/complex/announcementModel';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-announcement-widget',
  templateUrl: './manager-announcement-widget.component.html',
  styleUrls: ['./manager-announcement-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerAnnouncementWidgetComponent extends FBKComponent {
  isDisplayingDetails: boolean;
  formattedDate: string;
  @Input() notification: AnnouncementModel;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerNotificationWidgetComponent');
  }

  fbkOnInit() {}

  toggleDetailsDisplay() {
    this.isDisplayingDetails = !this.isDisplayingDetails;
  }
}
