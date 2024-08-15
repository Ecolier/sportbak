import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FBKComponent } from '../../../shared/components/base.component';
import { GameModel } from '../../../shared/models/league/game.model';
import { ClickOnGameventEmitterModel, StartedAtOfGameUpdatedEventEmitterModel } from '../../../shared/models/league/games-planning-output.model';
import { LeagueTeam } from '../../../shared/models/league/league-team.model';
import { TranslateAppProvider } from '../../../shared/services/translate/translate.service';
import { getLeagueTeam } from "../../shared/helpers/competition.helper";


const MODE_NORMAL = 'normal';
const MODE_PAST = 'past'; //  to have only the games finished
const MODE_FUTURE = 'future'; //  to have only the upcoming games

@Component({
  selector: 'futbak-competitions-games-planning',
  templateUrl: 'games-planning.component.html',
  styleUrls: ['games-planning.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CompetitionsGamesPlanningComponent extends FBKComponent {
  // first array : phase (1st leg, 2nd leg, ...)
  // second array : day in phase (day n°1, n°2, ..)
  // third array : confrontations (games) in the day (game n°1, n°2, ...)
  // Exemple. To take the game n°X of the day n°Y of the phase n°Z. We have to do that : games[Z][Y][X]
  @Input() public games: GameModel[][][];
  @Input() public mode: 'normal' | 'past' | 'future' = 'normal';
  @Input() public teams: LeagueTeam[];
  @Input() public filterTeams: LeagueTeam[];
  @Input() compType:string;
  @Input() compName: string;
  @Input() league_id: string;
  @Output() startedAtOfGameUpdated = new EventEmitter<StartedAtOfGameUpdatedEventEmitterModel>();
  @Output() clickOnPendingGame = new EventEmitter<ClickOnGameventEmitterModel>();
  @Output() clickOnFinishedGame = new EventEmitter<ClickOnGameventEmitterModel>();

  gamesFiltered: GameModel[][][];
  showHidePhases: boolean[];
  showHideDays: boolean[][];
  nbConfrontationByPhases: number[];
  nbConfrontationByDays: number[][];

  numberOfConfrontation: number = 0;

  titlePhaseStyle: any = {};
  iconTitlePhaseStyle: any = {};
  titleDayStyle: any = {};
  iconTitleDayStyle: any = {};
  noGameTitleStyle: any = {};
  SORT_BUTTON: string[] = ['sort_by_date', 'sort_by_phase'];
  sortButtonTextIndex: number = 0;
  finishedGamesDatesList: Object[] = [];
  upcomingGamesDatesList: Object[] = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'CompetitionsGamesPlanningComponent');
  }

  fbkOnInit() {
    this.initVariables();
    this.SORT_BUTTON = ['sort_by_date', 'sort_by_phase'];
  }

  fbkAfterInit() {
  }

  fbkInputChanged(inputName: string, currentValue: any, lastValue: any) {
    this.initVariables();
    if (inputName == 'filterTeams') {
      if (this.filterTeams && this.filterTeams.length) {
        let oneExist = false;
        for (const team of this.filterTeams) {
          if (team != null) {
            oneExist = true;
            break;
          }
        }
        if (oneExist) {
          this.openAllTabs();
        }
      }
    }
  }

  initVariables() {
    const width = this.getWidth();
    this.numberOfConfrontation = 0;
    this.updateGamesFiltered();
    this.sortGamesByDate();
    this.titlePhaseStyle = this.getTitlePhaseStyle(width);
    this.iconTitlePhaseStyle = this.getIconTitlePhaseStyle(width);
    this.titleDayStyle = this.getTitleDayStyle(width);
    this.iconTitleDayStyle = this.getIconTitleDayStyle(width);
    this.noGameTitleStyle = this.getNoGameTitleStyle(width);

    this.numberOfConfrontation = this.getNumberOfConfrontations();
  }

  // ******************************************************* //
  // ****************** STYLE  ******************* //
  // ******************************************************* //

  getTitlePhaseStyle(width) {
    const style = {};

    style['height'] = 60 + 'px';
    style['lineHeight'] = 60 + 'px';
    style['fontSize'] = 35 + 'px';

    return style;
  }

  getIconTitlePhaseStyle(width) {
    const style = {};

    style['top'] = 10 + 'px';
    style['right'] = 20 + 'px';
    style['fontSize'] = 40 + 'px';

    return style;
  }

  getTitleDayStyle(width) {
    const style = {};

    style['height'] = 35 + 'px';
    style['lineHeight'] = 35 + 'px';
    style['fontSize'] = 20 + 'px';

    return style;
  }

  getIconTitleDayStyle(width) {
    const style = {};

    style['top'] = 7 + 'px';
    style['right'] = 15 + 'px';
    style['fontSize'] = 20 + 'px';

    return style;
  }

  getNoGameTitleStyle(width) {
    const style = {};

    style['height'] = 50 + 'px';
    style['fontSize'] = Math.floor(15 + 15 * width / 800) + 'px';

    return style;
  }

  // ******************************************************* //
  // ****************** GAME  ******************* //
  // ******************************************************* //


  gameIsFinished(game) {
    return game.status == 'complete';
  }

  gameIsFinishing(game) {
    return game.status == 'stop';
  }

  gameIsInError(game) {
    return game.status == 'error';
  }

  gameIsPending(game) {
    return game.status == 'pending';
  }

  gameIsCreated(game) {
    return game.status == 'created';
  }

  // ******************************************************* //
  // ****************** ACTIONS  ******************* //
  // ******************************************************* //

  openAllTabs() {
    if (this.showHidePhases) {
      for (let i = 0; i < this.showHidePhases.length; i++) {
        this.showHidePhases[i] = true;

        if (this.showHideDays && i < this.showHideDays.length) {
          for (let j = 0; j < this.showHideDays[i].length; j++) {
            this.showHideDays[i][j] = true;
          }
        }
      }
    }
  }

  showHidePhase(phaseIndex) {
    if (this.showHidePhases && phaseIndex < this.showHidePhases.length) {
      this.showHidePhases[phaseIndex] = this.showHidePhases[phaseIndex] ? false : true;
    }
  }

  showHideDay(phaseIndex, dayIndex) {
    if (this.showHideDays) {
      if (this.showHideDays[phaseIndex] && dayIndex < this.showHideDays[phaseIndex].length) {
        this.showHideDays[phaseIndex][dayIndex] = this.showHideDays[phaseIndex][dayIndex] ? false : true;
      }
    }
  }

  startedAtUpdated(date, game) {
    const output = new StartedAtOfGameUpdatedEventEmitterModel(date, game);
    this.startedAtOfGameUpdated.emit(output);
  }

  clikOnGame(game: GameModel) {
    if (this.gameIsCreated(game) || this.gameIsPending(game)) {
      if (game.devicesFutbakIsUsed) {
        const newGame = new GameModel(game);
        if (newGame && newGame.teams && newGame.teams.length) {
          for (let i = 0; i < newGame.teams.length; i++) {
            newGame.teams[i].from = getLeagueTeam(newGame, i, this.teams);
          }
          this.clickOnPendingGame.emit(new ClickOnGameventEmitterModel(newGame));
        }
      }
    } else if (this.gameIsFinishing(game) || this.gameIsFinished(game)) {
      this.clickOnFinishedGame.emit(new ClickOnGameventEmitterModel(game));
    } else if (this.gameIsInError(game)) {
      // TODO
    }
  }

  // ******************************************************* //
  // ****************** LEAGUE TEAM  ******************* //
  // ******************************************************* //

  getLeagueTeamId(game, teamIndex) {
    let result = null;
    if (game && game.teams && teamIndex < game.teams.length) {
      const team = game.teams[teamIndex];
      if (team && team.from) {
        if (typeof team.from == 'object') {
          result = team.from._id;
        } else if (typeof team.from == 'string') {
          result = team.from;
        }
      }
    }
    return result;
  }


  getLeagueTeams(game) {
    let teams = [getLeagueTeam(game, 0, this.teams), getLeagueTeam(game, 1, this.teams)];
    return teams;
  }

  // ******************************************************* //
  // ****************** FILTER  ******************* //
  // ******************************************************* //

  needToBeFiltered(game) {
    if (!game) {
      return true;
    }
    return this.needToBeFilteredByTeams(game) || this.needToBeFilteredByMode(game);
  }

  needToBeFilteredByTeams(game) {
    let result = false;

    if (this.filterTeams && this.filterTeams.length > 0) {
      result = true;
      const leagueTeamsid = [];
      for (let teamIndex = 0; teamIndex < game.teams.length; teamIndex++) {
        const leagueTeamId = this.getLeagueTeamId(game, teamIndex);
        leagueTeamsid.push(leagueTeamId);
      }

      for (const teamFilterd of this.filterTeams) {
        if (leagueTeamsid.find((leagueTeamId) => leagueTeamId == teamFilterd._id)) {
          result = false;
        } else {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  needToBeFilteredByMode(game) {
    let result = false;

    if (this.mode == MODE_PAST) {
      const statusAvailable = ['complete', 'stop', 'error'];
      if (statusAvailable.indexOf(game.status) < 0) {
        result = true;
      }
    } else if (this.mode == MODE_FUTURE) {
      const statusAvailable = ['created', 'pending', 'start'];
      if (statusAvailable.indexOf(game.status) < 0) {
        result = true;
      }
    }
    return result;
  }

  updateGamesFiltered() {
    this.gamesFiltered = [];
    this.showHidePhases = [];
    this.showHideDays = [];
    this.nbConfrontationByPhases = [];
    this.nbConfrontationByDays = [];
    if (this.games) {
      const phases = this.games;
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const newPhase = [];
        const daysShowHide = [];
        this.nbConfrontationByDays.push([]);
        for (let j = 0; j < phase.length; j++) {
          const day = phase[j];
          const newDay = [];
          for (const game of day) {
            if (!this.needToBeFiltered(game)) {
              newDay.push(game);
            }
          }
          newPhase.push(newDay);
          daysShowHide.push(false);
        }
        this.showHideDays.push(daysShowHide);
        this.showHidePhases.push(true);
        this.gamesFiltered.push(newPhase);
        this.nbConfrontationByPhases.push(this.getNumberOfConfrontationsInPhase(i));
        for (let j = 0; j < phase.length; j++) {
          this.nbConfrontationByDays[i].push(this.getNumbersOfConfrontationsInDay(i, j));
        }
      }

      // Show only the first day ba default
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (this.nbConfrontationByPhases[i] > 0) {
          let found = false;
          for (let j = 0; j < phase.length; j++) {
            if (this.nbConfrontationByDays[i][j] > 0) {
              this.showHideDays[i][j] = true;
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
    }

    this.sortGamesByDate();
  }

  isSameDay(day1: Date, day2: Date) {
    day1 = new Date(day1);
    day2 = new Date(day2);
    return (day1.getFullYear() == day2.getFullYear()) &&
      (day1.getMonth() == day2.getMonth()) &&
      (day1.getDay() == day2.getDay());
  }

  convertGamesToOneDimensionArray() {
    const allGames = [];
    for (let phaseIndex = 0; phaseIndex < this.gamesFiltered.length; phaseIndex++) {
      for (let dayIndex = 0; dayIndex < this.gamesFiltered[phaseIndex].length; dayIndex++) {
        allGames.push(...this.gamesFiltered[phaseIndex][dayIndex]);
      }
    }
    return allGames;
  }

  getGamesDays(gamesToSort: GameModel[], gamesSortedByDay: Object[]) {
    let currentDate = gamesToSort[0].startedAt;
    gamesSortedByDay = [{
      date: gamesToSort[0].startedAt,
      games: [gamesToSort.filter((game) => this.isSameDay(game['startedAt'], currentDate))],
      isVisible: true,
    }];

    for (let index = 1; index < gamesToSort.length; index++) {
      if (!this.isSameDay(gamesToSort[index].startedAt, currentDate)) {
        gamesSortedByDay.push({date: gamesToSort[index].startedAt, games: [], isVisible: true});
        currentDate = gamesToSort[index].startedAt;
      }
    }
    return gamesSortedByDay;
  }

  addGamesToEachDay(gamesToSort: GameModel[], gamesSortedByDay: Object[]) {
    for (let index = 0; index < gamesSortedByDay.length; index++) {
      gamesSortedByDay[index]['games'] = gamesToSort.filter(
          (game) => this.isSameDay(game.startedAt, gamesSortedByDay[index]['date']));
    }
    return gamesSortedByDay;
  }

  sortGamesByDate() {
    this.finishedGamesDatesList = [];
    this.upcomingGamesDatesList = [];
    const allGames = this.convertGamesToOneDimensionArray();
    const finishedGames = allGames.filter((game) => game.status == 'fin' || game.status == 'stop' || game.status == 'error' || game.status == 'complete');
    // finished games sorted by day
    finishedGames.sort((a, b) => (a.startedAt > b.startedAt) ? 1 : ((b.startedAt > a.startedAt) ? -1 : 0));

    if (finishedGames.length > 0) {
      this.finishedGamesDatesList = this.getGamesDays(finishedGames, this.finishedGamesDatesList);
      this.finishedGamesDatesList = this.addGamesToEachDay(finishedGames, this.finishedGamesDatesList);
    }

    const upcomingGames = allGames.filter((game)=> game.status== 'created' || game.status == 'pending');
    const upcomingGamesWithDate = upcomingGames.filter((game) => game.startedAt).sort((a, b) => (a.startedAt > b.startedAt) ? 1 : ((b.startedAt > a.startedAt) ? -1 : 0));
    const upcomingGamesWithoutDate = upcomingGames.filter((game) => !game.startedAt);

    if (upcomingGamesWithDate.length > 0) {
      this.upcomingGamesDatesList = this.getGamesDays(upcomingGamesWithDate, this.upcomingGamesDatesList);
      this.upcomingGamesDatesList = this.addGamesToEachDay(upcomingGamesWithDate, this.upcomingGamesDatesList);
    }
    this.upcomingGamesDatesList.push({date: 'No date', games: upcomingGamesWithoutDate, isVisible: true});
  }

  toggleGameDay(isFinishedGame: boolean, index: number) {
    if (isFinishedGame) {
      this.finishedGamesDatesList[index]['isVisible'] = !this.finishedGamesDatesList[index]['isVisible'];
    } else {
      this.upcomingGamesDatesList[index]['isVisible'] = !this.upcomingGamesDatesList[index]['isVisible'];
    }
  }

  // ******************************************************* //
  // ******************  TOTAL  ******************* //
  // ******************************************************* //

  getNumberOfConfrontations() {
    let counter = 0;
    const nbPhase = this.getNumbersOfPhases();
    for (let p = 0; p < nbPhase; p++) {
      counter += this.getNumberOfConfrontationsInPhase(p);
    }
    return counter;
  }

  // ******************************************************* //
  // ******************  PHASES  ******************* //
  // ******************************************************* //

  getNumbersOfPhases() {
    let result = 0;
    if (this.gamesFiltered) {
      result = this.gamesFiltered.length;
    }
    return result;
  }

  getPhase(index) {
    return this.gamesFiltered[index];
  }

  getNumberOfConfrontationsInPhase(index) {
    let counter = 0;
    const nbDay = this.getNumbersOfDays(index);
    for (let d = 0; d < nbDay; d++) {
      counter += this.getNumbersOfConfrontationsInDay(index, d);
    }
    return counter;
  }

  // ******************************************************* //
  // ******************  DAY  ******************* //
  // ******************************************************* //

  getNumbersOfDays(phaseIndex) {
    const phase = this.getPhase(phaseIndex);
    return phase.length;
  }

  getDay(phaseIndex, dayIndex) {
    const phase = this.getPhase(phaseIndex);
    return phase[dayIndex];
  }

  // ******************************************************* //
  // ******************  CONFRONTATIONS  ******************* //
  // ******************************************************* //

  getNumbersOfConfrontationsInDay(phaseIndex, dayIndex) {
    const day = this.getDay(phaseIndex, dayIndex);
    return day.length;
  }

  getConfrontation(phaseIndex, dayIndex, confrontationIndex) {
    const day = this.getDay(phaseIndex, dayIndex);
    return day[confrontationIndex];
  }

  toggleSortButton() {
    this.sortButtonTextIndex = this.sortButtonTextIndex === 0 ? 1 : 0;
    this.sortGamesByDate();
  }

  formatDate(date: Date) {
    const theDate = new Date(date);
    if ( !isNaN(theDate.getDay())) {
      return theDate.getDate() + '/' + (theDate.getMonth()+1) +'/' + theDate.getFullYear();
    }
    return this.getTranslation('no_dates');
  }
}
