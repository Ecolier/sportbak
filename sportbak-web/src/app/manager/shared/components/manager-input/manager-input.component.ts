import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-input',
  templateUrl: './manager-input.component.html',
  styleUrls: ['./manager-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerInputComponent extends FBKComponent {
  @Input() type: string;
  @Input() value: string | number = '';
  @Input() class = '';
  @Input() maxlength: number;
  @Output() onChange = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerInputComponent');
  }

  fbkOnInit() {
  }

  onInputChanged(event) {
    this.onChange.emit(event);
  }
}
