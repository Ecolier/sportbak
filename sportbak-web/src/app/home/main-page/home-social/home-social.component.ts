import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';


@Component({
  selector: 'home-social',
  templateUrl: './home-social.component.html',
  styleUrls: ['./home-social.component.scss'],
})
export class HomeSocialComponent extends FBKComponent {
  instagramContents: any
  instagramIsLoaded: boolean = false
  facebookSB = 'https://www.facebook.com/SportBakFR';
  linkedinSB = 'https://www.linkedin.com/company/futbak';
  twitterSB = 'https://twitter.com/futbak';
  instagramSB = 'https://www.instagram.com/sportbakofficial/';
  constructor(
    private requestProvider: FBKRequestProvider,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {
    this.getInstagramMedia();
  }

  getInstagramMedia() {
    this.requestProvider.getInstagramData().subscribe((data) => {
      this.instagramContents = data['data'];
      this.removeInstagramVideo(this.instagramContents);
      this.instagramIsLoaded = true;
    });
  }

  removeInstagramVideo(data) {
    for ( let content = 0; content < data.length; content++) {
      if ( data[content].media_type === 'VIDEO') {
        data.splice(content, 1);
        content--;
      }
    }
  }

  goToInstagram(url) {
    window.open(url, '_blank');
  }
}
