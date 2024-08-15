import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from '../base.component';
import {TranslateAppProvider} from '../../services/translate/translate.service';
import {convertToMidnight, WEEKDAYS_SHORT} from '../../../manager/shared/helpers/date.helper';

@Component({
  selector: 'sbk-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent extends FBKComponent {
  @Input() date: Date = convertToMidnight(new Date());
  @Input() label: string;

  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  id = 'datePicker' + Math.random().toString().replace('0.', '');
  isShowingCalendar = false;
  private startSunday: boolean;
  rows: Date[][];
  mode: 'days' | 'months' | 'years' = 'days';
  headCenter: string;
  lang: string;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'DatePickerComponent');
    this.lang = this.translate.getLanguage();
  }

  fbkOnInit(): void {
  }

  getWeekDays() {
    const week = [];
    for (let day = 0; day < 7; day++) {
      week.push(this.getTranslation(WEEKDAYS_SHORT[this.startSunday ? day : (day + 1) % 7]));
    }
    return week;
  }

  toggleCalendar() {
    if (this.isShowingCalendar) {
      this.hideCalendar();
    } else {
      this.showCalendar();
    }
  }

  loadDays() {
    this.mode = 'days';
    this.headCenter = this.getThisMonth();
    this.rows = [];
    const firstDayInMonth = new Date(this.date.getTime());
    firstDayInMonth.setDate(1);
    let index = (this.startSunday ? 0 : 1) - (firstDayInMonth.getDay() || 7);
    for (let y = 0; y < 6; y++) {
      const row = [];
      for (let x = 0; x < 7; x++) {
        const day = new Date(firstDayInMonth.getTime());
        day.setDate(day.getDate() + index);
        row.push(day);
        index++;
      }
      this.rows.push(row);
    }
  }

  loadMonths() {
    this.mode = 'months';
    this.headCenter = this.date.getFullYear().toString();
    this.rows = [];
    let monthNumber = 0;
    for (let y = 0; y < 3; y++) {
      const row = [];
      for (let x = 0; x < 4; x++) {
        row.push(new Date(this.date.getFullYear(), monthNumber, this.date.getDate()));
        monthNumber++;
      }
      this.rows.push(row);
    }
  }

  loadYears() {
    this.mode = 'years';
    this.headCenter = this.date.getFullYear().toString();
    this.rows = [];
    let year = this.date.getFullYear() - 12;
    for (let y = 0; y < 5; y++) {
      const row = [];
      for (let x = 0; x < 5; x++) {
        row.push(new Date(year, this.date.getMonth(), this.date.getDate()));
        year++;
      }
      this.rows.push(row);
    }
  }

  setDate(date: Date) {
    this.date = date;
    this.dateChange.emit(date);
  }

  previous() {
    switch (this.mode) {
      case 'days':
        this.date = new Date(
            this.date.getFullYear(),
            this.date.getMonth() - 1,
            1,
        );
        this.loadDays();
        break;
      case 'months':
        this.date = new Date(
            this.date.getFullYear() - 1,
            this.date.getMonth(),
            this.date.getDate(),
        );
        this.loadMonths();
        break;
      case 'years':
        this.date = new Date(
            this.date.getFullYear() - 25,
            this.date.getMonth(),
            this.date.getDate(),
        );
        this.loadYears();
    }
  }

  next() {
    switch (this.mode) {
      case 'days':
        this.date = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            1,
        );
        this.loadDays();
        break;
      case 'months':
        this.date = new Date(
            this.date.getFullYear() + 1,
            this.date.getMonth(),
            this.date.getDate(),
        );
        this.loadMonths();
        break;
      case 'years':
        this.date = new Date(
            this.date.getFullYear() + 25,
            this.date.getMonth(),
            this.date.getDate(),
        );
        this.loadYears();
    }
  }

  center() {
    switch (this.mode) {
      case 'days':
        this.loadMonths();
        break;
      case 'months':
        this.loadYears();
        break;
    }
  }

  hideCalendar() {
    this.isShowingCalendar = false;
  }

  private showCalendar() {
    this.isShowingCalendar = true;
    this.loadDays();
  }

  getThisMonth() {
    return this.date.toLocaleDateString(this.lang, {month: 'long', year: 'numeric'});
  }

  getLocalMonthName(month: Date) {
    return month.toLocaleDateString(this.lang, {month: 'short'});
  }

  isMonthSelected(month: Date) {
    return this.date.getMonth() === month.getMonth();
  }

  isYearSelected(year: Date) {
    return this.date.getFullYear() === year.getFullYear();
  }

  onDayClick(day: Date) {
    this.setDate(day);
    this.hideCalendar();
  }

  onMonthClick(month: Date) {
    this.setDate(month);
    this.loadDays();
  }

  onYearClick(year: Date) {
    this.setDate(year);
    this.loadMonths();
  }
}
