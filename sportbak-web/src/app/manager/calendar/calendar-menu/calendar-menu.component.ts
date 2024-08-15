import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {Subject} from 'rxjs';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'calendar-menu',
  templateUrl: './calendar-menu.component.html',
  styleUrls: ['./calendar-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarMenuComponent extends FBKComponent {
  leagues: LeagueModel[];
  tournaments: TournamentModel[];
  hasLoadedCompetitions: boolean;
  mobileUI = {
    isMenuDisplayed: false,
    BOOKINGS: 'bookings',
    LEAGUES: 'leagues',
    TOURNAMENTS: 'tournaments',
    selectedMenuItem: '',
  };
  notifyDayFields = new Subject<void>();
  @Input() date;
  @Input() complex;
  @Input() upcomingBookings: BookingModel[] = [];
  @Input() isMobile: boolean = false;
  @Output() setDate = new EventEmitter();
  @Output() setGame = new EventEmitter();
  @Output() bookingModified = new EventEmitter<Date>();
  @Output() updateUpcomingBookings = new EventEmitter();
  @Output() closeMobileMonthMenu = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private bookingProvider: BookingService,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
  }

  removeFromUpcomingBookings(bookingToRemove: BookingModel) {
    this.bookingModified.emit(bookingToRemove.startAt);
    this.upcomingBookings = this.upcomingBookings.filter((booking) => booking._id != bookingToRemove._id);
  }

  updateDate(newDate) {
    this.setDate.emit(newDate);
  }

  loadCompetitions() {
    if (!this.hasLoadedCompetitions && this.managerProvider.getComplex()) {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      this.managerProvider.getCompetitionsWithUnbookedGames(this.managerProvider.getComplex()['_id'], date).subscribe({
        next: (response) => {
          this.initCompetitions(response);
          this.hasLoadedCompetitions = true;
        },
        error: (error) => showError(error, ApplicationErrorsIds.competitions.unable_to_get_competitions),
        complete: () => this.hasLoadedCompetitions = true,
      });
    }
  }

  initCompetitions(requestResponse) {
    this.leagues = [];
    this.tournaments = [];
    requestResponse.forEach((competition) => {
      const comp = new CompetitionModel(competition);
      if (comp.type === 'league') {
        this.leagues.push(comp.convertToLeague());
      } else if (comp.type === 'tournament') {
        this.tournaments.push(comp.convertToTournament());
      }
    });
  }

  updateGame(game) {
    this.setGame.emit(game);
    this.hideMobileMenu();
  }

  selectMenuItem(item: string) {
    this.mobileUI.isMenuDisplayed = true;
    this.mobileUI.selectedMenuItem = item;
    if (item !== this.mobileUI.BOOKINGS) {
      this.loadCompetitions();
    }
  }

  hideMobileMenu() {
    this.mobileUI.isMenuDisplayed = false;
  }

  setUpcomingBookings(bookingId) {
    this.updateUpcomingBookings.emit(bookingId);
  }

  closeMobileMonth() {
    this.closeMobileMonthMenu.emit();
  }
}
