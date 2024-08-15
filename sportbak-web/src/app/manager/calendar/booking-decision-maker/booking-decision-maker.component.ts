import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {CalendarField} from '../day-fields/calendar-field';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'booking-decision-maker',
  templateUrl: './booking-decision-maker.component.html',
  styleUrls: ['./booking-decision-maker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingDecisionMakerComponent extends FBKComponent {
  VIEW_INIT = 0;
  VIEW_COMMENT = 1;
  VIEW_LOADING = 2;
  VIEW_RESULT = 3;
  hasAccepted: boolean = false;
  commentViewText: string;
  placeholder: string;
  mode = this.VIEW_INIT;
  commentText: string = '';
  resultText: string;
  @Input() hasDateChanged: boolean;
  @Input() booking: BookingModel;
  @Input() dayField: CalendarField;
  @Input() buttonDecision: string;
  @Output() validateBooking = new EventEmitter();
  @Output() closeBookingModal = new EventEmitter();
  @Output() showRequestStatus = new EventEmitter();
  @Output() updateUpcomingBookings = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private bookingProvider: BookingService,
    private eventsProvider: SBKEventsProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {

  }

  onCommentTextChange(value) {
    this.commentText = value;
  }

  acceptBooking() {
    this.mode = this.VIEW_LOADING;
    if (this.hasDateChanged) {
      this.validateBooking.emit();
    } else {
      const bookingData = {
        field: this.booking.field,
        managerComment: this.commentText,
      };
      this.bookingProvider.acceptBooking(this.booking._id, bookingData).subscribe({
        next: (response) => {
          const bookingResult = new BookingModel(response['result']);
          this.dayField.updateBooking(bookingResult);
          this.showRequestStatus.emit({text: this.getTranslation('success_booking_accepted'), success: true});
          this.closeDecisionMaker();
          this.setUpcomingBookings();
        }, error: (error) => {
          showError(error, ApplicationErrorsIds.bookings.error_accepting_booking);
          this.closeDecisionMaker();
          this.showRequestStatus.emit({text: this.getTranslation('booking_decision_failure'), success: false});
        },
      });
    }
  }

  cancelBooking() {
    this.mode = this.VIEW_LOADING;
    const bookingData = {managerComment: this.commentText};
    this.bookingProvider.refuseBooking(this.booking._id, bookingData).subscribe({
      next: (response) => {
        this.mode = this.VIEW_RESULT;
        this.resultText = this.getTranslation('success_booking_refused');
        const bookingResult = new BookingModel(response['result']);
        this.dayField.deleteBooking(bookingResult._id);
        this.closeDecisionMaker();
        this.setUpcomingBookings();
        this.showRequestStatus.emit({text: this.getTranslation('success_booking_refused'), success: true});
      },
      error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_refusing_booking);
        this.mode = this.VIEW_RESULT;
        this.resultText = this.getTranslation('booking_decision_failure');
        this.closeDecisionMaker();
        this.showRequestStatus.emit({text: this.getTranslation('booking_decision_failure'), success: false});
      },
    });
  }

  setUpcomingBookings() {
    this.eventsProvider.publish(SBKEventsIds.upcomingBookingChanged);
  }


  cancel() {
    this.commentText = '';
    this.mode = this.VIEW_INIT;
    this.hasAccepted = false;
  }

  closeDecisionMaker() {
    this.closeBookingModal.emit();
    setTimeout(() => {
      this.cancel();
    }, 500);
  }
}
