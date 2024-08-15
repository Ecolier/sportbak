import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {SessionModule} from '../video/session.module';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {BlockThirtyMinComponent} from './block-thirty-min/block-thirty-min.component';
import {BookingDecisionMakerComponent} from './booking-decision-maker/booking-decision-maker.component';
import {BookingModalComponent} from './booking-modal/booking-modal.component';
import {CalendarDayComponent} from './calendar-day/calendar-day.component';
import {CalendarGameComponent} from './calendar-game/calendar-game.component';
import {CalendarLeagueComponent} from './calendar-league/calendar-league.component';
import {CalendarMenuComponent} from './calendar-menu/calendar-menu.component';
import {CalendarMonthComponent} from './calendar-month/calendar-month.component';
import {CalendarRoutingModule} from './calendar-routing.module';
import {CalendarTournamentComponent} from './calendar-tournament/calendar-tournament.component';
import {CalendarUpcomingBookingComponent} from './calendar-upcoming-booking/calendar-upcoming-booking.component';
import {DayFieldComponent} from './day-field/day-field.component';
import {DayFieldsComponent} from './day-fields/day-fields.component';
import {DayPickerComponent} from './day-picker/day-picker.component';
import {DayComponent} from './day/day.component';
import {DaysSelectorComponent} from './days-selector/days-selector.component';
import {MenuSectionComponent} from './menu-section/menu-section.component';
import {MonthSelectorComponent} from './month-selector/month-selector.component';
import {RequestStatusComponent} from './request-status/request-status.component';
import {SelectedGameComponent} from './selected-game/selected-game.component';

@NgModule({
  imports: [
    CalendarRoutingModule,
    ManagerSharedModule,
    SessionModule,
    SharedModule,
  ],
  declarations: [
    BookingModalComponent,
    BlockThirtyMinComponent,
    BookingDecisionMakerComponent,
    CalendarDayComponent,
    CalendarGameComponent,
    CalendarLeagueComponent,
    CalendarMenuComponent,
    CalendarMonthComponent,
    CalendarTournamentComponent,
    DayFieldComponent,
    DayFieldsComponent,
    DayPickerComponent,
    DaysSelectorComponent,
    DayComponent,
    MenuSectionComponent,
    MonthSelectorComponent,
    SelectedGameComponent,
    CalendarUpcomingBookingComponent,
  ],
  exports: [
    SessionModule,
    ManagerSharedModule,
    DayComponent,
    BookingModalComponent,
    BlockThirtyMinComponent,
    BookingDecisionMakerComponent,
    CalendarDayComponent,
    CalendarGameComponent,
    CalendarLeagueComponent,
    CalendarMenuComponent,
    CalendarMonthComponent,
    CalendarTournamentComponent,
    DayFieldComponent,
    DayFieldsComponent,
    DayPickerComponent,
    DaysSelectorComponent,
    MenuSectionComponent,
    MonthSelectorComponent,
    SelectedGameComponent,
    CalendarUpcomingBookingComponent,
  ],
})
export class CalendarModule {}
