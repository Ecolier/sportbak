import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {NotificationModel} from '../../shared/models/notification/notification.model';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';
import {getDaysInMonth} from '../helpers/booking.helper';


@Component({
  selector: 'calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarDayComponent extends FBKComponent {
  isHidden: boolean = false;
  checkedDateAfterUrlChange: boolean = false;
  date: Date;
  complex: ComplexModel;
  isGamesMenuVisible: boolean = false;
  isLeagueSelectedInGamesMenu: boolean;
  selectedGame: any;
  canDisplayMenu: boolean = false;
  hasLoadedHome: boolean = false;
  upcomingBookings: BookingModel[] = [];
  mobileUI = {
    isMonthDisplayed: false,
  };
  bookingToScroll: BookingModel;
  openingDays = [];
  openingDaysInMonth = [];
  daysToOpen: number;

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
    const navigation = this._router.getCurrentNavigation();
    this.bookingToScroll = navigation?.extras?.state?.booking;
  }

  fbkOnInit() {
    this.eventProvider.subscribe(this, SBKEventsIds.notifications, (notifications: NotificationModel) => this.reloadData(notifications));
    this.eventProvider.subscribe(this, SBKEventsIds.gotoBooking, (booking: BookingModel) => this.setBookingToScroll(booking));
    this.eventProvider.subscribe(this, SBKEventsIds.upcomingBookingChanged, () => this.getUpcomingBookings());
    this.date = new Date();
    this.checkCalendar();
    this.initOpeningDays();
    
  }

  fbkOnDestroy() {
    this.eventProvider.unsubscribeAllTopics(this);
  }

  checkDate() {
    if (this.hasDateChanged()) {
      this.date = this.getUrlDate();
    }
  }

  checkCalendar() {
    this.complex = this.managerProvider.getComplex();
    if (!this.complex?.bookingSettings?.enable) {
      this.isHidden = true;
    }
    this.hasLoadedHome = true;
    this.checkSelectedGame();
    this.getUpcomingBookings();
    this.checkDate();
  }

  checkIsSportbak() {
    if (this.managerProvider.getComplex()._id !== '5ccb06fd8a7d511586616271') {
      this.isHidden = true;
    }
  }

  checkSelectedGame() {
    if (this.activatedRoute.snapshot.queryParams['game_id'] &&
      this.activatedRoute.snapshot.queryParams['comp_name'] &&
      this.activatedRoute.snapshot.queryParams['comp_type']) {
      this.managerProvider.getGameById(this.activatedRoute.snapshot.queryParams['game_id']).subscribe({
        next: (response) => {
          const game = new GameModel(response);
          this.setGame({
            game,
            competition: this.activatedRoute.snapshot.queryParams['comp_name'],
            type: this.activatedRoute.snapshot.queryParams['comp_type'],
          });
        },
        error: (error) => showError(error, ApplicationErrorsIds.games.error_getting_game),
      });
    }
  }

  getUrlDate() {
    return new Date(this.activatedRoute.snapshot.queryParams['date']);
  }

  getUpcomingBookings() {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    this.bookingProvider.getUpcomingBookings(new Date(), endDate).subscribe({
      next: (response) => {
        this.setUpcomingBookings(response);
      },
      error: (error) => showError(error, ApplicationErrorsIds.bookings.error_getting_upcoming_bookings),
    });
  }

  setUpcomingBookings(bookings) {
    this.upcomingBookings = [];
    bookings.forEach((booking) => {
      this.upcomingBookings.push(new BookingModel(booking));
    });
    this.upcomingBookings = this.upcomingBookings.sort((a, b) => {
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });
  }

  hasDateChanged(date: Date = null) {
    if (this.activatedRoute.snapshot.queryParams['date']) {
      const newDate = this.getUrlDate();
      return this.isDateDifferent(newDate);
    }
    if (date) {
      return this.isDateDifferent(date);
    }
    return false;
  }

  isDateDifferent(newDate: Date) {
    return this.date.getDate() !== newDate.getDate() ||
      this.date.getMonth() !== newDate.getMonth() ||
      this.date.getFullYear() !== newDate.getFullYear();
  }

  setGame(gameInfo) {
    this.selectedGame = gameInfo;
    this.mobileUI.isMonthDisplayed = false;
  }

  resetSelectedGame() {
    this.selectedGame = null;
  }

  displayMenu() {
    this.canDisplayMenu = true;
  }

  setDate(newDate: Date) {
    if (newDate && this.daysToOpen >= 0 && this.daysToOpen <= this.openingDaysInMonth.length) {
      this.date = newDate;
    }
    this.mobileUI.isMonthDisplayed = false;
  }

  setDaysToOpen(daysToOpen){
    this.daysToOpen = daysToOpen
    let month = this.date.getMonth();
    let year = this.date.getFullYear();
    if (daysToOpen < 0) {
      if (month == 0) {
        year--
        month = 11
      }else{
        month--
      }
      this.setOpeningDays({days :getDaysInMonth(month, year), setDate: false})
      this.daysToOpen = this.openingDaysInMonth.length-1
      this.date = this.openingDaysInMonth[this.daysToOpen]
    }else if (daysToOpen > this.openingDaysInMonth.length-1) {
      if (month == 11) {
        year++
        month = 0
      }else{
        month++
      }
      this.setOpeningDays({days :getDaysInMonth(month, year), setDate: false})
        this.daysToOpen = 0
        this.date = this.openingDaysInMonth[this.daysToOpen]
    }
  }

  setOpeningDays(daysInMonth){
    this.openingDaysInMonth = []
    if (daysInMonth.days) {
      let opening = []
      for (let index = 0; index < this.openingDays.length; index++) {
        if (this.openingDays[index].length > 0) {
          opening.push(this.openingDays[index][0].subtype)
        }
      }
      
      for (let day = 0; day < daysInMonth.days.length; day++) {
        let stringDay = daysInMonth.days[day].toLocaleString('en-us', {  weekday: 'long' }).toLowerCase()
        if (opening.includes(stringDay)) {
          
          this.openingDaysInMonth.push(daysInMonth.days[day])
        }
      }
      if (daysInMonth.setDate) {
        this.setOpeningDate()
      }
    }
  }

  setOpeningDate(){
    this.daysToOpen = 0;
    while(this.openingDaysInMonth[this.daysToOpen].getDate() < this.date.getDate()){
      this.daysToOpen++;
    }
    if (this.daysToOpen > 0) {
      this.date = this.openingDaysInMonth[this.daysToOpen]
    }
  }

  toggleMobileMonthDisplay() {
    this.mobileUI.isMonthDisplayed = !this.mobileUI.isMonthDisplayed;
  }

  closeMobileMonth() {
    this.mobileUI.isMonthDisplayed = false;
  }

  updateUpcomingBookings(bookingId) {
    this.upcomingBookings = this.upcomingBookings.filter((booking) => booking._id !== bookingId);
  }

  notifyDayFields1(date: Date) {
    if (date.getDate() === this.date.getDate() &&
      date.getMonth() === this.date.getMonth() &&
      date.getFullYear() === this.date.getFullYear()) {
      this.eventProvider.publish(SBKEventsIds.upcomingBookingChanged);
    }
  }

  private reloadData(notification: NotificationModel) {
    if (notification.payload.type === 'booking') {
      this.getUpcomingBookings();
    }
  }

  setBookingToScroll(booking: BookingModel) {
    this.setDate(booking.startAt);
    this.bookingToScroll = booking;
  }

  initOpeningDays() {
    if(this.complex.opening && this.complex.opening.length > 0){
      const openings = this.complex.opening;
      this.openingDays.push(openings.filter(day => day.subtype == "monday"));
      this.openingDays.push(openings.filter(day => day.subtype == "tuesday"));
      this.openingDays.push(openings.filter(day => day.subtype == "wednesday"));
      this.openingDays.push(openings.filter(day => day.subtype == "thursday"));
      this.openingDays.push(openings.filter(day => day.subtype == "friday"));
      this.openingDays.push(openings.filter(day => day.subtype == "saturday"));
      this.openingDays.push(openings.filter(day => day.subtype == "sunday"));
    }
    
  }
}
