import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-multisport-choice',
  templateUrl: './manager-multisport-choice.component.html',
  styleUrls: ['./manager-multisport-choice.component.scss'],
})
export class ManagerMultisportChoiceComponent extends FBKComponent {
  @Input() complex: ComplexModel;
  @Output() chosenSport = new EventEmitter<string>()
  sportType: string;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerMultisportChoiceComponent');
  }
  fbkOnInit() {
    this.sportType = 'all';
  }

  selectSport() {
    this.chosenSport.emit(this.sportType);
  }
}
