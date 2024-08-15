import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SportConstants} from 'src/app/shared/values/sport';
import {FBKComponent} from '../../../shared/components/base.component';


@Component({
  selector: 'gs-game-actions',
  templateUrl: './gs-game-actions.component.html',
  styleUrls: ['./gs-game-actions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsGameActionsComponent extends FBKComponent {
  sportConstants = SportConstants;
  isGameEndValidModalOn: boolean = false;
  hasGameStarted: boolean = false;
  @Input() game: GameModel;
  @Input() isShowingUpdateAlert: boolean;
  @Input() isShowingErrorAlert:boolean;
  @Input() isTimerPaused: boolean;
  @Input() sets: number[];
  @Output() startTimer = new EventEmitter();
  @Output() toggleTimerPause = new EventEmitter();
  @Output() updateGame = new EventEmitter();
  @Output() updateAlert = new EventEmitter();
  @Output() endGame = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsGameActionsComponent');
  }
  fbkOnInit() {
  }

  onStartClick() {
    this.hasGameStarted = true;
    this.game.startGame();
    this.startTimer.emit();
  }
  onPauseClick() {
    this.toggleTimerPause.emit();
  }
  onResumeClick() {
    this.toggleTimerPause.emit();
  }

  toggleGameEndValidModal() {
    this.isGameEndValidModalOn = !this.isGameEndValidModalOn;
  }

  validateGameEnd() {
    this.isGameEndValidModalOn = false;
    this.endGame.emit();
  }
}
