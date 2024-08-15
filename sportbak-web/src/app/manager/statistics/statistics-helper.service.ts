import {Injectable} from '@angular/core';
import {ComplexModel} from '../../shared/models/complex/complex.model';
import {BookingService} from '../shared/services/bookings.service';
import {convertToMidnight, Interval, INTERVALS} from '../shared/helpers/date.helper';

@Injectable({
  providedIn: 'root',
})
export class StatisticsHelper {
  startRange: Date;
  endRange: Date;
  sizeInterval: number;
  possibleIntervals: Interval[];
  complex: ComplexModel;
  availableFields: any[];
  availableFieldsNames: string[];
  selectedFields: any[];
  availableSports: string[];
  selectedSports: string[];

  constructor(
    private bookingProvider: BookingService,
  ) {
  }

  initialise() {
    this.availableSports = this.complex.sport;
    this.selectedSports = [...this.availableSports];
    this.choosePossibleIntervals();
    this.setFields();
    return this.getData();
  }

  getData() {
    return this.bookingProvider.getStatistics(this.startRange, this.endRange, this.sizeInterval);
  }


  onDateChange() {
    this.choosePossibleIntervals();
    this.updateSizeInterval();
    return this.getData();
  }

  updateStatisticsOnStartChange(date: Date) {
    this.setStartRange(date);
    if (this.startRange >= this.endRange) {
      this.endRange = new Date(this.startRange.getTime() + INTERVALS.DAY.value);
    }
    return this.onDateChange();
  }

  updateStatisticsOnEndChange(date: Date) {
    this.setEndRange(date);
    if (this.startRange >= this.endRange) {
      this.startRange = new Date(this.endRange.getTime() - INTERVALS.DAY.value);
    }
    return this.onDateChange();
  }

  updateStatisticsOnIntervalChange(interval: number) {
    this.setInterval(interval);
    return this.onDateChange();
  }

  computeDateInterval() {
    return this.endRange.getTime() - this.startRange.getTime();
  }

  choosePossibleIntervals() {
    const dateInterval = this.computeDateInterval();
    this.possibleIntervals = [INTERVALS.DAY];
    if (dateInterval >= INTERVALS.WEEK.value) {
      this.possibleIntervals.push(INTERVALS.WEEK);
    }
    if (dateInterval >= INTERVALS.MONTH.value) {
      this.possibleIntervals.push(INTERVALS.MONTH);
    }
  }

  updateSizeInterval() {
    const dateInterval = this.computeDateInterval();
    if (this.sizeInterval > dateInterval) {
      this.sizeInterval = this.selectLowerInterval(this.sizeInterval);
    }
  }

  selectLowerInterval(interval) {
    if (interval === INTERVALS.MONTH.value) {
      return INTERVALS.DAY.value;
    }
    return INTERVALS.DAY.value;
  }

  setFields() {
    this.availableFields = this.complex.fields.filter((field) => this.selectedSports.includes(field.sport));
    this.availableFieldsNames = this.availableFields.map((field) => field.name);
    this.computeSelectedFields();
  }

  toggleSportInSelected(sport) {
    if (this.selectedSports.includes(sport)) {
      this.selectedSports.splice(this.selectedSports.indexOf(sport), 1);
    } else {
      this.selectedSports.push(sport);
    }
    this.setFields();
  }

  toggleFieldInSelected(field) {
    if (this.availableFieldsNames.includes(field)) {
      this.availableFieldsNames.splice(this.availableFieldsNames.indexOf(field), 1);
    } else {
      this.availableFieldsNames.push(field);
    }
    this.computeSelectedFields();
  }

  computeSelectedFields() {
    this.selectedFields = this.availableFields.filter((f) => this.availableFieldsNames.includes(f.name));
  }

  setStartRange(date: Date) {
    this.startRange = convertToMidnight(date);
  }

  setEndRange(date: Date) {
    this.endRange = convertToMidnight(date);
  }

  setInterval(interval: number) {
    this.sizeInterval = interval;
  }

  setComplex(complex: ComplexModel) {
    this.complex = complex;
  }
}
