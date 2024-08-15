import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'complex-video',
  templateUrl: './complex-video.component.html',
  styleUrls: ['./complex-video.component.scss'],
})
export class ComplexVideoComponent extends FBKComponent {
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,

  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {}
}
