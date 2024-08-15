import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'field-selector',
  templateUrl: './field-selector.component.html',
  styleUrls: ['./field-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FieldSelectorComponent extends FBKComponent {
  selectedField: number = 0;
  @Input()complex: ComplexModel;
  @Input() sport;
  filterComplex:any ;
  @Output() onValidateField = new EventEmitter();
  @Output() onCancelField = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'FieldSelectorComponent');
  }

  fbkOnInit() {
    this.filterComplex = this.complex.fields.filter((field) => field.sport == this.sport);
  }

  selectField(fieldIndex:number) {
    this.selectedField = fieldIndex;
  }

  validate() {
    this.onValidateField.emit({field: this.complex.fields[this.selectedField]});
  }

  cancel() {
    this.onCancelField.emit();
  }
}
