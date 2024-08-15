import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {ManagerPageComponent} from '../../shared/components/manager-page.component';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {NotificationModel} from '../../shared/models/notification/notification.model';
import {Day} from '../helpers/day.helper';
import {getDaysInMonth} from '../helpers/booking.helper';


@Component({
  selector: 'calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarMonthComponent extends FBKComponent {
  currentDate: Date;
  currentMonth: number;
  monthName: string;
  days: Day[] = [];
  isLoading: boolean = true;
  clickedPreviousMonth: boolean = false;
  clickedNextMonth: boolean = false;
  errorOccurred: boolean = false;
  hasInitialializedBookings: boolean = false;
  @Input() date: Date;
  @Input() openingDays
  @Input() hasLoadedHome: boolean = false;
  @Output() setDate = new EventEmitter();
  @Output() daysInMonth = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
    private bookingProvider: BookingService,
    private eventProvider: SBKEventsProvider,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('calendar');
  }

  fbkOnInit() {
    if (this.activatedRoute.snapshot.queryParams['date']) {
      this.currentDate = new Date(this.activatedRoute.snapshot.queryParams['date']);
      this.currentMonth = this.currentDate.getMonth();
    } else {
      this.currentDate = new Date();
      this.currentMonth = this.currentDate.getMonth();
    }
    this.monthName = this.currentDate.toLocaleString('default', {month: 'long'});
    this.initializeDays();
    this.daysInMonth.emit({days :getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()), setDate: true})
    this.eventProvider.subscribe(this, SBKEventsIds.notifications, (notification: NotificationModel) => this.reloadData(notification));
  }

  fbkInputChanged() {
    if (this.hasLoadedHome && !this.hasInitialializedBookings) {
      this.initializeDaysBookings();
    }
    if (this.date) {
      while (this.date.getMonth() !== this.currentDate.getMonth() ||
      this.date.getFullYear() !== this.currentDate.getFullYear()) {
        this.checkDateChange();
      }
    }
  }
  
  fbkOnDestroy() {
    this.eventProvider.unsubscribeAllTopics(this);
  }
  
  checkDateChange() {
    if (this.date > this.currentDate) {
      this.toNextMonth();
    } else if (this.date < this.currentDate) {
      this.toPreviousMonth();
    }
  }

  incrementCurrentMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
    } else {
      this.currentMonth = this.currentMonth + 1;
    }
  }

  decrementCurrentMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
    } else {
      this.currentMonth = this.currentMonth - 1;
    }
  }

  initializeDays() {
    this.errorOccurred = false;
    const days = getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
    this.days = days.map((day) => new Day(day));
    this.currentDate.setDate(1);
    this.isLoading = true;
  }

  initializeDaysBookings() {
    this.bookingProvider.getMonthBookings(this.currentDate).subscribe((response) => {
      const bookingCategories = response['details'].map((data) => data.data).map((data) => data[this.managerProvider.getComplex()['_id']]['count']);
      for (let index = 0; index < this.days.length; index++) {
        if (bookingCategories[index]) {
          this.days[index].setValidatedBookings(bookingCategories[index]['acceptedByManager']);
          this.days[index].setWaitingForManagerBookings(bookingCategories[index]['waitingManager']);
          this.days[index].setWaitingForPlayerBookings(bookingCategories[index]['waitingBooker']);
        }
      }
      this.isLoading = false;
      this.hasInitialializedBookings = true;
    }, (error) => {
      this.isLoading = false;
      this.errorOccurred = true;
    });
  }

  toPreviousMonth() {
    this.decrementCurrentMonth();
    this.triggerPrevMonthAnim();
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.monthName = this.currentDate.toLocaleString('default', {month: 'long'});
    this.initializeDays();
    this.initializeDaysBookings();
    this.daysInMonth.emit({days :getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()), setDate: false})
  }

  toNextMonth() {
    this.incrementCurrentMonth();
    this.triggerNextMonthAnim();
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.monthName = this.currentDate.toLocaleString('default', {month: 'long'});
    this.initializeDays();
    this.initializeDaysBookings();
    this.daysInMonth.emit({days :getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()), setDate: false})
  }

  selectDay(selectedDate) {
    this.setDate.emit(selectedDate);
    this.daysInMonth.emit({days :getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear()), setDate: true});
  }

  triggerPrevMonthAnim() {
    this.clickedPreviousMonth = true;
    setTimeout(() => {
      this.clickedPreviousMonth = false;
    }, 600);
  }

  triggerNextMonthAnim() {
    this.clickedNextMonth = true;
    setTimeout(() => {
      this.clickedNextMonth = false;
    }, 600);
  }

  private reloadData(notification: NotificationModel) {
    if (notification.payload.type === 'booking') {
      this.initializeDaysBookings();
    }
  }
}
