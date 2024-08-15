import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-dual-choice',
  templateUrl: './manager-dual-choice.component.html',
  styleUrls: ['./manager-dual-choice.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerDualChoiceComponent extends FBKComponent {
  @Input() class: string;
  @Input() button1Text: string;
  @Input() button2Text: string;
  @Input() isButton1Selected:boolean;
  @Output() toggleButtons = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerDualChoiceComponent');
  }

  fbkOnInit() {}

  onButtonClick() {
    this.toggleButtons.emit();
  }
}
