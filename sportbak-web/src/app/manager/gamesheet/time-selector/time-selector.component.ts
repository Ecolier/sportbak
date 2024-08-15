import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSelectorComponent extends FBKComponent {
  hours: string;
  minutes: string;
  MINUTES_LOWER_LIMIT: number = 0;
  MINUTES_UPPER_LIMIT: number = 59;
  HOURS_LOWER_LIMIT: number = 0;
  HOURS_UPPER_LIMIT: number = 23;
  isAMPM: boolean = false;
  isAM: boolean = true;
  @Input() hasSet;
  @Output() onValidateTime = new EventEmitter();
  @Output() onCancelTime = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'TimeSelectorComponent');
  }
  fbkOnInit() {
    this.initTime();
    if (this.translate.getLanguage() == 'en') {
      this.isAMPM = true;
      this.HOURS_UPPER_LIMIT = 12;
    }
  }

  initTime() {
    let minutesToSubstract;
    if (this.hasSet) {
      minutesToSubstract = 45;
    } else {
      minutesToSubstract = 60;
    }
    const date = new Date(Date.now() - 1000 * (60 * minutesToSubstract));
    console.log(date);

    this.hours = date.getHours() == 0 ? date.getHours().toString() : (date.getHours()).toString();
    this.minutes = date.getMinutes().toString();
    this.formatTime();
  }

  formatTime() {
    this.hours = this.formatToDoubleDigits(this.hours);
    this.minutes = this.formatToDoubleDigits(this.minutes);
  }

  formatToDoubleDigits(value) {
    return ('0' + value).slice(-2);
  }

  increaseMinutes() {
    let min = Number(this.minutes);
    if (min < this.MINUTES_UPPER_LIMIT) {
      min = min + 1;
      this.minutes = this.formatToDoubleDigits(min);
    }
  }

  decreaseMinutes() {
    let min = Number(this.minutes);
    if (min > this.MINUTES_LOWER_LIMIT) {
      min = min - 1;
      this.minutes = this.formatToDoubleDigits(min);
    }
  }

  increaseHours() {
    let hours = Number(this.hours);
    if (hours < this.HOURS_UPPER_LIMIT) {
      hours = hours + 1;
      this.hours = this.formatToDoubleDigits(hours);
    }
  }

  decreaseHours() {
    let hours = Number(this.hours);
    if (hours > this.HOURS_LOWER_LIMIT) {
      hours = hours - 1;
      this.hours = this.formatToDoubleDigits(hours);
    }
  }

  toggleIsAm() {
    this.isAM = !this.isAM;
  }


  validate() {
    if (this.isAMPM && !this.isAM) {
      this.hours = (Number(this.hours) + 12).toString();
    }
    this.onValidateTime.emit({hours: this.hours, minutes: this.minutes});
  }

  cancel() {
    this.onCancelTime.emit();
  }
}
