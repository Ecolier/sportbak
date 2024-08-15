import * as _ from 'lodash';
import {SportConstants, SportType} from 'src/app/shared/values/sport';
import {BookingModel} from '../booking.model';
import {ComplexModel} from '../complex/complex.model';
import {PlaygroundModel} from '../complex/playground.model';
import {FBKModel, ObjectId} from '../futbak-parent-model';
import {TeamModel} from '../team/team.model';
import {PlayerModel} from '../user/player.model';
import {UserModel} from '../user/user.model';
import {GameHistoryModel} from './game-history.model';

const _default = {
  _id: null,
  createdAt: null,
  startedAt: null,
  competition: null,
  endedAt: null,
  stoppedAt: null,
  status: null,
  playground: null,
  teams: [null],
  players: null,
  devicesPlugged: null,
  devicesDownloaded: null,
  doorIsLocked: null,
  code: null,
  gamePendingPlayers: null,
  gamePlayers: null,
  timer: null,
  createdBy: null,
  downloadDataStatus: null,
  devicesFutbakIsUsed: null,
  billable: null,
  mode: null,
  history: null,
  complex: null,
  buzzTimeStamps: null,
  field: null,
  isScoreFromPlayerGoals: true,
  booking: null,
  sport: SportConstants.default,
};

class BuzzTimeStamps {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
}

export class GameModel extends FBKModel {
  public _id: string;
  public createdAt: Date;
  public startedAt: Date;
  public competition: string;
  public endedAt: Date;
  public stoppedAt: Date;
  public status: string;
  public playground: PlaygroundModel;
  public complex: ObjectId | ComplexModel
  public teams: TeamModel[];
  public players: PlayerModel[];
  public devicesPlugged: string[];
  public devicesDownloaded: string[];
  public doorIsLocked: boolean;
  public code?: number;
  public gamePendingPlayers: PlayerModel[];
  public gamePlayers: PlayerModel[];
  public timer: number;
  public createdBy: UserModel;
  public downloadDataStatus: string;
  public devicesFutbakIsUsed: boolean;
  public billable: boolean;
  public mode: any;
  public history: GameHistoryModel;
  public buzzTimeStamps: BuzzTimeStamps[];
  public field: string;
  public isScoreFromPlayerGoals: boolean;
  public booking: BookingModel;
  public sport: SportType;

  constructor(data: any = {}) {
    super(data, _default);
    this.booking = new BookingModel(data['booking']);
  }

  public onBeforePatch() {
  }
  public onAfterPatch() {
    if (this.teams && this.teams.length > 1) {
      const teams = [];
      for (let i = 0; i < this.teams.length; i++) {
        teams.push(new TeamModel(this.teams[i]));
      }
      this.teams = teams;
    } else {
      this.teams = [new TeamModel({title: 'Team 1'}), new TeamModel({title: 'Team 2'})];
    }

    if (this.players && this.players.length) {
      const players = [];
      for (let i = 0; i < this.players.length; i++) {
        if (FBKModel.needToBeConvertToFBKModel(this.players[i])) {
          players.push(new PlayerModel(this.players[i]));
        }
      }
      this.players = players;
    }

    if (this.gamePendingPlayers && this.gamePendingPlayers.length) {
      const gamePendingPlayers = [];
      for (let i = 0; i < this.gamePendingPlayers.length; i++) {
        if (FBKModel.needToBeConvertToFBKModel(this.gamePendingPlayers[i])) {
          gamePendingPlayers.push(new PlayerModel(this.gamePendingPlayers[i]));
        }
      }
      this.gamePendingPlayers = gamePendingPlayers;
    }

    if (this.gamePlayers && this.gamePlayers.length) {
      const gamePlayers = [];
      for (let i = 0; i < this.gamePlayers.length; i++) {
        if (FBKModel.needToBeConvertToFBKModel(this.gamePlayers[i])) {
          gamePlayers.push(new PlayerModel(this.gamePlayers[i]));
        }
      }
      this.gamePlayers = gamePlayers;
    }

    if (FBKModel.needToBeConvertToFBKModel(this.history)) {
      this.history = new GameHistoryModel(this.history);
    }

    if (FBKModel.needToBeConvertToFBKModel(this.complex)) {
      this.complex = new ComplexModel(this.complex);
    }

    if (FBKModel.needToBeConvertToFBKModel(this.playground)) {
      this.playground = new PlaygroundModel(this.playground);
    }
    this.buzzTimeStamps = [];

    if (this.teams && this.teams[0] && this.teams[1]) {
      this.checkIsScoreFromPlayerGoals();
    }
  }

