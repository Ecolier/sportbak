import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';

@Component({
  selector: 'gs-fouls',
  templateUrl: './gs-fouls.component.html',
  styleUrls: ['./gs-fouls.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsFoulsComponent extends FBKComponent {
  isFoulsModalOn: boolean = false;
  team1FoulPlayers: number[] = [];
  team2FoulPlayers: number[] = [];
  selectedTeam: number = 0;
  @Input() game: GameModel;
  @Output() saveGameInLocalStorage = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsFoulsComponent');
  }

  fbkOnInit() {
  }

  displayFoulsModal(index) {
    this.isFoulsModalOn = true;
  }

  hideFoulsModal() {
    this.isFoulsModalOn = false;
  }

  setSelectedTeam(newSelectedTeamIndex: number) {
    this.selectedTeam = newSelectedTeamIndex;
  }

  increasePlayerFouls(playerIndex: number) {
    this.game.teams[this.selectedTeam].players[playerIndex].addFoul();
    this.saveGameInLocalStorage.emit();
  }

  decreasePlayerFouls(playerIndex: number) {
    this.game.teams[this.selectedTeam].players[playerIndex].removeFoul();
    this.saveGameInLocalStorage.emit();
  }

  onYellowCardClick(playerIndex: number) {
    const player = this.game.teams[this.selectedTeam].players[playerIndex];
    if (player.yellowcards == 2) {
      player.resetYellowCards();
    } else if (player.yellowcards < 2) {
      player.addYellowCard();
    }
    this.saveGameInLocalStorage.emit();
  }

  onRedCardClick(playerIndex: number) {
    const player = this.game.teams[this.selectedTeam].players[playerIndex];
    if (player.redcards > 0) {
      player.resetRedCards();
    } else if (player.redcards < 1) {
      player.addRedCard();
    }
    this.saveGameInLocalStorage.emit();
  }

  validateFouls() {
    this.hideFoulsModal();
  }
}
