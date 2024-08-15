import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { SBK_DIALOG_ID, SBK_TOAST_OPTIONS, ToastOptions, ToastService } from './toast.service';

@Component({
  selector: 'sbk-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate3d(-50%, 50%, 0)' }),
        animate('100ms', style({ opacity: 1, transform: 'translate3d(-50%, 0, 0)' })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0, transform: 'translate3d(-50%, 50%, 0)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {

  @Input() message : string = '';
  @Input() delay : number = 3000;
  @HostBinding('@fadeIn') fadeIn: any;
  @HostBinding('attr.class') get class() {
    return this.options.class;
  }

  constructor(
    private toastService: ToastService,
    @Inject(SBK_DIALOG_ID) private id: string,
    @Inject(SBK_TOAST_OPTIONS) public options: ToastOptions) { }
  close() { this.toastService.close(this.id) }
  ngOnInit() {
    setTimeout(() => {
      this.close();
    }, this.delay, this);
  }
}