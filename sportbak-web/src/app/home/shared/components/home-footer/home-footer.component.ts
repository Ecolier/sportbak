import {Component, ElementRef} from '@angular/core';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss'],
})
export class HomeFooterComponent extends FBKComponent {
  privacy = Conf.apiBaseUrl + '/fr/agreements/user/file/user_privacy_policy.pdf';
  userTerms = Conf.apiBaseUrl + '/fr/agreements/user/file/user_terms_of_dervice.pdf';

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {}

  onClick() {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 150);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
