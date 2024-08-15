import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'day-picker',
  templateUrl: './day-picker.component.html',
  styleUrls: ['./day-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DayPickerComponent extends FBKComponent {
  isDateToday: boolean;
  formattedDate: string;
  @Input() daysToOpen;
  @Input() date: Date;
  @Input() openingDaysInMonth;
  @Output() setDate = new EventEmitter();
  @Output() setDaysToOpen = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
    if (this.date) {
      this.checkDate();
    }
  }

  fbkInputChanged() {
    if (this.date) {
      this.checkDate();
    }
  }

  toPreviousDay() {
    this.daysToOpen--
    this.setDate.emit(this.openingDaysInMonth[this.daysToOpen]);
    this.setDaysToOpen.emit(this.daysToOpen);
  }

  toNextDay() {
    this.daysToOpen++
    this.setDate.emit(this.openingDaysInMonth[this.daysToOpen]);
    this.setDaysToOpen.emit(this.daysToOpen);
  }

  resetDateToToday() {
    const newDate = new Date();
    this.setDate.emit(newDate);
  }

  checkDate() {
    const today = new Date();
    const dateCopy = new Date(this.date);
    if (dateCopy.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
      this.isDateToday = true;
    } else {
      this.isDateToday = false;
      this.formattedDate = this.date.toLocaleDateString(this.translateProvider.getLanguage(), {month: 'long', day: 'numeric'});
    }
  }
}
