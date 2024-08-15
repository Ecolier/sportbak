export class Day {
  public date: Date;
  public weekDayIndex: number;
  public validatedBookings: number = 0;
  public waitingForManagerBookings: number = 0;
  public waitingForPlayerBookings: number = 0;
  public isToday: boolean = false;
  constructor(_date:Date) {
    this.date = _date;
    this.setWeekDayIndex();
    this.setIsToday();
  }

  setWeekDayIndex() {
    if (this.date) {
      this.weekDayIndex = this.date.getDay();
    }
  }

  setValidatedBookings(bookings:number) {
    this.validatedBookings = bookings;
  }

  setWaitingForManagerBookings(bookings: number) {
    this.waitingForManagerBookings = bookings;
  }

  setWaitingForPlayerBookings(bookings: number) {
    this.waitingForPlayerBookings = bookings;
  }

  setIsToday() {
    if (this.date) {
      this.isToday = new Date(Date.now()).toDateString() == this.date.toDateString() ? true : false;
    }
  }
}
