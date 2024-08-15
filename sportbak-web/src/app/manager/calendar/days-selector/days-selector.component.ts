import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {Day} from '../helpers/day.helper';

@Component({
  selector: 'days-selector',
  templateUrl: './days-selector.component.html',
  styleUrls: ['./days-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DaysSelectorComponent extends FBKComponent {
  SUNDAY:number = 0;
  MONDAY:number = 1;
  TUESDAY:number = 2;
  WEDNESDAY:number = 3;
  THURSDAY:number = 4;
  FRIDAY:number = 5;
  SATURDAY:number = 6;

  mondays: Day[]=[];
  tuesdays: Day[]=[];
  wednesdays: Day[]=[];
  thursdays: Day[]=[];
  fridays: Day[]=[];
  saturdays: Day[]=[];
  sundays: Day[]=[];

  clickedDayName: number;
  clickedDayIndex: number;
  @Input() openingDays;
  @Input() date: Date;
  @Input() isLoading: boolean;
  @Input() days:Day[];
  @Input() clickedPreviousMonth:boolean;
  @Input() clickedNextMonth:boolean;
  @Output() selectDay = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
    if (this.date) {
      this.sortByWeekDay();
    }
  }

  fbkInputChanged() {
    if (this.date) {
      this.sortByWeekDay();
    }
  }

  sortByWeekDay() {
    this.clearWeekDays();
    this.days.forEach((day) => {
      if (day.weekDayIndex == this.MONDAY) {
        this.mondays.push(day);
      }
      if (day.weekDayIndex == this.TUESDAY) {
        this.tuesdays.push(day);
      }
      if (day.weekDayIndex == this.WEDNESDAY) {
        this.wednesdays.push(day);
      }
      if (day.weekDayIndex == this.THURSDAY) {
        this.thursdays.push(day);
      }
      if (day.weekDayIndex == this.FRIDAY) {
        this.fridays.push(day);
      }
      if (day.weekDayIndex == this.SATURDAY) {
        this.saturdays.push(day);
      }
      if (day.weekDayIndex == this.SUNDAY) {
        this.sundays.push(day);
      }
    });
    this.addEmptyDays();
  }

  addEmptyDays() {
    this.addEmptyDaysMondays();
    this.addEmptyDaysTuesdays();
    this.addEmptyDaysWednesdays();
    this.addEmptyDaysThursdays();
    this.addEmptyDaysFridays();
    this.addEmptyDaysSaturdays();
  }

  addEmptyDaysMondays() {
    if (this.mondays[0].date.getDate() > 1) {
      this.mondays = [new Day(null), ...this.mondays];
    }
  }
  addEmptyDaysTuesdays() {
    if (this.tuesdays[0].date.getDate() > 2) {
      this.tuesdays = [new Day(null), ...this.tuesdays];
    }
  }
  addEmptyDaysWednesdays() {
    if (this.wednesdays[0].date.getDate() > 3) {
      this.wednesdays = [new Day(null), ...this.wednesdays];
    }
  }
  addEmptyDaysThursdays() {
    if (this.thursdays[0].date.getDate() > 4) {
      this.thursdays = [new Day(null), ...this.thursdays];
    }
  }
  addEmptyDaysFridays() {
    if (this.fridays[0].date.getDate() > 5) {
      this.fridays = [new Day(null), ...this.fridays];
    }
  }

  addEmptyDaysSaturdays() {
    if (this.saturdays[0].date.getDate() > 6) {
      this.saturdays = [new Day(null), ...this.saturdays];
    }
  }

  onDayClick(dayName:any, dayIndex:number, day:Day) {
    this.clickedDayName = dayName;
    this.clickedDayIndex = dayIndex;
    setTimeout(()=> {
      this.clickedDayName = undefined;
      this.clickedDayIndex = undefined;
      this.selectDay.emit(day.date);
    }, 650);
  }

  clearWeekDays() {
    this.mondays = [];
    this.tuesdays = [];
    this.wednesdays = [];
    this.thursdays = [];
    this.fridays = [];
    this.saturdays = [];
    this.sundays = [];
  }

  emitDays(date:Date) {
    this.selectDay.emit(date);
  }
}
