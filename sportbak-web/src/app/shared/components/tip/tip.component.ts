import {Component, ElementRef, HostBinding, Input} from '@angular/core';
import {FBKComponent} from '../base.component';
import {TranslateAppProvider} from '../../services/translate/translate.service';

@Component({
  selector: 'tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss'],
})
export class TipComponent extends FBKComponent {
  @Input() classes: string[] = [];
  @Input() size = 5;

  @HostBinding('style') style: {width: string, height: string}

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'TipComponent');
  }

  fbkOnInit(): void {
    this.classes.push('circle');
    this.style = {width: this.size+'px', height: this.size+'px'};
  }
}
