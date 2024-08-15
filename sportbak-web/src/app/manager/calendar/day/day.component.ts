import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {Day} from '../helpers/day.helper';

@Component({
  selector: 'day-column',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})

export class DayComponent extends FBKComponent {
  clickedDayName: number;
  clickedDayIndex: number;
  @Input() isOpen: boolean;
  @Input() date: Date;
  @Input() days: Day[]=[];
  @Input() DAY:number;
  @Output() emitDays = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {}

  onDayClick(dayName:number, dayIndex:number, day:Day){
    if (this.isOpen) {
      this.clickedDayName = dayName;
      this.clickedDayIndex = dayIndex;
      this.clickedDayName = undefined;
      this.clickedDayIndex = undefined;
      this.emitDays.emit(day.date);
    }
  }
}
