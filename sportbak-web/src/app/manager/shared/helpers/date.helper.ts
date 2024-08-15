const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const WEEKDAYS_SHORT = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

type Interval = { name: string, value: number };

const INTERVALS = {
  DAY: {
    name: 'day',
    value: 86400000,
  },
  WEEK: {
    name: 'week',
    value: 604800000,
  },
  MONTH: {
    name: 'month',
    value: 2592000000,
  },
};

export {WEEKDAYS, WEEKDAYS_SHORT, MONTHS, MONTHS_SHORT, Interval, INTERVALS};

const convertToNoSecondNoMillisecondDate = (date: Date) => {
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const convertToMidnight = (date: Date) => {
  date = convertToNoSecondNoMillisecondDate(date);
  date.setHours(0);
  date.setMinutes(0);
  return date;
};

const oneNumberToTwoNumber = (s: number) => {
  let output = s.toString();
  if (s <= 9) {
    output = 0 + output;
  }
  return output;
};

export {convertToNoSecondNoMillisecondDate, convertToMidnight, oneNumberToTwoNumber};


