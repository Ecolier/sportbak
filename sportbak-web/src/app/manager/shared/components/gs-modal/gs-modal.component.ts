import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../../shared/components/base.component';

@Component({
  selector: 'gs-modal',
  templateUrl: './gs-modal.component.html',
  styleUrls: ['./gs-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsModalComponent extends FBKComponent {
  isValidateClicked: boolean = false;
  isCancelClicked:boolean = false;
  @Input() title: string = '';
  @Output() onValidate = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsModalComponent');
  }
  fbkOnInit() {}

  onTitleClick() {
    this.isValidateClicked = true;
    setTimeout(()=> {
      this.onValidate.emit();
      this.isValidateClicked = false;
    }, 200);
  }
}
