import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {getFormattedStartTimes, getFormattedEndTimes, getTwoDigitsMinutes} from '../helpers/booking.helper';
import {CalendarField} from '../day-fields/calendar-field';
import {DialogService} from 'src/app/shared/components/dialog/dialog.service';
import {BookingModalComponent} from '../booking-modal/booking-modal.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {getOpeningWindowOfDay, getFormattedOpening, getBookingsOfDate, getFieldBookings} from '../helpers/booking.helper';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';


@Component({
  selector: 'calendar-upcoming-booking',
  templateUrl: './calendar-upcoming-booking.component.html',
  styleUrls: ['./calendar-upcoming-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarUpcomingBookingComponent extends FBKComponent {
  isRequestStatusVisible: boolean = false;
  requestStatusText: string = '';
  requestStatusErrorCode = 0;
  isRequestSuccess: boolean = false;
  date: string = '';
  hour: string = '';
  bookerContact: string = '';
  isContactVisible: boolean = false;
  canSwitchContactState: boolean = true;
  isShowingRefusalConfirmation: boolean;
  isHovered: boolean;
  isSendingRequest: boolean;
  formattedStartTimes: string[] = [];
  formattedEndTimes: string[] = [];
  dayFields: CalendarField[] = [];
  hasBuiltBookings: boolean = false;
  @Output() displayMenu = new EventEmitter();
  bookingModified = new Subject<void>();
  dayField: CalendarField;
  @Input() fields: any[];
  @Input() booking: BookingModel;
  @Input() complex: ComplexModel;
  @Input() selectedGame: any;
  @Input() dateModal: Date;
  @Input() upcomingBookings: BookingModel[] = [];
  @Output() removeFromUpcomingBookings = new EventEmitter();
  @Output() updateUpcomingBookings = new EventEmitter();


  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private bookingProvider: BookingService,
    private dialogService: DialogService,
    private router: Router,
    private eventsService: SBKEventsProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
    this.getBookingsAndBuildCalendarFields();
  }

  fbkInputChanged() {
    if (this.booking && !this.date) {
      this.generateDate();
      this.generateHours();
      this.generateBookerContact();
    }
  }

  generateDate() {
    const bookingDate = new Date(this.booking.startAt);
    this.date = bookingDate.toLocaleDateString(
        this.translateProvider.getLanguage(),
        {month: 'long', day: 'numeric'},
    );
  }

  generateHours() {
    const startHour = new Date(this.booking.startAt);
    const endHour = new Date(this.booking.endAt);
    this.hour = this.formatHourAndMinutes(startHour) + ' - ' + this.formatHourAndMinutes(endHour);
  }

  formatHourAndMinutes(date: Date) {
    return date.getHours() + ':' + this.formatToDoubleDigits(date.getMinutes());
  }

  formatToDoubleDigits(value) {
    return ('0' + value).slice(-2);
  }

  generateBookerContact() {
    if (this.booking.bookerPhone) {
      this.bookerContact = this.booking.bookerPhone;
    } else if (this.booking.bookerEmail) {
      this.bookerContact = this.booking.bookerEmail;
    } else {
      if (this.booking.bookerFirstName) {
        this.bookerContact = this.bookerContact + this.booking.bookerFirstName;
      }
      if (this.booking.bookerLastName) {
        this.bookerContact = this.bookerContact + ' ' + this.booking.bookerLastName;
      }
    }
  }

  toggleIsShowingRefusalConfirmation() {
    this.isShowingRefusalConfirmation = !this.isShowingRefusalConfirmation;
  }

  acceptBooking() {
    this.isSendingRequest = true;
    const bookingData = {
      field: this.booking.field,
    };
    this.bookingProvider.acceptBooking(this.booking._id, bookingData).subscribe({
      next: (response) => {
        this.isSendingRequest = false;
        this.displayRequestStatus(this.getTranslation('accepted_booking'), true);
        this.removeFromUpcomingBookings.emit(this.booking);
      },
      error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_accepting_booking);
        this.displayRequestStatus(this.getTranslation('booking_decision_failure'), false);
        this.requestStatusErrorCode = error.error.code;
      },
    });
  }

  refuseBooking() {
    this.isSendingRequest = true;
    this.bookingProvider.refuseBooking(this.booking._id, {}).subscribe({
      next: (response) => {
        this.isSendingRequest = false;
        this.displayRequestStatus(this.getTranslation('refused_booking'), true);
        this.removeFromUpcomingBookings.emit(this.booking);
      },
      error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_refusing_booking);
        this.displayRequestStatus(this.getTranslation('booking_decision_failure'), false);
        this.requestStatusErrorCode = error.error.code;
      },
    });
  }

  displayRequestStatus(text: string, isSuccess) {
    this.isRequestStatusVisible = true;
    this.requestStatusText = text;
    this.isRequestSuccess = isSuccess;
  }

  redirectToCalendarDay() {
    this.eventsService.publish(SBKEventsIds.gotoBooking, this.booking);
  }

  resetRequestStatus() {
    this.isRequestStatusVisible = false;
  }

  onBooking(booking: BookingModel) {
    this.dayField = this.dayFields.find((fields) => fields._id === booking.field);
    this.toggleBookingModal(booking);
  }

  toggleBookingModal(booking: BookingModel) {
    const startSelect = booking.startAt.getHours() + ':' + getTwoDigitsMinutes(booking.startAt.getMinutes());

    this.formattedStartTimes = getFormattedStartTimes(this.dayField);
    this.formattedEndTimes = getFormattedEndTimes(this.dayField);

    const [dialogRef, bookingModalRef] = this.dialogService.open(BookingModalComponent, {
      clickedBlockStart: null,
      selectedStart: startSelect,
      formattedStartTimes: this.formattedStartTimes,
      formattedEndTimes: this.formattedEndTimes,
      fields: this.complex.fields,
      dayField: this.dayField,
      complex: this.complex,
      selectedBooking: booking,
      selectedGame: this.selectedGame,
      upcomingBookings: this.upcomingBookings,
    });

    bookingModalRef.instance.showRequestStatus.subscribe((event) => this.showRequestStatus(event));
  }


  setUpcomingBookings = (bookingId) => {
    this.updateUpcomingBookings.emit(bookingId);
  };

  showRequestStatus = (data) => {
    this.isRequestStatusVisible = true;
    this.requestStatusErrorCode = data.code;
    this.requestStatusText = data.text;
    this.isRequestSuccess = data.success;
  };

  getBookingsAndBuildCalendarFields() {
    const openingWindow = getOpeningWindowOfDay(this.dateModal, this.complex);
    const dateInRequest = new Date(this.dateModal);
    dateInRequest.setHours(0);
    dateInRequest.setMinutes(0);
    this.bookingProvider.getBookingsOfDay(dateInRequest).subscribe({
      next: (response) => {
        const bookingsOfDate = getBookingsOfDate(response, this.complex, this.dateModal);
        this.dayFields = [];
        this.complex.fields.forEach((field) => {
          if ((field.bookingSettings && field.bookingSettings.enable) ||
            (this.complex.bookingSettings && this.complex.bookingSettings.enable)) {
            const fieldBookings = getFieldBookings(bookingsOfDate, field);
            this.dayFields.push(new CalendarField(field, openingWindow, this.dateModal, fieldBookings));
          }
        });
        this.sortFieldsByPosition();
        this.hasBuiltBookings = true;
        this.displayMenu.emit();
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_getting_bookings_of_day);
      },
    });
  }

  sortFieldsByPosition() {
    this.dayFields = this.dayFields.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  onMouseLeave() {
    this.isHovered = false;
    this.isContactVisible = false;
  }
}
