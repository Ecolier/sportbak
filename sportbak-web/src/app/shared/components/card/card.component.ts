import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../base.component';

@Component({
  selector: 'futbak-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent extends FBKComponent {
  @Input() noPadding: boolean = false;
  @Input() classes: string = '';

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'CardComponent');
  }
  fbkOnInit() {}
}
