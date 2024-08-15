import {Component, ElementRef} from '@angular/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';

@Component({
  selector: 'gs-action-stack',
  templateUrl: './gs-action-stack.component.html',
  styleUrls: ['./gs-action-stack.component.scss'],
})
export class GsActionStackComponent extends FBKComponent {
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsActionStackComponent');
  }

  fbkOnInit() {}
}
