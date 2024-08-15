import {Component, ElementRef, EventEmitter, Inject, Input, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {BookingService} from 'src/app/manager/shared/services/bookings.service';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {DialogService, FBK_DIALOG_DATA} from 'src/app/shared/components/dialog/dialog.service';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {Field} from 'src/app/shared/models/field.model';
import {UserModel} from 'src/app/shared/models/user/user.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {UserProvider} from 'src/app/shared/services/user.service';
import {FBKComponent} from '../../../shared/components/base.component';
import {SessionService} from '../../video/session.service';
import {CalendarField} from '../day-fields/calendar-field';
import {
  checkCanValidate,
  checkSelectedGame,
  generateAvailableEndTimes,
  generateEndTime,
  getBooker,
  getBookerComment,
  getComplex,
  getEndAt,
  getField,
  getId,
  getManagerComment,
  getStartAt,
  getStatus,
  getTarget,
  getTargetModel,
  initFields,
  initValuesFromBooking,
  resetFields,
} from './booking-modal-helper';
import {SBKEventsIds} from '../../../shared/values/events-ids';
import {SBKEventsProvider} from '../../../shared/services/events.provider';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

export interface BookingDialogParams {
  clickedBlockStart: Date,
  selectedStart: string,
  formattedStartTimes: string[],
  formattedEndTimes: string[],
  fields: Field[],
  dayField: CalendarField,
  complex: ComplexModel,
  selectedBooking: BookingModel,
  selectedGame: any,
  upcomingBookings: BookingModel[],
}

@Component({
  selector: 'booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookingModalComponent extends FBKComponent {
  MODE_BOOKING_CREATION = 'booking_creation';
  MODE_BOOKING_CREATED = 'booking_created';
  MODE_COMP_CREATION = 'competition_creation';
  MODE_COMP_CREATED = 'competition_created';
  MODE_WAITING_PLAYER = 'waiting_player';
  MODE_WAITING_MANAGER = 'waiting_manager';
  MODE_LOADING = 'loading';
  currentMode = '';
  availableEndTimes: string[] = [];
  selectedEnd: string;
  hasSetFields = false;
  selectedField: string;
  fieldsNames: string[];
  bookerEmail = '';
  bookerPhone = '';
  bookerLastName = '';
  bookerFirstName = '';
  managerInfo = '';
  isSearchingPlayer = false;
  bookerUser: UserModel;
  isCanceling = false;
  cancelMessage = '';
  mode = '';
  canValidate = false;
  hasDateChanged: boolean;
  buttonDecision: string;
  initSelectedStart: string;
  initSelectedEnd: string;
  date: string;
  @Input() selectedBooking: BookingModel;
  @Input() clickedBlockStart: Date;
  @Input() selectedStart: string;
  @Input() dayField: CalendarField;
  @Input() formattedStartTimes: string[];
  @Input() formattedEndTimes: string[];
  @Input() fields: any[];
  @Input() selectedGame: any;
  @Input() complex: ComplexModel;
  @Output() showRequestStatus = new EventEmitter();
  @Output() resetSelectedGame = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    public bookingProvider: BookingService,
    public managerProvider: ManagerProvider,
    private sessionService: SessionService,
    public userProvider: UserProvider,
    private eventsProvider: SBKEventsProvider,
    @Inject(FBK_DIALOG_DATA) private bookingDialogParams: BookingDialogParams,
    private dialogService: DialogService,
    public router: Router) {
    super(_refElement, translate, 'Calendar');
    Object.assign(this, bookingDialogParams);
  }

  fbkOnInit() {
    console.log(this.selectedStart);
    generateAvailableEndTimes(this);
    generateEndTime(this);
    checkCanValidate(this);
    this.checkMode();
    checkSelectedGame(this);
    this.setButtonDecision();
    if (!this.hasSetFields) {
      initFields(this);
      this.hasSetFields = true;
    }
    this.selectedField = this.dayField.name;
    if (this.selectedBooking) {
      initValuesFromBooking(this);
    }
    this.initSelectedStart = this.selectedStart;
    this.initSelectedEnd = this.selectedEnd;
    this.date = this.dayField.date.toLocaleString(undefined, {weekday: 'long', day: '2-digit', month: 'long'});
  }

  startSession() {
    this.sessionService.start(this.dayField._id);
  }

  checkMode() {
    if (!this.selectedBooking && !this.selectedGame) {
      this.currentMode = this.MODE_BOOKING_CREATION;
    } else if (this.selectedBooking && this.selectedBooking.isWaitingManagerValidation()) {
      this.currentMode = this.MODE_WAITING_MANAGER;
    } else if (this.currentMode !== this.MODE_WAITING_MANAGER && this.selectedBooking && this.selectedBooking.isWaitingPlayerValidation()) {
      this.currentMode = this.MODE_WAITING_PLAYER;
    } else if (this.selectedBooking && this.isCompetitionBooking()) {
      this.currentMode = this.MODE_COMP_CREATED;
    } else if (this.selectedBooking && !this.isCompetitionBooking()) {
      this.currentMode = this.MODE_BOOKING_CREATED;
    } else if (this.selectedGame) {
      this.currentMode = this.MODE_COMP_CREATION;
    }
  }

  isCompetitionBooking() {
    return this.selectedBooking.target && this.selectedBooking.target.competition && (this.selectedBooking.target.teams.length > 0);
  }

  setClickedBlockStart(value) {
    this.hasDateChanged = true;
    this.selectedStart = value;
    this.setButtonDecision();
    generateAvailableEndTimes(this);
    generateEndTime(this);
  }

  setSelectedEnd(value) {
    this.hasDateChanged = true;
    this.selectedEnd = value;
  }

  setSelectedField(value) {
    this.selectedField = value;
  }

  setBookerEmail(value) {
    this.bookerEmail = value;
    checkCanValidate(this);
  }

  setBookerPhone(value) {
    this.bookerPhone = value;
    checkCanValidate(this);
  }

  setBookerLastName(value) {
    this.bookerLastName = value;
    checkCanValidate(this);
  }

  setBookerFirstName(value) {
    this.bookerFirstName = value;
    checkCanValidate(this);
  }

  setManagerInfo(value) {
    this.managerInfo = value;
    checkCanValidate(this);
  }

  setCancelMessage(value) {
    this.cancelMessage = value;
  }

  selectBooker(booker) {
    this.bookerUser = new UserModel({...booker.user});

    if (this.bookerUser.email) {
      this.bookerEmail = this.bookerUser.email;
    }
    if (this.bookerUser.numPhone) {
      this.bookerPhone = this.bookerUser.numPhone;
    }
    if (this.bookerUser.lastname) {
      this.bookerLastName = this.bookerUser.lastname;
    }
    if (this.bookerUser.firstname) {
      this.bookerFirstName = this.bookerUser.firstname;
    }
    checkCanValidate(this);
  }

  removeUser() {
    this.bookerUser = null;
  }

  showCancelBooking() {
    this.isCanceling = true;
  }

  hideCancelBooking() {
    this.isCanceling = false;
  }

  validate() {
    const bookingData = {
      _id: getId(this),
      startAt: getStartAt(this),
      endAt: getEndAt(this),
      status: getStatus(this),
      complex: getComplex(this),
      field: getField(this),
      booker: getBooker(this),
      bookerFirstName: this.bookerFirstName,
      bookerLastName: this.bookerLastName,
      bookerPhone: this.bookerPhone,
      bookerEmail: this.bookerEmail,
      bookerComment: getBookerComment(this),
      managerInfo: this.managerInfo,
      managerComment: getManagerComment(this),
      target: getTarget(this),
      targetModel: getTargetModel(this),
    };
    if (this.selectedBooking) {
      this.patchBooking(bookingData);
    } else {
      this.postNewBooking(bookingData);
    }
  }

  updateSelectedGame(booking: BookingModel) {
    if (this.selectedGame) {
      this.selectedGame.game.booking = booking;
      booking.createTarget(this.selectedGame);
    }
  }

  postNewBooking(bookingData) {
    this.currentMode = this.MODE_LOADING;
    this.bookingProvider.postNewBooking(bookingData).subscribe({
      next: (response) => {
        const result = new BookingModel(response['result']);
        this.dayField.addBooking(result);
        this.updateSelectedGame(result);
        this.showRequestStatus.emit({text: this.getTranslation('booking_successful'), success: true});
        this.resetBookingModal();
        this.eventsProvider.publish(SBKEventsIds.upcomingBookingChanged);
      }, error: (error) => {
        this.showRequestStatus.emit({text: this.getTranslation('booking_failure'), success: false, code: error.error.code});
        this.resetBookingModal();
      },
    });
  }

  patchBooking(bookingData) {
    this.currentMode = this.MODE_LOADING;
    this.bookingProvider.updateBooking(bookingData).subscribe({
      next: (response) => {
        const result = new BookingModel(response['result']);
        this.dayField.updateBooking(result, true);
        this.eventsProvider.publish(SBKEventsIds.upcomingBookingChanged);
        this.resetBookingModal();
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.bookings.error_updating_booking);
        this.showRequestStatus.emit({text: this.getTranslation('booking_failure'), success: false, code: error.error.code});
        this.resetBookingModal();
      },
    });
  }

  cancelBooking() {
    if (this.selectedBooking) {
      const bookingData = {
        _id: this.selectedBooking._id,
        managerComment: this.cancelMessage,
      };
      this.bookingProvider.deleteBooking(bookingData).subscribe({
        next: (response) => {
          this.dayField.deleteBooking(this.selectedBooking._id);
          this.resetBookingModal();
          resetFields(this);
          this.showRequestStatus.emit({text: this.getTranslation('booking_canceled'), success: true});
        },
        error: (error) => {
          showError(error, ApplicationErrorsIds.bookings.error_deleting_booking);
          this.resetBookingModal();
          this.showRequestStatus.emit({text: this.getTranslation('booking_failure'), success: false, code: error.error.code});
        },
      });
    } else {
      this.resetBookingModal();
    }
  }

  resetBookingModal() {
    this.resetSelectedGame.emit();
    setTimeout(() => {
      this.onClose();
    }, 0);
  }

  onClose() {
    this.dialogService.close();
    resetFields(this);
  }

  onRequestResult(data) {
    this.showRequestStatus.emit(data);
  }

  toGameSheet() {
    this.dialogService.close();
    if (this.selectedBooking.target && this.selectedBooking.target._id) {
      this.router.navigate(['/manager/game-sheet'],
          {
            queryParams: {
              game_id: this.selectedBooking.target._id,
              booking_id: this.selectedBooking._id,
              field_id: this.selectedBooking.field,
            },
          });
    } else {
      this.router.navigate(['/manager/game-sheet'],
          {queryParams: {booking_id: this.selectedBooking._id}});
    }
  }

  setButtonDecision() {
    if (this.hasDateChanged && (this.selectedStart !== this.initSelectedStart || this.selectedEnd !== this.initSelectedEnd)) {
      this.buttonDecision = this.getTranslation('modify');
    } else {
      this.buttonDecision = this.getTranslation('accept');
    }
  }
}
