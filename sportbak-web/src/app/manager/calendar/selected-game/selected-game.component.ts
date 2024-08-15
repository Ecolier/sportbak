import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'selected-game',
  templateUrl: './selected-game.component.html',
  styleUrls: ['./selected-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectedGameComponent extends FBKComponent {
  @Input() selectedGame: any;
  @Output() resetSelectedGame = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {}

  closeGameSelection() {
    this.resetSelectedGame.emit();
  }
}
