import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
@Component({
  selector: 'home-review',
  templateUrl: './home-review.component.html',
  styleUrls: ['./home-review.component.scss'],
})
export class HomeReviewComponent extends FBKComponent {
  slides = [];
  slideConfig = {
    'dots': true,
    'infinite': true,
    'speed': 500,
    'slidesToShow': 1,
    'centerMode': false,
    'variableWidth': true,
    'autoplay': true,
    'autoplaySpeed': 3500,
    'cssEase': 'linear',
    'responsive': [
      {
        'breakpoint': 600,
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

  fbkOnInit() {}

  fbkTranslationUpdated() {
    this.loadComments();
  }

  loadComments() {
    this.slides = this.getTranslation('user_reviews');
  }
}
