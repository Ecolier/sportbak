import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'help-info',
  templateUrl: './help-info.component.html',
  styleUrls: ['./help-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpInfoComponent extends FBKComponent {
  isTooltipOn: boolean = false;
  @Input() text: string = '';
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HelpInfoComponent');
  }
  fbkOnInit() { }

  toggleTooltip() {
    this.isTooltipOn = !this.isTooltipOn;
  }
}
