import {BookingModel} from 'src/app/shared/models/booking.model';
import {BookingSettingsModel} from 'src/app/shared/models/complex/booking-settings.model';
import {convertToNoSecondNoMillisecondDate} from '../../shared/helpers/date.helper';
import {Block30Min} from './block-30-min';

export class CalendarField {
  public name: string;
  public sport: string;
  public _id: string
  public timeBlocks: Block30Min[] = [];
  public startDate: Date;
  public endDate: Date;
  public date: Date;
  public position: number;
  public bookings: BookingModel[] = [];
  public bookingSettings:BookingSettingsModel;
  constructor(fieldObj, openingWindow, date: Date, fieldBookings: any[]) {
    this.sport = fieldObj.sport;
    this.name = fieldObj.name;
    this._id = fieldObj._id;
    this.date = date;
    this.position = fieldObj.position;
    this.bookingSettings = new BookingSettingsModel(fieldObj.bookingSettings);
    this.setStartAndEndDates(new Date(openingWindow.start), new Date(openingWindow.end));
    this.buildFieldBookings(fieldBookings);
    this.refreshTimeBlocks();
  }

  setStartAndEndDates(startDate: Date, endDate: Date) {
    this.startDate = convertToNoSecondNoMillisecondDate(new Date(this.date));
    this.startDate.setHours(startDate.getHours());
    this.startDate.setMinutes(startDate.getMinutes());
    this.endDate = convertToNoSecondNoMillisecondDate(new Date(this.date));
    this.endDate.setHours(endDate.getHours());
    this.endDate.setMinutes(endDate.getMinutes());
    this.endDate.setDate(this.endDate.getDate() + (endDate.getDate() - startDate.getDate()));
  }

  buildFieldBookings(fieldBookings: any[]) {
    fieldBookings.forEach((booking) => {
      this.bookings.push(new BookingModel(booking));
    });
  }

  buildTimeBlocks() {
    let blockStart = convertToNoSecondNoMillisecondDate(new Date(this.startDate));
    let blockEnd = convertToNoSecondNoMillisecondDate(new Date(this.startDate.getTime() + 30 * 60000));
    while (blockStart < this.endDate) {
      this.timeBlocks.push(new Block30Min(blockStart, blockEnd));
      blockStart = convertToNoSecondNoMillisecondDate(new Date(blockStart.getTime() + 30 * 60000));
      blockEnd = convertToNoSecondNoMillisecondDate(new Date(blockEnd.getTime() + 30 * 60000));
    }
  }

  putBookingsInBlocks() {
    let isFirstBookingBlock = true;
    this.bookings.forEach((booking) => {
      this.timeBlocks.forEach((block) => {
        if (block.containsBooking(booking)) {
          block.addBooking(booking);
          if (isFirstBookingBlock) {
            block.isFirstBookingBlock = true;
            isFirstBookingBlock = false;
          }
        } else {
          isFirstBookingBlock = true;
        }
      });
    });
  }

  addBooking(booking: BookingModel) {
    this.bookings.push(booking);
    this.putBookingsInBlocks();
  }

  updateBooking(booking: BookingModel, hasParent: boolean = false) {
    let bookingIndex = 0;
    if (hasParent) {
      bookingIndex = this.bookings.findIndex((currentBooking) => currentBooking._id == booking['parent']);
    } else {
      bookingIndex = this.bookings.findIndex((currentBooking) => currentBooking._id == booking._id);
    }
    this.bookings = [...this.bookings.slice(0, bookingIndex), new BookingModel(booking), ...this.bookings.slice(bookingIndex + 1, this.bookings.length)];
    this.refreshTimeBlocks();
  }

  deleteBooking(bookingId: string) {
    this.bookings = this.bookings.filter((booking) => booking._id != bookingId);
    this.refreshTimeBlocks();
  }

  resetBookingBlocks() {
    this.timeBlocks = [];
  }

  refreshTimeBlocks() {
    this.resetBookingBlocks();
    this.buildTimeBlocks();
    this.putBookingsInBlocks();
  }

  getSportIcon() {
    return './assets/img/icons/' + this.sport + 'ball.svg';
  }
}
