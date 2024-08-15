import {CalendarField} from '../day-fields/calendar-field';

export const getFormattedStartTimes = (dayfield:CalendarField) => {
  return dayfield.timeBlocks.map((block) => block.startDate.getHours() + ':' + getTwoDigitsMinutes(block.startDate.getMinutes()));
};

export const getFormattedEndTimes = (dayfield:CalendarField) => {
  return dayfield.timeBlocks.map((block) => block.endDate.getHours() + ':' + getTwoDigitsMinutes(block.endDate.getMinutes()));
};

export const getTwoDigitsMinutes = (minutes) => {
  if (minutes == 0) {
    return '00';
  }
  return minutes;
};

export const getOpeningWindowOfDay = (date: Date, complex) => {
  const dayOfWeek = date.getDay();
  let openingWindowOfDay;
  if (dayOfWeek == 0) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'sunday'));
  } else if (dayOfWeek == 1) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'monday'));
  } else if (dayOfWeek == 2) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'tuesday'));
  } else if (dayOfWeek == 3) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'wednesday'));
  } else if (dayOfWeek == 4) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'thursday'));
  } else if (dayOfWeek == 5) {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'friday'));
  } else {
    openingWindowOfDay = getFormattedOpening(complex.opening.filter((opening) => opening.subtype == 'saturday'));
  }

  return {start: openingWindowOfDay.start, end: openingWindowOfDay.end};
};

export const getFormattedOpening = (openings) => {
  let currentStart = new Date(openings[0].start);
  let currentEnd = new Date(openings[0].end);

  if (openings.length > 1) {
    for (let index = 1; index < openings.length; index++) {
      const start = new Date(openings[index].start);
      const end = new Date(openings[index].end);

      if (start < currentStart) {
        currentStart = start;
      }
      if (end > currentEnd) {
        currentEnd = end;
      }
    }
  }

  return {start: currentStart, end: currentEnd};
};

export const getBookingsOfDate = (bookings, complex, date: Date) => {
  const dateSortedBookings = [];
  const openingWindow = getOpeningWindowOfDay(date, complex);
  const opening = new Date(date.getTime());
  opening.setHours(openingWindow.start.getHours());
  opening.setMinutes(openingWindow.start.getMinutes());
  opening.setSeconds(0);
  opening.setMilliseconds(0);
  opening.setDate(date.getDate());
  const closing = new Date(opening.getTime() + openingWindow.end.getTime() - openingWindow.start.getTime());
  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.startAt);
    if (opening <= bookingDate && bookingDate <= closing) {
      dateSortedBookings.push(booking);
    }
  });
  return dateSortedBookings;
};

export const getFieldBookings = (dateSortedBookings: any[], field) => {
  let fieldSortedBookings = dateSortedBookings.filter((booking) => booking.field == field._id);
  fieldSortedBookings = fieldSortedBookings.filter((booking) => booking.status != 'canceled' && booking.status != 'refused' && booking.status != 'expired');
  return fieldSortedBookings;
};

export const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}