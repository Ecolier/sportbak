import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {DialogService} from 'src/app/shared/components/dialog/dialog.service';
import {BookingModel} from 'src/app/shared/models/booking.model';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {BookingModalComponent} from '../booking-modal/booking-modal.component';
import {Block30Min} from '../day-fields/block-30-min';
import {CalendarField} from '../day-fields/calendar-field';
import {getFormattedEndTimes, getFormattedStartTimes, getTwoDigitsMinutes} from '../helpers/booking.helper';


@Component({
  selector: 'day-field',
  templateUrl: './day-field.component.html',
  styleUrls: ['./day-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DayFieldComponent extends FBKComponent {
  isBookingModalVisible: boolean = false;
  isBookingModalCtnVisible: boolean = false;
  clickedBlock: Block30Min;
  convertedBlock: BookingModel;
  clickedStart: string;
  formattedStartTimes: string[] = [];
  formattedEndTimes: string[] = [];
  isRequestStatusVisible: boolean = false;
  requestStatusText: string;
  requestStatusErrorCode: number;
  isRequestSuccess: boolean;
  @Input() borderRight: boolean;
  @Input() fields: any[];
  @Input() dayField: CalendarField;
  @Input() complex: ComplexModel;
  @Input() selectedGame: any;
  @Input() isMobile: boolean = false;
  @Output() resetSelectedGame = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private dialogService: DialogService) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {}

  onBlockClick(block: Block30Min) {
    if (!this.selectedGame || (this.selectedGame && block && !block.booking && (this.selectedGame.game.sport === this.dayField.sport))) {
      this.toggleBookingModal(block);
    }
  }

  toggleBookingModal(block: Block30Min) {
    this.clickedBlock = block;
    this.clickedStart = this.clickedBlock.startDate.getHours() + ':' + getTwoDigitsMinutes(this.clickedBlock.startDate.getMinutes());
    this.formattedStartTimes = getFormattedStartTimes(this.dayField);
    this.formattedEndTimes = getFormattedEndTimes(this.dayField);

    const [dialogRef, bookingModalRef] = this.dialogService.open(BookingModalComponent, {
      clickedBlockStart: this.clickedBlock ? this.clickedBlock.startDate : '',
      selectedStart: this.clickedStart,
      formattedStartTimes: this.formattedStartTimes,
      formattedEndTimes: this.formattedEndTimes,
      fields: this.fields,
      dayField: this.dayField,
      complex: this.complex,
      selectedBooking: this.clickedBlock ? this.clickedBlock.booking : null,
      selectedGame: this.selectedGame,
    });

    bookingModalRef.instance.showRequestStatus.subscribe((event) => this.showRequestStatus(event));
    bookingModalRef.instance.resetSelectedGame.subscribe(() => this.resetSelectedGame_());
  }

  resetRequestStatus = () => {
    this.isRequestStatusVisible = false;
  };

  resetSelectedGame_ = () => {
    this.resetSelectedGame.emit();
  };

  showRequestStatus = (data) => {
    this.isRequestStatusVisible = true;
    this.requestStatusErrorCode = data.code;
    this.requestStatusText = data.text;
    this.isRequestSuccess = data.success;
  };
}
