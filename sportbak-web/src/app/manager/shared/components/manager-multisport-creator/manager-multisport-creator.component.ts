import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-multisport-creator',
  templateUrl: './manager-multisport-creator.component.html',
  styleUrls: ['./manager-multisport-creator.component.scss'],
})
export class ManagerMultisportCreatorComponent extends FBKComponent {
  @Input() complex: ComplexModel;
  @Output() onBackClick = new EventEmitter();
  @Output() sportCreation = new EventEmitter();
  sport: string;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerLeagueCreatorComponent');
  }
  fbkOnInit() {

  }

  selectSportCreation(sport) {
    this.sport = sport;
    this.sportCreation.emit(this.sport);
  }
}
