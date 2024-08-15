import {Component, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateService} from '@ngx-translate/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent extends FBKComponent {
  @Input() card
  @Output() showVideo = new EventEmitter();
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
    'prevArrow': '<button class="slick-prev" aria-label="Previous" type="button"></button>',
    'nextArrow': '<button class="slick-next" aria-label="Next" type="button"></button>',
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
    protected translateService: TranslateService,
  ) {
    super(_refElement, translate, 'ManagerLoginComponent');
  }

  fbkOnInit() {
  }
}
