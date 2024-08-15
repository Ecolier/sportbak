import {AfterContentInit, Component, ContentChild, Directive, ElementRef, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'sbk-session-control',
  templateUrl: './session-control.component.html',
  styleUrls: ['./session-control.component.scss'],
  exportAs: 'sbkSessionControl',
})
export class SessionControlComponent {
  @Input() @HostBinding('attr.disabled') disabled = false;
  @Input() hasAdditionalItem = false;
}
