import {Component, HostBinding, HostListener, Input} from '@angular/core';

@Component({
  selector: 'sbk-section-dropdown',
  templateUrl: './section-dropdown.component.html',
  styleUrls: ['./section-dropdown.component.scss'],
})
export class SectionDropdownComponent {
  @Input() title = '';
  @Input() @HostBinding('class.expanded') expanded = false;
  toggle() {
    this.expanded = !this.expanded;
  }
}
