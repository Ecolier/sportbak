import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {BookingModel} from '../../../../shared/models/booking.model';
import {oneNumberToTwoNumber} from '../../helpers/date.helper';

@Component({
  selector: 'booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent extends FBKComponent {
  @Input() booking: BookingModel;

  date: string;
  startAt: string;
  endAt: string;
  needSubtitle: boolean;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'BookingCardComponent');
  }

  fbkOnInit(): void {
  }

  fbkInputChanged() {
    this.setFields();
  }

  setFields() {
    this.date = this.booking.startAt.toLocaleDateString(
        this.translate.getLanguage(),
        {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'},
    );
    this.startAt = this.schedule(this.booking.startAt);
    this.endAt = this.schedule(this.booking.endAt);
    this.needSubtitle = ['expired', 'removed', 'closed'].includes(this.booking.status);
  }

  schedule(date: Date) {
    return oneNumberToTwoNumber(date.getHours()) + ' : ' + oneNumberToTwoNumber(date.getMinutes());
  }
}
