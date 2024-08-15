import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'app-myComplex',
  templateUrl: './my-complex.component.html',
  styleUrls: ['./my-complex.component.scss'],
})

export class MyComplexComponent extends FBKComponent {
  isMenuDisplayed: boolean = false;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {

  }
}
