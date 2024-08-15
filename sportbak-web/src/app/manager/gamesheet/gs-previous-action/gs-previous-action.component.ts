import {Component, ElementRef, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'gs-previous-action',
  templateUrl: './gs-previous-action.component.html',
  styleUrls: ['./gs-previous-action.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsPreviousActionComponent extends FBKComponent {
  isShowingValidationModal: boolean = false;
  @Output() onValidatePrevious = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsPreviousActionComponent');
  }

  fbkOnInit() {}

  onPreviousClick() {
    this.toggleIsShowingValidationModal();
  }

  toggleIsShowingValidationModal() {
    this.isShowingValidationModal = !this.isShowingValidationModal;
  }

  backToPrevious() {
    this.onValidatePrevious.emit();
  }
}
