import {animate, query, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
  selector: 'sbk-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  animations: [
    trigger('fadeInToLeft', [
      transition('idle => transitioning', [
        query('.current-body', animate('200ms', style({transform: 'translateX(-50%)'}))),
        query('.previous-body', animate('200ms', style({transform: 'translateX(50%)'}))),
      ]),
    ]),
  ],
})
export class TabBarComponent implements AfterViewInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild('bodyHost', {read: ViewContainerRef}) bodyHost: ViewContainerRef;

  @Input() index = 0;
  @Output() indexChange = new EventEmitter<number>();

  private _transitioning = false;
  private _bodyTransitionState: string;
  private get bodyTransitionState() {
    return this._transitioning ? 'transitioning' : 'idle';
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.indexChange.subscribe((newIndex) => this.transitionToTab(newIndex));
  }

  ngAfterViewInit() {
    this.selectTab(this.index);
  }

  transitionToTab(id: number) {

  }

  endTransitionToTab() {

  }

  selectTab(index: number) {
    this.index = index;
    this.indexChange.emit(index);
  }
}
