import {animate, group, query, style, transition, trigger} from '@angular/animations';
import {AfterViewInit, Component, ComponentRef, Directive, HostBinding, ViewChild, ViewContainerRef} from '@angular/core';
import {DialogService} from './dialog.service';

@Directive({
  selector: '[dialogContent]',
})
export class DialogContentDirective {}

@Component({
  selector: 'sbk-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('enterLeave', [
      transition(':enter', [
        group([
          query('.overlay', style({opacity: 0})),
          query('.modal-window', style({opacity: 0, transform: 'translate3d(0, 25%, 0)'})),
        ]),
        group([
          query('.overlay', animate(100, style({opacity: 1}))),
          query('.modal-window', animate(100, style({opacity: 1, transform: 'translate3d(0, 0, 0)'}))),
        ]),
      ]),
      transition(':leave', [
        group([
          query('.overlay', style({opacity: 1})),
          query('.modal-window', style({opacity: 1, transform: 'translate3d(0, 0, 0)'})),
        ]),
        group([
          query('.overlay', animate(100, style({opacity: 0}))),
          query('.modal-window', animate(100, style({opacity: 0, transform: 'translate3d(0, 25%, 0)'}))),
        ]),
      ]),
    ]),
  ],
})
export class DialogComponent implements AfterViewInit {
  @HostBinding('@enterLeave') enterLeaveTransition;
  dialogContentRef: ComponentRef<any>;
  @ViewChild(DialogContentDirective, {read: ViewContainerRef}) dialogContentHost: ViewContainerRef;
  constructor(private dialogService: DialogService) {}
  close() {
    this.dialogService.close();
  }
  ngAfterViewInit() {
    this.dialogContentHost.insert(this.dialogContentRef.hostView);
    this.dialogContentRef.changeDetectorRef.detectChanges();
  }
}
