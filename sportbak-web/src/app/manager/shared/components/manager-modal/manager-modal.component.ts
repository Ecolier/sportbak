import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-modal',
  templateUrl: './manager-modal.component.html',
  styleUrls: ['./manager-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerModalComponent extends FBKComponent {
  @Input() isDisplaying: boolean;
  @Input() title: string = '';
  @Input() mainText: string = '';
  @Input() button1Text: string;
  @Input() button2Text: string;
  @Input() iconSrc: string;
  @Input() styles: string;
  @Output() button1Action = new EventEmitter();
  @Output() button2Action = new EventEmitter();
  @Output() close = new EventEmitter<void>();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerModalComponent');
  }
  fbkOnInit() {}
}
