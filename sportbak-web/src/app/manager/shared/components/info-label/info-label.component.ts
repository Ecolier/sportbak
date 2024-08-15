import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'info-label',
  templateUrl: './info-label.component.html',
  styleUrls: ['./info-label.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoLabelComponent extends FBKComponent {
  isMouseOver: boolean = false;
  @Input() infoText: string;
  @Input() isFromLeft: boolean = false;
  @Input() mobileDisplayTime: number = 2000;
  @Input() isSpread: boolean = false;
  @Input() isFutBuzz: boolean = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'InfoLabelComponent');
  }

  fbkOnInit() { }

  onMouseOver() {
    this.isMouseOver = true;
  }
  onMouseExit() {
    this.isMouseOver = false;
  }
  onClick() {
    if (!this.isMouseOver) {
      this.isMouseOver = true;
      setTimeout(() => {
        if (this.isMouseOver) {
          this.isMouseOver = false;
        }
      }, this.mobileDisplayTime);
    } else {
      this.isMouseOver = false;
    }
  }
}
