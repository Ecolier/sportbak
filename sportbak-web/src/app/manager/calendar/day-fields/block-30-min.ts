import {BookingModel} from 'src/app/shared/models/booking.model';
import {convertToNoSecondNoMillisecondDate} from '../../shared/helpers/date.helper';

export class Block30Min {
  public isFirstBookingBlock: boolean = false;
  public booking: BookingModel;
  public startDate: Date;
  public endDate: Date;
  constructor(_startDate: Date, _endDate: Date) {
    this.startDate = convertToNoSecondNoMillisecondDate(_startDate);
    this.endDate = convertToNoSecondNoMillisecondDate(_endDate);
  }

  containsBooking(booking: BookingModel) {
    return this.startDate >= booking.startAt && this.endDate <= booking.endAt;
  }

  addBooking(booking: BookingModel) {
    this.booking = booking;
  }

  getName() {
    let name = '';
    if (this.booking.bookerFirstName) {
      name += this.booking.bookerFirstName;
    }
    if (this.booking.bookerLastName) {
      name += ' ' + this.booking.bookerLastName;
    }
    if (name.length == 0 && typeof this.booking.booker == 'object') {
      name = this.booking.booker.nickname;
    }
    return name;
  }

  getContact() {
    if (this.booking.bookerPhone) {
      return this.booking.bookerPhone;
    }
    if (this.booking.bookerEmail) {
      return this.booking.bookerEmail;
    }
  }

  getTime() {
    const date = new Date(this.booking.startAt);
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getCompetition() {
    let competition = null;
    if (this.booking.target && this.booking.target['competition']) {
      competition = this.booking.target['competition'];
    }
    return competition;
  }

  getDisplayStatus() {
    let status = 'accepted';
    if (this.booking.target && this.booking.target['competition']) {
      if (this.booking.target['competition']['type'] == 'league') {
        status = 'league';
      } else if (this.booking.target['competition']['type'] == 'tournament') {
        status = 'tournament';
      }
    } else {
      if (this.booking.isWaitingManagerValidation()) {
        status = 'waiting-manager';
      } else if (this.booking.isWaitingPlayerValidation()) {
        status = 'waiting-player';
      }
    }
    return status;
  }
}
