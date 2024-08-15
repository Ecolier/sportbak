import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';

@Component({
  selector: 'manager-textarea',
  templateUrl: './manager-textarea.component.html',
  styleUrls: ['./manager-textarea.component.scss'],
})
export class ManagerTextareaComponent extends FBKComponent {
  @Input() value: string | number = '';
  @Input() class = '';
  @Output() onChange = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerInputComponent');
  }

  fbkOnInit(): void {
  }

  onInputChanged(event) {
    this.onChange.emit(event);
  }
}
