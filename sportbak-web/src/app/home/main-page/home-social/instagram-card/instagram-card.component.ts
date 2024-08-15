import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'instagram-card',
  templateUrl: './instagram-card.component.html',
  styleUrls: ['./instagram-card.component.scss'],
})

export class InstagramCardComponent extends FBKComponent {
  @Input() instagramUsername: string;
  @Input() instagramMainContent: string;
  @Input() instagramTextContent: string;
  @Input() contentDate: Date;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePage');
  }

  fbkOnInit() {}
}
