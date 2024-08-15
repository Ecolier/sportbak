import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})

export class ApplicationCardComponent extends FBKComponent {
  @Input() cardTitle: string;
  @Input() cardDescription: string;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePage');
  }

  fbkOnInit() {}
}
