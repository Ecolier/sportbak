import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';


@Component({
  selector: 'home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss'],
})
export class HomeMapComponent extends FBKComponent {
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }


  fbkOnInit() {

  }
}
