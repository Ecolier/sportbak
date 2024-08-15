import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {BookingModel} from '../../../../shared/models/booking.model';

@Component({
  selector: 'booking-status-badge',
  templateUrl: './booking-status-badge.component.html',
  styleUrls: ['./booking-status-badge.component.scss'],
})
export class BookingStatusBadgeComponent extends FBKComponent {
  @Input() booking: BookingModel;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'BookingStatusBadgeComponent');
  }

  fbkOnInit(): void {
  }
}
