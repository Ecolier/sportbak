import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';

@Component({
  selector: 'manager-error-popup',
  templateUrl: './manager-error-popup.component.html',
  styleUrls: ['./manager-error-popup.component.scss'],
})
export class ManagerErrorPopupComponent extends FBKComponent {
  @Input() errorMessage: string;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerErrorPopupComponent');
  }

  fbkOnInit(): void {
  }

  closePopup(event: Event) {
    event.stopPropagation();
    this.onClose.emit();
  }
}
