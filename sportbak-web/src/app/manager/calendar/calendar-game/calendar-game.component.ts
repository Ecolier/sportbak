import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'calendar-game',
  templateUrl: './calendar-game.component.html',
  styleUrls: ['./calendar-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarGameComponent extends FBKComponent {
  @Input() game:GameModel;
  @Input() competition: string;
  @Input() type: string;
  @Output() setGame = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() { }

  selectGame(game) {
    this.setGame.emit({game: game, competition: this.competition, type: this.type});
    document.getElementsByClassName('day-calendar-ctn')[0].scroll(0, 0);
  }
}
