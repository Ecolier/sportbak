import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'button[sbk-btn], a[sbk-btn]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {}