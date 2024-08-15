import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TeamModel} from 'src/app/shared/models/team/team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';

@Component({
  selector: 'gs-teams',
  templateUrl: './gs-teams.component.html',
  styleUrls: ['./gs-teams.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsTeamsComponent extends FBKComponent {
  date: Date = new Date(Date.now());
  day: string;
  month: string;
  isTeamPlayersOn: boolean = false;
  isPlayerSelectorOn: boolean = false;
  teamToAddPlayersTo: number;
  @Input() game: GameModel;
  @Input() team: TeamModel;
  @Input() complex: ComplexModel;
  @Output() updateGoals = new EventEmitter();
  @Output() saveGameInLocalStorage = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsTeamsComponent');
  }

  fbkOnInit() {
    this.initDate();
  }

  fbkInputChanged() {
    if (this.game) {
      this.initIsTeamPlayersOn();
    }
  }

  initIsTeamPlayersOn() {
    if (this.game.startedAt && this.game.hasPlayers()) {
      this.isTeamPlayersOn = false;
    }
  }

  initDate() {
    this.day = this.date.getDate().toString();
    this.day = ('0' + this.day).slice(-2);
    this.month = Number(1 + this.date.getMonth()).toString();
    this.month = ('0' + this.month).slice(-2);
  }

  toggleTeamPlayers() {
    this.isTeamPlayersOn = !this.isTeamPlayersOn;
  }

  togglePlayerSelector() {
    this.isPlayerSelectorOn = !this.isPlayerSelectorOn;
  }

  displayPlayerSelector(teamIndex: number) {
    this.isPlayerSelectorOn = true;
    this.teamToAddPlayersTo = teamIndex;
  }

  removePlayerFromTeam(teamIndex: number, playerToRemoveId: string) {
    const teamToChange = this.game.teams[teamIndex];
    teamToChange.players = teamToChange.players.filter((player) => player.user._id != playerToRemoveId);
    this.updateGoals.emit();
    this.saveGameInLocalStorage.emit();
  }

  addPlayerToTeam(player) {
    this.togglePlayerSelector();
    this.game.teams[this.teamToAddPlayersTo].players.push(player);
    this.saveGameInLocalStorage.emit();
  }
}
