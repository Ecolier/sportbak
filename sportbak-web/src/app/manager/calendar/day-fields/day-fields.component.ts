import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {CalendarField} from './calendar-field';
import {getBookingsOfDate, getFieldBookings, getOpeningWindowOfDay} from '../helpers/booking.helper';
import {NotificationModel} from '../../shared/models/notification/notification.model';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {FieldModel} from '../../../shared/models/field.model';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'day-fields',
  templateUrl: './day-fields.component.html',
  styleUrls: ['./day-fields.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DayFieldsComponent extends FBKComponent {
  hasBuiltBookings = false;
  dayFields: CalendarField[] = [];
  hours: string[] = [];
  savedDate: Date;
  isDebug: boolean;
  mobileUI = {
    selectedFieldIndex: 0,
  };
  fieldsScrollValue = 0;
  canScrollLeft = false;
  canScrollRight = true;
  @Input() date: Date;
  @Input() selectedGame: any;
  @Input() complex: ComplexModel;
  @Input() bookingToScroll: BookingModel;
  @Output() resetSelectedGame = new EventEmitter();
  @Output() displayMenu = new EventEmitter();
  @Output() updateUpcomingBookings = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private bookingProvider: BookingService,
    private route: ActivatedRoute,
    private eventsProvider: SBKEventsProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
    if (window.location.href.includes('debug')) {
      this.isDebug = true;
    }
    this.eventsProvider.subscribe(this, SBKEventsIds.notifications, (notification: NotificationModel) => this.reloadBookings(notification));
    this.eventsProvider.subscribe(this, SBKEventsIds.upcomingBookingChanged, () => this.getBookingsAndBuildCalendarFields());
  }

  fbkInputChanged(inputName: string, currentValue: any, lastValue: any): void {
    if (['date'].includes(inputName)) {
      if ((this.complex && this.complex.fields && !this.hasBuiltBookings) ||
        (this.savedDate && this.isSameDay(this.date) /* (this.date.getTime() != this.savedDate.getTime())*/)) {
        this.hasBuiltBookings = false;
        this.buildHours(getOpeningWindowOfDay(this.date, this.complex));
        this.getBookingsAndBuildCalendarFields();
      } else if (this.date.getTime() !== this.savedDate.getTime() && this.bookingToScroll) {
        this.scrollToBooking(this.bookingToScroll);
      }
    }
    if (inputName === 'bookingToScroll') {
      this.scrollToBooking(this.bookingToScroll);
    }
    if (inputName == 'selectedGame' && this.selectedGame) {
      this.setSelectedFieldToSelectedGameSport();
    }
  }

  fbkOnDestroy() {
    this.eventsProvider.unsubscribeAllTopics(this);
  }

  buildHours(openingWindow) {
    this.hours = [];
    this.savedDate = this.date;
    const currentHour = new Date(openingWindow.start);
    const end = new Date(openingWindow.end);
    while (currentHour < end) {
      this.hours.push(currentHour.getHours().toString() + ':' + this.formatToDoubleDigits(currentHour.getMinutes()));
      currentHour.setHours(currentHour.getHours() + 1);
    }
  }

  formatToDoubleDigits(value) {
    return ('0' + value).slice(-2);
  }

  getBookingsAndBuildCalendarFields() {
    const openingWindow = getOpeningWindowOfDay(this.date, this.complex);
    const dateInRequest = new Date(this.date);
    dateInRequest.setHours(0);
    dateInRequest.setMinutes(0);
    this.bookingProvider.getBookingsOfDay(dateInRequest).subscribe({
      next: (response) => {
        const bookingsOfDate = getBookingsOfDate(response, this.complex, this.date);
        this.dayFields = [];
        this.complex.fields.forEach((field) => {
          if ((field.bookingSettings && field.bookingSettings.enable) ||
            (this.complex.bookingSettings && this.complex.bookingSettings.enable)) {
            const fieldBookings = getFieldBookings(bookingsOfDate, field);
            this.dayFields.push(new CalendarField(field, openingWindow, this.date, fieldBookings));
          }
        });
        this.sortFieldsByPosition();
        this.hasBuiltBookings = true;
        if (this.bookingToScroll) {
          this.scrollToBooking(this.bookingToScroll);
        }
        this.displayMenu.emit();
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_getting_bookings_of_day);
      },
    });
  }

  sortFieldsByPosition() {
    this.dayFields = this.dayFields.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  resetSelectedGame_() {
    this.resetSelectedGame.emit();
  }

  selectFieldIndex(fieldIndex: number) {
    this.mobileUI.selectedFieldIndex = fieldIndex;
  }

  goLeft() {
    const fieldsCtn = document.getElementById('fields-ctn');
    if (fieldsCtn.scrollLeft > 0) {
      if (fieldsCtn.scrollLeft - 150 < 0) {
        this.fieldsScrollValue = 0;
        this.canScrollLeft = false;
      } else {
        this.fieldsScrollValue = this.fieldsScrollValue - 150;
        if (this.fieldsScrollValue <= 0) {
          this.canScrollLeft = false;
        }
        this.canScrollRight = true;
      }
      fieldsCtn.scroll({
        left: this.fieldsScrollValue,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      this.canScrollLeft = false;
    }
  }

  goRight() {
    const fieldsCtn = document.getElementById('fields-ctn');
    const maxScrollLeft = fieldsCtn.scrollWidth - fieldsCtn.clientWidth;

    if (fieldsCtn.scrollLeft < maxScrollLeft) {
      if (fieldsCtn.scrollLeft > maxScrollLeft - 150) {
        this.fieldsScrollValue = this.fieldsScrollValue + (maxScrollLeft - this.fieldsScrollValue);
        this.canScrollRight = false;
      } else {
        this.fieldsScrollValue = this.fieldsScrollValue + 150;
        if (this.fieldsScrollValue >= maxScrollLeft) {
          this.canScrollRight = false;
        }
        this.canScrollLeft = true;
      }
      fieldsCtn.scroll({
        left: this.fieldsScrollValue,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      this.canScrollRight = false;
    }
  }

  private reloadBookings(notification: NotificationModel) {
    if (notification.payload.type === 'booking' && notification?.payload?.data?.booking) {
      const bookingDate = new BookingModel(notification.payload.data.booking).startAt;
      if (bookingDate.getDate() === this.date.getDate() &&
        bookingDate.getMonth() === this.date.getMonth() &&
        bookingDate.getFullYear() === this.date.getFullYear()) {
        this.getBookingsAndBuildCalendarFields();
      }
    }
  }


  scrollToBooking(booking: BookingModel) {
    if (!booking) {
      return;
    }
    if (window.innerWidth < 768) {
      this.scrollMobile(booking);
      return;
    }
    this.scrollDesktop(booking);
  }

  private scrollDesktop(booking: BookingModel) {
    setTimeout(() => {
      const myBooking = Array.from(document.getElementsByClassName(booking._id));
      if (myBooking.length >= 1) {
        const bookingDiv = myBooking[0] as HTMLElement;
        const verticalScroll = document.getElementById('dayFieldsVScroll');
        if (verticalScroll) {
          verticalScroll.scroll(0, bookingDiv.offsetTop - 100);
        }
        const horizontalScroll = document.getElementById('fields-ctn');
        if (horizontalScroll) {
          horizontalScroll.scroll(bookingDiv.offsetLeft - 200, 0);
        }
        for (const myBookingElement of myBooking) {
          const myBookingElementHTML = myBookingElement as HTMLElement;
          myBookingElementHTML.classList.add('blink');
          setTimeout(() => {
            myBookingElementHTML.classList.remove('blink');
            this.bookingToScroll = null;
          }, 7000);
        }
      }
    }, 1);
  }

  private scrollMobile(booking: BookingModel) {
    if (typeof booking.field === 'string') {
      this.mobileUI.selectedFieldIndex = this.dayFields.findIndex((dayField) => dayField._id === booking.field);
    } else {
      this.mobileUI.selectedFieldIndex = this.dayFields.findIndex((dayField) => dayField.name === (booking.field as FieldModel).name);
    }
    if (this.mobileUI.selectedFieldIndex >= 0) {
      setTimeout(() => {
        const myBooking = Array.from(document.getElementsByClassName(booking._id + 'mobile'));
        if (myBooking.length >= 1) {
          const bookingFirstDiv = myBooking[0] as HTMLElement;
          const verticalScroll = document.getElementById('dayFieldsVScroll');
          if (verticalScroll) {
            verticalScroll.scroll(0, bookingFirstDiv.offsetTop - 100);
          }
          for (const myBookingElement of myBooking) {
            const myBookingElementHTML = myBookingElement as HTMLElement;
            myBookingElementHTML.classList.add('blink');
            setTimeout(() => {
              myBookingElementHTML.classList.remove('blink');
              this.bookingToScroll = null;
            }, 7000);
          }
        }
        const bookingDiv = myBooking[0] as HTMLElement;
        if (bookingDiv) {
          const verticalScroll = document.getElementById('dayFieldsVScroll');
          if (verticalScroll) {
            verticalScroll.scroll(0, bookingDiv.offsetTop - 100);
          }
        }
      }, 1);
    }
  }

  isSameDay(newDate: Date) {
    return this.savedDate.getDate() !== newDate.getDate() ||
      this.savedDate.getMonth() !== newDate.getMonth() ||
      this.savedDate.getFullYear() !== newDate.getFullYear();
  }

  setSelectedFieldToSelectedGameSport() {
    if (this.dayFields[this.mobileUI.selectedFieldIndex].sport != this.selectedGame['game'].sport) {
      const firstFieldOfSelectedGameSport = this.dayFields.findIndex((field) => field.sport == this.selectedGame['game'].sport);
      this.mobileUI.selectedFieldIndex = firstFieldOfSelectedGameSport;
    }
  }
}
