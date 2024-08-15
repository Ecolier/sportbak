import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';

@Component({
  selector: 'gs-counter',
  templateUrl: './gs-counter.component.html',
  styleUrls: ['./gs-counter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsCounterComponent extends FBKComponent {
  @Input() title:string;
  @Input() value: number = 0;
  @Input() icon: string;
  @Output() onMinus = new EventEmitter();
  @Output() onPlus = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsCounterComponent');
  }

  fbkOnInit() {}

  minusClick() {
    this.onMinus.emit();
  }

  plusClick() {
    this.onPlus.emit();
  }
}
