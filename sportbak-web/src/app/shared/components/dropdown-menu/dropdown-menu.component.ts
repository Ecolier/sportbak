import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'sbk-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  exportAs: 'sbkDropdownMenu',
})
export class DropdownMenuComponent {
  @Input('visible') @HostBinding('attr.visible') private _visible = false;

  get visible() {
    return this._visible;
  }

  trigger() {
    this._visible = !this._visible;
  }
}
