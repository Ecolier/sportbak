import {Component, ContentChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'button[sbk-btn]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  constructor(private elementRef: ElementRef) {}
}