  checkIsScoreFromPlayerGoals() {
    if (this.teams[0].getPlayerGoals() != this.teams[0].goals || this.teams[1].getPlayerGoals() != this.teams[1].goals) {
      this.isScoreFromPlayerGoals = false;
    }
  }

  public getWinner(): TeamModel {
    if (this.teams[0].goals > this.teams[1].goals) {
      return this.teams[0];
    }
    if (this.teams[0].goals < this.teams[1].goals) {
      return this.teams[1];
    }
    return null;
  }

  public isWinner(team): boolean {
    if (_.isNumber(team)) {
      team = this.teams[0];
    }
    const winner: TeamModel = this.getWinner();
    return team == winner;
  }

  public isLoser(team): boolean {
    if (_.isNumber(team)) {
      team = this.teams[team];
    }
    const winner: TeamModel = this.getWinner();
    return (winner && team != winner);
  }

  public getPlayersOfTeam(index): PlayerModel[] {
    return this.teams[index].players;
  }

  public hasPlayers() {
    return this.teams[0].players.length > 0 && this.teams[1].players.length > 0;
  }

  public compute(): void {
    this.teams.forEach((team) => {
      team.players.forEach((player) => {
        team.goals = (team.goals + player.goals);
      });
    });
  }

  protected getDateProps(): string[] {
    return ['createdAt', 'stoppedAt'];
  }

  public saveTimeStamp(timeStampDuration: number) {
    const timeToRemove = timeStampDuration * 1000;
    const timeStampEnd = new Date(Date.now());
    const timeStampStart = new Date(Date.now() - timeToRemove);
    this.buzzTimeStamps.push(new BuzzTimeStamps(timeStampStart, timeStampEnd));
  }

  public startGame() {
    this.startedAt = new Date(Date.now());
    this.status = 'start';
  }

  public setStartedAt(hours: number, minutes: number) {
    const date = new Date(Date.now());
    date.setHours(hours);
    date.setMinutes(minutes);
    this.startedAt = date;
  }

  public endGame() {
    this.status = 'complete';
    this.stoppedAt = new Date(Date.now());
    this.endedAt = new Date(Date.now());
    if (!this.startedAt) {
      const startedAt = new Date(this.endedAt.getTime());
      startedAt.setHours(startedAt.getHours() - 1);
      this.startedAt = startedAt;
    }
  }

  public setTeam(teamIndex:number, team:TeamModel) {
    if (teamIndex == 0 ) {
      this.setFirstTeam(team);
    } else {
      this.setSecondTeam(team);
    }
  }

  setFirstTeam(team:TeamModel) {
    if (this.teams == null) {
      this.teams = new Array(2).fill(new TeamModel());
    } else {
      if (this.teams.length > 0) {
        this.teams[0] = team;
      } else {
        this.teams.push(team);
      }
    }
  }

  setSecondTeam(team: TeamModel) {
    if (this.teams == null) {
      this.teams = new Array(2).fill(new TeamModel());
    } else {
      if (this.teams.length > 1) {
        this.teams[1] = team;
      } else {
        this.teams.push(team);
      }
    }
  }

  isGameFinished() {
    return (this.status == 'complete' || this.status == 'error');
  }

  setIsScoreFromPlayerGoals(value: boolean) {
    this.isScoreFromPlayerGoals = value;
  }
}
