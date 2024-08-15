import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TeamModel} from 'src/app/shared/models/team/team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SportConstants} from 'src/app/shared/values/sport';
import {FBKComponent} from '../../../shared/components/base.component';

@Component({
  selector: 'gs-score-editor',
  templateUrl: './gs-score-editor.component.html',
  styleUrls: ['./gs-score-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsScoreEditorComponent extends FBKComponent {
  sportConstants = SportConstants;
  isGoalSelectorOn: boolean = false;
  selectedTeam: TeamModel;
  otherTeam: TeamModel;
  ownGoalPlayerIndex: number = undefined;
  isDisplayingOwnGoals: boolean = false;
  @Input() team1Goals: number;
  @Input() team2Goals: number;
  @Input() sets: number[];
  team1Games: number = 0;
  team2Games: number = 0;
  maxGames: number;
  maxSets: number;
  scoreTeam1: number;
  scoreTeam2: number;
  team1Sets: number[];
  team2Sets: number[];
  @Input() minutes: number;
  @Input() seconds: number;
  @Input() isTimerPaused: boolean;
  @Input() game: GameModel;
  @Output() updateGoals = new EventEmitter();
  @Output() updateTeamScore = new EventEmitter();
  @Output() saveGameInLocalStorage = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsScoreEditorComponent');
  }

  fbkOnInit() {
    this.maxGames = this.sportConstants[this.game.sport].maxGames;
    this.maxSets = this.sportConstants[this.game.sport].setsNumber;
    this.team1Sets = this.game.teams[0].sets;
    this.team2Sets = this.game.teams[1].sets;
    this.iniScore();
  }

  displayGoalSelector(selectedTeamIndex: number) {
    if (this.sportConstants[this.game.sport].hasGoals) {
      this.selectedTeam = this.game.teams[selectedTeamIndex];
      this.isGoalSelectorOn = true;
      const otherTeamIndex = selectedTeamIndex == 0 ? 1 : 0;
      this.otherTeam = this.game.teams[otherTeamIndex];
    }
  }

  hideGoalSelector() {
    this.isGoalSelectorOn = false;
    this.isDisplayingOwnGoals = false;
  }

  toggleIsDisplayingOwnGoals() {
    this.isDisplayingOwnGoals = !this.isDisplayingOwnGoals;
  }

  updateOwnGoalPlayerIndex(index: number) {
    this.ownGoalPlayerIndex = index == this.ownGoalPlayerIndex ? undefined : index;
  }

  cancelGoalSelector() {
    this.hideGoalSelector();
  }

  increasePlayerGoals(playerIndex: number) {
    this.selectedTeam.players[playerIndex].addGoal();
    this.saveGameInLocalStorage.emit();
  }

  decreasePlayerGoals(playerIndex: number) {
    this.selectedTeam.players[playerIndex].removeGoal();
    this.saveGameInLocalStorage.emit();
  }

  increasePlayerAssists(playerIndex: number) {
    this.selectedTeam.players[playerIndex].addAssist();
    this.saveGameInLocalStorage.emit();
  }

  decreasePlayerAssists(playerIndex: number) {
    this.selectedTeam.players[playerIndex].removeAssist();
    this.saveGameInLocalStorage.emit();
  }

  increasePlayerOwnGoals(playerIndex: number) {
    this.otherTeam.players[playerIndex].addOwnGoal();
    this.saveGameInLocalStorage.emit();
  }

  decreasePlayerOwnGoals(playerIndex: number) {
    this.otherTeam.players[playerIndex].removeOwnGoal();
    this.saveGameInLocalStorage.emit();
  }

  onTeamGoalsChange(teamIndex, value) {
    if (value >= 0) {
      this.updateTeamScore.emit({team: teamIndex, goals: value});
      this.saveGameInLocalStorage.emit();
    }
  }
  onValidateSet() {
    if (this.maxGames && this.sets.length < this.maxSets && (this.team1Games !== this.maxGames || this.team2Games !== this.maxGames) && this.team1Games !== this.team2Games) {
      this.updateTeamScore.emit({team2Games: this.team2Games, team1Games: this.team1Games});
      this.saveGameInLocalStorage.emit();
      this.team1Games = 0;
      this.team2Games = 0;
      this.iniScore();
    }
  }

  validateGoalSelector() {
    this.hideGoalSelector();
    this.updateGoals.emit();
  }

  increaseGames(teamIndex) {
    if (teamIndex == 0 && this.team1Games < this.sportConstants[this.game.sport].maxGames) {
      this.team1Games += 1;
    }
    if (teamIndex == 1 && this.team2Games < this.sportConstants[this.game.sport].maxGames) {
      this.team2Games += 1;
    }
  }
  decreaseGames(teamIndex) {
    if (teamIndex == 0 && this.team1Games > 0) {
      this.team1Games -= 1;
    }
    if (teamIndex == 1 && this.team2Games > 0) {
      this.team2Games -= 1;
    }
  }
  removeSet(indexSet) {
    this.game.teams[1].deleteSet(indexSet);
    this.game.teams[0].deleteSet(indexSet);
    this.iniScore();
  }
  iniScore() {
    this.scoreTeam1 = 0;
    this.scoreTeam2 = 0;
    for (let index = 0; index < this.game.teams[0].sets.length; index++) {
      if (this.game.teams[0].sets[index] > this.game.teams[1].sets[index]) {
        this.scoreTeam1 += 1;
      } else {
        this.scoreTeam2 += 1;
      }
    }
  }
  onInputSetChange() {
    this.iniScore();
  }
}
