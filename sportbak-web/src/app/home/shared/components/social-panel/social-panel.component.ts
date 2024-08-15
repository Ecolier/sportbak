import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'social-panel',
  templateUrl: './social-panel.component.html',
  styleUrls: ['./social-panel.component.scss'],
})
export class SocialPanelComponent extends FBKComponent {
  @Input() facebookLink: string ;
  @Input() linkedinLink: string ;
  @Input() twitterLink: string ;
  @Input() instagramLink: string ;
  @Input() websiteLink: string ;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePage');
  }

  fbkOnInit() {}
}
