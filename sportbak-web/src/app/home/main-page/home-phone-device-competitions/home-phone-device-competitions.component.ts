import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
@Component({
  selector: 'home-phone-device-competitions',
  templateUrl: './home-phone-device-competitions.component.html',
  styleUrls: ['./home-phone-device-competitions.component.scss'],
})
export class HomePhoneDeviceCompetitionsComponent extends FBKComponent {
  status: boolean = false;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {}
}
