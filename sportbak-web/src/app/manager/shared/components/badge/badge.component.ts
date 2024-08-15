import {Component, Input, ElementRef} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';


@Component({
  selector: 'sbk-badge',
  templateUrl: 'badge.component.html',
  styleUrls: ['./badge.component.scss'],
})

export class BadgeComponent extends FBKComponent {
  @Input() public value : number = 0;
  @Input() public focusing : boolean = true;
  @Input() public limit : number = 10;
  @Input() public moreThanLimit: boolean = true;
  @Input() public showNumber: boolean = true;

  constructor(
    protected _refElement: ElementRef,
    protected translate : TranslateAppProvider,
  ) {
    super(_refElement, translate, 'BadgeComponent');
  }

  fbkOnInit() {
  }

  fbkInputChanged() {
  }

  fbkAfterInit() {
  }

  getValue() {
    return this.value;
  }

  getBadgeText() {
    let result = ' ';
    const value = this.getValue();
    if (this.focusing && this.showNumber) {
      if (this.limit) {
        if (value < this.limit) {
          result = value + '';
        } else {
          if (this.moreThanLimit) {
            result = '+' + (this.limit - 1);
          } else {
            result = this.limit + '';
          }
        }
      } else {
        result = value + '';
      }
    }
    return result;
  }
}
