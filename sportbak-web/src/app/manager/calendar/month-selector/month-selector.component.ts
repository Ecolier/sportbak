import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MonthSelectorComponent extends FBKComponent {
  @Input() month:string;
  @Input() year:string;
  @Output() toPreviousMonth = new EventEmitter();
  @Output() toNextMonth = new EventEmitter();
  @Output() setDate = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {}

  resetDateToToday() {
    const today = new Date();
    this.setDate.emit(today);
  }
}
