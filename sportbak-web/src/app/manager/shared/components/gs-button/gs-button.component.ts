import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'gs-button',
  templateUrl: './gs-button.component.html',
  styleUrls: ['./gs-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsButtonComponent extends FBKComponent {
  isClicked: boolean = false;
  @Input() text: string = '';
  @Input() className: string = '';
  @Input() color: string = 'green';
  @Input() delay: number = 400;
  @Output() onClick = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsButtonComponent');
  }

  fbkOnInit() { }

  onButtonClick() {
    this.isClicked = true;
    setTimeout(() => {
      this.onClick.emit();
      this.isClicked = false;
    }, this.delay);
  }
}
