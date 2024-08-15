import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SportConstants} from 'src/app/shared/values/sport';
import {LocalGameSave} from '../shared/helpers/local-game-save';

const UPDATE_ALERT_TIME = 1200;

@Component({
  selector: 'manager-game-sheet',
  templateUrl: './manager-game-sheet.component.html',
  styleUrls: ['./manager-game-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerGameSheetComponent extends FBKComponent {
  sportConstants = SportConstants;
  game: GameModel;
  complex: ComplexModel;
  timerMinutes: number;
  timerSeconds: number;
  isTimerPaused: boolean;
  leagueId: string = '';
  playoff: boolean;
  tournamentId: string = '';
  isShowingUpdateAlert: boolean;
  isShowingErrorAlert: boolean = false;
  validationStep: number = undefined;
  TIME_VALIDATION: number = 0;
  FIELD_VALIDATION: number = 1;
  SCORE_VALIDATION: number = 2;
  updateInterval:any;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
    private _router: Router,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'ManagerGameSheetComponent');
  }

  fbkOnInit() {
    if (this.route.snapshot.queryParams['game_id'] && this.route.snapshot.queryParams['game_id'].length > 0) {
      this.initVariables(this.route.snapshot.queryParams['game_id']);
      window.scrollTo(0, document.body.scrollHeight);
    } else if (this.route.snapshot.queryParams['booking_id'] && this.route.snapshot.queryParams['booking_id'].length > 0) {
      this.initVariables(this.route.snapshot.queryParams['game_id']);
    } else {
      this._router.navigate(['/manager/']);
    }
    this.updateInterval = setInterval(() => {
      this.updateGame();
    }, 60000);
  }

  fbkOnDestroy() {
    clearInterval(this.updateInterval);
  }

  initVariables(gameId: string) {
    this.complex = this.managerProvider.getComplex();
    const gameInCache: LocalGameSave = JSON.parse(localStorage.getItem(gameId));
    if (gameInCache) {
      this.game = new GameModel(gameInCache.game);
    } else {
      this.initializeGame();
    }
    this.timerMinutes = 0;
    this.timerSeconds = 0;
    this.isTimerPaused = false;
    this.isShowingUpdateAlert = false;
    this.initializeLeague();
    this.initializeTournament();
    this.initializeUpdate();
  }

  initializeGame() {
    if (this.route.snapshot.queryParams['game_id']) {
      const gameId = this.route.snapshot.queryParams['game_id'];
      this.managerProvider.getGameById(gameId).subscribe((response) => {
        this.game = new GameModel(response);
        this.initializeTeams();
        this.initializePlayers();
        this.updateGoals();
      }, (error) => {
        this.isShowingErrorAlert = true;
        console.log(error);
      });
    } else {
      this.game = new GameModel();
    }
  }

  initializeTeams() {
    if (this.game.teams[0].players.length < 1 && this.game.teams[1].players.length < 1) {
      this.game.teams.forEach((team) => {
        const fromTeam = team.from as LeagueTeam;
        if (fromTeam) {
          team.setPlayers(fromTeam.getPlayersFromUsers());
        }
      });
    }
  }

  initializePlayers() {
    this.game.players.forEach((player) => {
      const playerFromTeam = this.game.teams[player.team].players.find((tPlayer) => tPlayer.user._id == player.user._id);
      if (playerFromTeam) {
        playerFromTeam.setGoals(player.goals);
        playerFromTeam.setAssists(player.assists);
        playerFromTeam.setFouls(player.fouls);
        playerFromTeam.setYellowCards(player.yellowcards);
        playerFromTeam.setRedCards(player.redcards);
        playerFromTeam.setOwnGoals(player.owngoals);
      }
    });
  }

  initializeLeague() {
    if (this.route.snapshot.queryParams['league_id'] && this.route.snapshot.queryParams['league_id'].length > 0) {
      this.leagueId = this.route.snapshot.queryParams['league_id'];
    }
  }

  initializeTournament() {
    if (this.route.snapshot.queryParams['tournament_id'] && this.route.snapshot.queryParams['tournament_id'].length > 0) {
      this.tournamentId = this.route.snapshot.queryParams['tournament_id'];
    }
    if (this.route.snapshot.queryParams['playoff']) {
      this.playoff = this.route.snapshot.queryParams['playoff'];
    }
  }

  initializeUpdate() {
    if (this.game && !this.game.isGameFinished()) {
      this.updateInterval = setInterval(() => {
        this.updateGame();
      }, 60000);
    }
  }

  updateGoals() {
    if (this.game.isScoreFromPlayerGoals) {
      this.game.teams[0].goals = this.game.teams[0].players.reduce((startValue, player) => startValue + player.goals, 0) +
        this.game.teams[1].players.reduce((startValue, player) => startValue + player.owngoals, 0);
      this.game.teams[1].goals = this.game.teams[1].players.reduce((startValue, player) => startValue + player.goals, 0) +
        this.game.teams[0].players.reduce((startValue, player) => startValue + player.owngoals, 0);
    }
  }

  startTimer() {
    setInterval(() => {
      this.incrementTimer();
    }, 1000);
  }

  showUpdateAlert() {
    this.isShowingErrorAlert = false;
    this.isShowingUpdateAlert = true;
    setTimeout(() => {
      this.isShowingUpdateAlert = false;
    }, UPDATE_ALERT_TIME);
  }

  incrementTimer() {
    if (!this.isTimerPaused) {
      if (this.timerSeconds == 59) {
        this.timerMinutes = this.timerMinutes + 1;
        this.timerSeconds = 0;
      } else {
        this.timerSeconds = this.timerSeconds + 1;
      }
    }
  }

  toggleTimerPause() {
    this.isTimerPaused = !this.isTimerPaused;
  }

  startValidation() {
    this.validationStep = this.TIME_VALIDATION;
    if (this.sportConstants[this.game.sport].hasGoals && !this.game.teams[0].goals ) {
      this.game.teams[0].goals = 0;
    }
    if (this.sportConstants[this.game.sport].hasGoals && !this.game.teams[1].goals ) {
      this.game.teams[1].goals = 0;
    }
  }

  resetValidation() {
    this.validationStep = undefined;
  }

  setStartTime(timeData) {
    this.game.setStartedAt(timeData['hours'], timeData['minutes']);
    if (!this.complex.fields || this.complex.fields.length < 1 || this.game.field ) {
      this.validationStep = this.SCORE_VALIDATION;
    } else if (this.route.snapshot.queryParams['field_id']) {
      this.game.field = this.route.snapshot.queryParams['field_id'];
      this.validationStep = this.SCORE_VALIDATION;
    } else {
      this.validationStep = this.FIELD_VALIDATION;
    }
  }

  setField(fieldData) {
    this.game.field = fieldData.field._id;
    this.validationStep = this.SCORE_VALIDATION;
  }

  setGoals(goalsData) {
    this.game.teams[0].goals = goalsData.team1Goals;
    this.game.teams[1].goals = goalsData.team2Goals;
    this.endGame();
  }

  updateTeamScore(teamScoreData) {
    if (this.sportConstants[this.game.sport].hasGoals) {
      const teamIndex = teamScoreData['team'];
      const goals = teamScoreData['goals'];
      this.game.teams[teamIndex].setGoals(goals);
      this.game.setIsScoreFromPlayerGoals(false);
    }
    if (this.sportConstants[this.game.sport].hasSets) {
      const gamesTeam1 = teamScoreData['team1Games'];
      const gamesTeam2 = teamScoreData['team2Games'];
      this.game.teams[0].setSets(gamesTeam1);
      this.game.teams[1].setSets(gamesTeam2);
    }
  }

  updateGame() {
    this.saveGameInLocalStorage();
    this.game.devicesFutbakIsUsed = false;
    if (this.route.snapshot.queryParams['booking_id'] && !this.game._id) {
      this.managerProvider.patchGameWithBooking(this.route.snapshot.queryParams['booking_id'], this.game).subscribe((response) => {
        this.game._id = response['result']['target'];
      }, (error) => {
        this.isShowingErrorAlert = true;
        console.log(error);
      });
    } else {
      this.managerProvider.patchGame(this.game._id, this.game).subscribe((response) => {
      }, (error) => {
        this.isShowingErrorAlert = true;
        console.log(error);
      });
    }
  }

  endGame() {
    this.game.endGame();
    this.deleteGameFromLocalStorage();
    this.game.devicesFutbakIsUsed = false;
    if (this.route.snapshot.queryParams['booking_id'] && !this.game._id) {
      this.managerProvider.patchGameWithBooking(this.route.snapshot.queryParams['booking_id'], this.game).subscribe((response) => {
        this.isShowingErrorAlert = false;
        this.game._id = response['result']['target'];
        this.leaveGameSheet();
      }, (error) => {
        this.isShowingErrorAlert = true;
        console.log(error);
      });
    } else {
      this.managerProvider.patchGame(this.game._id, this.game).subscribe((response) => {
        this.isShowingErrorAlert = false;
        this.leaveGameSheet();
      }, (error) => {
        this.isShowingErrorAlert = true;
        console.log(error);
      });
    }
  }

  leaveGameSheet() {
    if (this.leagueId && this.leagueId.length > 0) {
      this._router.navigate(['/manager/leagues/details'], {queryParams: {league_id: this.leagueId}});
    } else if (this.tournamentId && this.tournamentId.length > 0) {
      if (this.playoff) {
        this._router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: this.tournamentId, tab: 1}});
      } else {
        this._router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: this.tournamentId}});
      }
    } else {
      this._router.navigate(['/manager/day']);
    }
  }

  saveGameInLocalStorage() {
    localStorage.setItem(this.game._id, JSON.stringify(new LocalGameSave(this.game, this.complex)));
  }

  deleteGameFromLocalStorage() {
    localStorage.removeItem(this.game._id);
  }
}
