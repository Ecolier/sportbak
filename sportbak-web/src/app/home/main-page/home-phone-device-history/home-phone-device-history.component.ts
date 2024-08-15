import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
@Component({
  selector: 'home-phone-device-history',
  templateUrl: './home-phone-device-history.component.html',
  styleUrls: ['./home-phone-device-history.component.scss'],
})
export class HomePhoneDeviceHistoryComponent extends FBKComponent {
  slides = [];
  slideConfig = {
    'dots': true,
    'infinite': true,
    'speed': 500,
    'slidesToShow': 1,
    'centerMode': false,
    'variableWidth': true,
    'autoplay': false,
    'autoplaySpeed': 3500,
    'cssEase': 'linear',
    'responsive': [
      {
        'breakpoint': 770,
        'settings': {
          'centerMode': false,
          'variableWidth': false,
        },
      },
    ],
  };

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }
  fbkOnInit() {
    this.loadComments();
  }


  loadComments() {
    this.slides = this.getTranslation('home_history');
  }
}

