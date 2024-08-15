import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuSectionComponent extends FBKComponent {
  isOpen:boolean;
  @Input() text:string;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {}

  onClick() {
    this.isOpen = !this.isOpen;
  }
}
