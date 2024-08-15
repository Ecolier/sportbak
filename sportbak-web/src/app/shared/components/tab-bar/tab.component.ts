import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'sbk-tab',
  templateUrl: './tab.component.html',
})
export class TabComponent {
  @ViewChild(TemplateRef) bodyTemplate: TemplateRef<any>;
  @Input() title: string;
  @Output() select = new EventEmitter();
}
