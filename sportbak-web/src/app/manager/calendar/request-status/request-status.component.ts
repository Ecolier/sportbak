import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {BookingErrors} from '../../shared/const/booking-errors';


@Component({
  selector: 'request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RequestStatusComponent extends FBKComponent {
  @Input() isVisible: boolean = true;
  @Input() text: string = '';
  @Input() errorCode = 0;
  @Input() isFailure: boolean;
  @Input() hidesAutomatically: boolean = true;
  @Input() displayTime: number = 5000;
  @Output() resetRequestStatus = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
  }

  fbkInputChanged(inputName: string, currentValue: any, lastValue: any) {
    this.setText();
    if (inputName === 'isVisible' && this.isVisible && this.hidesAutomatically) {
      setTimeout(() => {
        this.isVisible = false;
        this.resetRequestStatus.emit();
      }, this.displayTime);
    }
  }

  hide() {
    this.isVisible = false;
    this.resetRequestStatus.emit();
  }

  show() {
    this.isVisible = true;
  }

  setText() {
    if (!this.errorCode) {
      return;
    }
    let message: string;
    const error = BookingErrors.find((err) => err.code === this.errorCode);
    message = this.getTranslation(error.translation);
    if (!message) {
      message = this.getTranslation('an_error_occurred');
    }
    this.text = message;
  }
}
