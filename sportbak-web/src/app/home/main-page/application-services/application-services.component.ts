import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {InViewportMetadata} from 'ng-in-viewport';
import {FBKComponent} from 'src/app/shared/components/base.component';

@Component({
  selector: 'application-services',
  templateUrl: './application-services.component.html',
  styleUrls: ['./application-services.component.scss'],
})
export class ApplicationServicesComponent extends FBKComponent {
  readonly items: number[] = Array(1000).fill(1).map((item, index) => item + index);
  slides: any;
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
  cards: any;
  cardKey: string;
  videoSrc:string;
  youtubeSrc:string;
  seeAllSrc:string;
  lang:string;
  isTestDivScrolledIntoView:boolean;
  cardLang: string;
  @Input() isMobile:boolean
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    protected translateService: TranslateService,
    private renderer: Renderer2,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {
    this.initData();
    this.youtubeSrc = 'https://www.youtube.com/embed/pRwQN71esoc';
  }

  initData() {
    this.lang = this.translateService.currentLang;
    this.cardKey = 'booking';
    this.getLangContent(this.cardKey);
    this.cards = this.getTranslation('service_app');
    this.slides = this.getTranslation('service_app');
  }

  clickOnCard(key) {
    this.getLangContent(key);
  }

  getLangContent(key) {
    if (this.translateService.currentLang == 'fr') {
      this.cardKey = key;
      this.cardLang = key + '-fr';
      this.seeAllSrc = 'https://www.youtube.com/watch?v=4c-ia1GKKDU';
    } else if (this.translateService.currentLang == 'en') {
      this.cardKey = key;
      this.cardLang = key + '-en';
      this.seeAllSrc = 'https://www.youtube.com/watch?v=aRVWgcl6e6Y';
    }
    this.videoSrc = './assets/video/' + this.cardLang + '.mp4';
  }
  onIntersection($event) {
    const {[InViewportMetadata]: {entry}, target} = $event;
    const ratio = entry.intersectionRatio;
       ratio >= 0.65 ? target.play() : target.pause();
  }
}
