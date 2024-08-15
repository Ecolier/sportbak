import {Component, ElementRef, Input} from '@angular/core';
import {TranslateAppProvider} from '../../services/translate/translate.service';
import {FBKComponent} from '../base.component';

@Component({
  selector: 'toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent extends FBKComponent {
  @Input() leftText: string;
  @Input() rightText: string;
  @Input() color: string;

  toggled = true;
  id = 'toggler' + Math.random();
  toggleStyle: any;
  buttonStyle: any;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ToggleButtonComponent');
  }

  fbkOnInit(): void {
    this.toggleStyle = {'background-color': this.color};
    this.buttonStyle = {'background-color': this.color.replace('1)', '0.5)')};
  }

  toggle(): void {
    const toggler = document.getElementById(this.id);
    this.toggled = !this.toggled;
    if (this.toggled) {
      toggler.style.transform = '';
    } else {
      toggler.style.transform = 'translateX(100%)';
    }
  }
}
