import {UserModel} from 'src/app/shared/models/user/user.model';
import {BookingService} from '../../shared/services/bookings.service';
import {BookingModalComponent} from './booking-modal.component';

export const generateAvailableEndTimes = (bookingModalRef: BookingModalComponent) => {
  bookingModalRef.availableEndTimes = [];
  const startTimeIndex = bookingModalRef.formattedStartTimes.findIndex((time) => time == bookingModalRef.selectedStart);
  for (let index = startTimeIndex; index < bookingModalRef.formattedEndTimes.length; index++) {
    bookingModalRef.availableEndTimes.push(bookingModalRef.formattedEndTimes[index]);
  }
};

export const generateEndTime = (bookingModalRef: BookingModalComponent) => {
  const startTimeIndex = bookingModalRef.formattedStartTimes.findIndex((time) => time == bookingModalRef.selectedStart);
  if (startTimeIndex < bookingModalRef.formattedStartTimes.length - 1) {
    bookingModalRef.selectedEnd = bookingModalRef.formattedEndTimes[startTimeIndex + 1];
  } else {
    bookingModalRef.selectedEnd = bookingModalRef.formattedEndTimes[bookingModalRef.formattedEndTimes.length - 1];
  }
};

export const checkCanValidate = (bookingModalRef: BookingModalComponent) => {
  bookingModalRef.canValidate = false;
  if (bookingModalRef.selectedBooking) {
    bookingModalRef.canValidate = true;
  } else {
    if (bookingModalRef.bookerEmail.length > 0 || bookingModalRef.bookerPhone.length > 0 || bookingModalRef.bookerLastName.length > 0 || bookingModalRef.bookerFirstName.length > 0) {
      bookingModalRef.canValidate = true;
    } else if (bookingModalRef.selectedGame) {
      bookingModalRef.canValidate = true;
    }
  }
};

export const checkSelectedGame = (bookingModalRef: BookingModalComponent) => {
  checkCanValidate(bookingModalRef);
};

export const initFields = (bookingModalRef: BookingModalComponent) => {
  if (bookingModalRef.fields && bookingModalRef.fields[0]) {
    bookingModalRef.fieldsNames = bookingModalRef.fields.map((field) => field.name);
  }
};

export const initValuesFromBooking = (bookingModalRef: BookingModalComponent) => {
  bookingModalRef.bookerEmail = bookingModalRef.selectedBooking.bookerEmail;
  bookingModalRef.bookerPhone = bookingModalRef.selectedBooking.bookerPhone;
  bookingModalRef.bookerLastName = bookingModalRef.selectedBooking.bookerLastName;
  bookingModalRef.bookerFirstName = bookingModalRef.selectedBooking.bookerFirstName;
  bookingModalRef.managerInfo = bookingModalRef.selectedBooking.bookerFirstName;
  const start = new Date(bookingModalRef.selectedBooking.startAt);
  bookingModalRef.selectedStart = start.getHours() + ':' + getTwoDigitsMinutes(start.getMinutes());
  const end = new Date(bookingModalRef.selectedBooking.endAt);
  bookingModalRef.selectedEnd = end.getHours() + ':' + getTwoDigitsMinutes(end.getMinutes());
  initBookerUser(bookingModalRef);
};

export const getTwoDigitsMinutes = (minutes) => {
  if (minutes == 0) {
    return '00';
  }
  return minutes;
};

export const initBookerUser = (bookingModalRef: BookingModalComponent) => {
  if (bookingModalRef.selectedBooking.booker) {
    bookingModalRef.bookerUser = new UserModel(bookingModalRef.selectedBooking.booker);
  }
};


export const getStartAt = (bookingModalRef: BookingModalComponent) => {
  const newStartAt = bookingModalRef.clickedBlockStart;
  const selectedStartValues = bookingModalRef.selectedStart.split(':');
  const hours = selectedStartValues[0];
  const minutes = selectedStartValues[1];
  newStartAt.setHours(parseInt(hours));
  newStartAt.setMinutes(parseInt(minutes));
  newStartAt.setSeconds(0);
  newStartAt.setMilliseconds(0);
  return newStartAt;
};

export const getEndAt = (bookingModalRef: BookingModalComponent) => {
  let newEndAt = new Date(bookingModalRef.clickedBlockStart);
  const startDate = new Date(0);
  const endDate = new Date(0);
  const selectedStartValues = bookingModalRef.selectedStart.split(':');
  startDate.setHours(Number(selectedStartValues[0]));
  startDate.setMinutes(Number(selectedStartValues[1]));
  const selectedEndValues = bookingModalRef.selectedEnd.split(':');
  const hours = Number(selectedEndValues[0]);
  const minutes = Number(selectedEndValues[1]);
  endDate.setHours(hours);
  endDate.setMinutes(minutes);
  if (endDate < startDate) {
    newEndAt = new Date(newEndAt.getTime() + 24 * 60 * 60 * 1000);
  }
  newEndAt.setHours(hours);
  newEndAt.setMinutes(minutes);
  newEndAt.setMilliseconds(0);
  newEndAt.setSeconds(0);
  return newEndAt;
};

export const getId = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking._id : null;
};
export const getStatus = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.status : 'accepted';
};
export const getComplex = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.complex : bookingModalRef.complex._id;
};
export const getField = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.field : bookingModalRef.fields.find((field) => field.name == bookingModalRef.selectedField)._id;
};
export const getBooker = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.bookerUser ? bookingModalRef.bookerUser._id : bookingModalRef.managerProvider.getUser()['_id'];
};
export const getBookerComment = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.bookerComment : null;
};
export const getManagerComment = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.managerComment : null;
};

export const getTarget = (bookingModalRef: BookingModalComponent) => {
  let target = null;
  if (bookingModalRef.selectedGame) {
    target = bookingModalRef.selectedGame.game._id;
  } else if (bookingModalRef.selectedBooking && bookingModalRef.selectedBooking.target) {
    if (bookingModalRef.selectedBooking.target['_id']) {
      target = bookingModalRef.selectedBooking.target['_id'];
    } else {
      target = bookingModalRef.selectedBooking.target;
    }
  }
  return target;
};

export const getTargetModel = (bookingModalRef: BookingModalComponent) => {
  return bookingModalRef.selectedBooking ? bookingModalRef.selectedBooking.targetModel : 'Game';
};

export const resetFields = (bookingModalRef: BookingModalComponent) => {
  bookingModalRef.bookerEmail = '';
  bookingModalRef.bookerPhone = '';
  bookingModalRef.bookerLastName = '';
  bookingModalRef.bookerFirstName = '';
  bookingModalRef.isCanceling = false;
  bookingModalRef.bookerUser = undefined;
  bookingModalRef.hasDateChanged = false;
};
