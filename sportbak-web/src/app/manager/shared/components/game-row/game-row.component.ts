import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ManagerProvider } from "src/app/manager/shared/services/manager.service";
import { CompetitionService } from "src/app/manager/shared/services/competition.service";
import { FBKComponent } from "src/app/shared/components/base.component";
import { ComplexModel } from "src/app/shared/models/complex/complex.model";
import { FBKModel } from "src/app/shared/models/futbak-parent-model";
import { GameModel } from "src/app/shared/models/league/game.model";
import { LeagueTeam } from "src/app/shared/models/league/league-team.model";
import { TranslateAppProvider } from "src/app/shared/services/translate/translate.service";
import { FBKStaticUrls } from "src/app/shared/values/static-urls";
import {ApplicationErrorsIds, showError} from 'src/app/manager/shared/helpers/manager-errors.helper';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";
import { SportConstants, SportType } from 'src/app/shared/values/sport';

let staticShirtUrl = FBKStaticUrls.shirt.base;

@Component({
  selector: 'futbak-game-row',
  templateUrl: 'game-row.component.html',
  styleUrls: ['game-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class GameRowComponent extends FBKComponent {
  @Input() public game: GameModel;
  @Input() public teams: LeagueTeam[];
  @Input() public showPlaygroundName: boolean = false;
  @Input() league_id: string;
  @Input() tournament_id: string;
  @Input() compType:string;
  @Input() compName: string;
  @Input() size: string = '';
  @Output() startedAtUpdated = new EventEmitter<Date>();
  public readonly minuteValues: string = "0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55";
  public datenow: string;
  public datemax: string;
  public gameStartedAtStr: string;
         isGameSelected: boolean;
  public playgroundName: string = null;
  public vsIsEnabled: boolean = false;
  public scoreIsEnabled: boolean = true;
  public urlTeamShirt1: string = null;
  public urlTeamShirt2: string = null;
  public enableTeamShirts: boolean = false;
  public date: string = '';
  public infos: string = '';
  public complex: ComplexModel;
  public shirtStyle: any = {};
  public dateFontSize: number = 20;
  isFromManager: boolean = false;
  debugMode: boolean;
  scoreTeam1: any;
  scoreTeam2: any;
  set1Team1:number = 0;
  set2Team1:number = 0;
  set3Team1:number = 0;
  set1Team2:number = 0;
  set2Team2:number = 0;
  set3Team2:number = 0;
  isShowingValidationModal: boolean = false;
  isShowingStartedModal: boolean = false;
  checkIfStarted: boolean = false;
  sportConstants = SportConstants;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    private managerProvider: ManagerProvider,
    private competitionService: CompetitionService,
    private eventProvider : SBKEventsProvider
  ) {
    super(_refElement, translate, 'GameRowComponent');
  }

  fbkOnInit() {
    this.initDates();
    this.initVariables();
    this.initIsFromManager();
    this.checkDebugMode();
  }

  async initVariables() {
    const width = this.getWidth();

    if (this.game) {
      if (this.game.status == 'pending' || this.game.status == 'created') {
        this.scoreIsEnabled = false;
      }
      this.vsIsEnabled = !this.scoreIsEnabled;
      this.urlTeamShirt1 = this.getUrlTeamShirt(0);
      this.urlTeamShirt2 = this.getUrlTeamShirt(1);
      this.enableTeamShirts = (this.urlTeamShirt1 && this.urlTeamShirt2) ? true : false;
    }
    this.infos = this.getInfoGame(this.game);
    this.date = this.getDatesOfGameToCreate();

    if (this.game && this.game.playground) {
      if (FBKModel.isFBKModel(this.game.playground) && this.game.playground['name']) {
        this.playgroundName = this.game.playground['name'];
      }
    }

    this.shirtStyle = this.getShirtStyle(width);
    this.dateFontSize = this.getDateFontSize(width);
  }

  initDates() {
    const dateinter: Date = new Date();
    this.datenow = moment(dateinter).format();
    dateinter.setFullYear(dateinter.getFullYear() + 5);
    this.datemax = moment(dateinter).format();
  }

  fbkInputChanged?(inputName: string, currentValue: any, lastValue: any) {
    this.initDates();
    this.initVariables();
  }

  getShirtStyle(width) {
    const style = {};
    style['width'] = Math.floor(width / 12) + 'px';
    return style;
  }

  getDateFontSize(width) {
    return Math.floor(2 / 125.0 * width + 5.2);
  }

  focusingDate() {
    this.initDates();
  }

  updateDate(newDate) {
    let date = new Date(newDate);
    const offset = date.getTimezoneOffset() * 60000;
    date = new Date(date.getTime() + offset);
    this.game.startedAt = date;
    this.startedAtUpdated.emit(date);
  }

  getHourFromDate(date) {
    const lang = this.translate.getLanguage();
    let result: string = date.toLocaleTimeString(lang);
    const index = result.lastIndexOf(':');
    result = result.substring(0, index) + result.substring(index + 3);
    return result;
  }

  getDatesOfGameToCreate() {
    if (this.game && this.game.startedAt) {
      return this.getDatesOfGame();
    }
    return this.getTranslation('updateStartedAt');
  }

  getDatesOfGame() {
    return this.showDates(this.game.startedAt, this.game.endedAt);
  }

  showDates(start, end = null) {
    let result = '-';
    const lang = this.translate.getLanguage();

    if (start) {
      start = new Date(start);
      result = start.toLocaleDateString(lang, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
      if (end) {
        end = new Date(end);
        result += ' - ' + this.getHourFromDate(start) + ' ' + this.getTranslation('dateTo') + ' ' + this.getHourFromDate(end);
      } else {
        result += ' ' + this.getTranslation('dateTo') + ' ' + this.getHourFromDate(start);
      }
    }
    return result;
  }


  getUrlTeamShirt(index) {
    let result = null;
    if (this.game) {
      const teams = this.game.teams;
      if (teams && teams.length > index) {
        const team = teams[index];
        if (team.from) {
          if (typeof team.from == 'object') {
            result = team.from.shirt;
          }
        }
      }
    }

    if (!result) {
      if (this.teams && this.teams.length > index) {
        if (this.teams[index]) {
          result = this.teams[index].shirt;
        }
      }
    }

    if (result) {
      result = staticShirtUrl + result;
    }
    return result;
  }

  public getCountOfPlayers(game): number {
    let count = 0;
    if (game) {
      if (game.teams && game.teams.length > 1) {
        for (const team of game.teams) {
          if (team && team.players) {
            count += team.players.length;
          }
        }
      }
    }
    return count;
  }

  getInfoGame(game) {
    let result = '';
    if (game) {
      const countOfPlayers = this.getCountOfPlayers(game);
      result = 'plugged : ' + game.devicesPlugged.length + '/' + countOfPlayers + ' - downloaded : ' + game.devicesDownloaded.length + '/' + countOfPlayers + ' - downloading : ' + game.downloadDataStatus + ' - billable : ' + game.billable;
    }
    return result;
  }

  initIsFromManager() {
    this.isFromManager = this.router.url.includes('manager');
  }

  onGameClick() {
    this.isGameSelected = true
  }
  onGamesheet(){
    this.complex = new ComplexModel(this.managerProvider.getComplex());
    if (this.complex && this.isFromManager) {
      localStorage.setItem('currentGame', JSON.stringify(this.game));
      localStorage.setItem('currentComplex', JSON.stringify(this.complex));
      if (this.league_id) {
        this.router.navigate(['/manager/game-sheet'], {queryParams: {game_id: this.game._id, league_id: this.league_id}});
      }
      if (this.tournament_id) {
        this.router.navigate(['/manager/game-sheet'], {queryParams: {game_id: this.game._id, tournament_id: this.tournament_id}});
      }
    }

  }
  onClickedOutside(e: Event){
    this.isGameSelected = false
  }
  checkDebugMode() {
    if (this.route.snapshot.queryParams['debug']) {
      this.debugMode = true;
    }
  }

  redirectToCalendar() {
    if (!this.game.isGameFinished()) {
      this.router.navigate(['/manager/calendar'], {queryParams: {game_id: this.game._id, comp_name: this.compName, comp_type: this.compType}});
    }
  }
  updateScoreTeam1(value) {
    this.scoreTeam1 = value;
  }
  updateScoreTeam2(value) {
    this.scoreTeam2 = value;
  }

  updateGame(){
    if (this.game.status == "start" && this.checkIfStarted == false) {
      this.isShowingStartedModal = true;
    }else{
          let scores
          if (this.sportConstants[this.game.sport].hasGoals && this.scoreTeam1 >= 0 && this.scoreTeam2 >= 0) {
            scores = { 
              goalsTeam1: this.scoreTeam1,
              goalsTeam2: this.scoreTeam2
            }
          }
          if (this.sportConstants[this.game.sport].hasSets) {
            scores = { 
              setsTeam1: [this.set1Team1,this.set2Team1,this.set3Team1],
              setsTeam2: [this.set1Team2,this.set2Team2,this.set3Team2]
            }
          }
          this.competitionService.patchDirectGame(this.game._id,scores).subscribe({
            next: result => {},
            error: error => showError(error, ApplicationErrorsIds.games.error_patching_game_date)
          });
          this.eventProvider.publish(SBKEventsIds.updateCompetitionGame, true)
      }
  }

  validateStartedModal(){
    this.checkIfStarted = true
    this.updateGame()
    this.isShowingStartedModal = !this.isShowingStartedModal
  }

  cancelStartedModal(){
    this.isShowingStartedModal = !this.isShowingStartedModal
  }

  fbkOnDestroy() {
    this.eventProvider.unsubscribeAllTopics(this);
  }
}
