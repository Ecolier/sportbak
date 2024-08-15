import * as _ from 'lodash';
import {FBKModel, ObjectId} from '../futbak-parent-model';
import {LeagueTeam} from '../league/league-team.model';
import {PlayerModel} from '../user/player.model';


const _default = {
  title: null,
  goals: 0,
  players: [],
  from: null,
  sets: [],
};

export class TeamModel extends FBKModel {
  public title: string;
  public goals: number;
  public sets: number[];
  public players: PlayerModel[];
  public from : ObjectId | LeagueTeam;

  constructor(data: any = {}) {
    super(data, _default);
  }

  public onBeforePatch(data) {
    if (data && data.goals) {
      data.goals = _.toInteger(data.goals);
    }
  }
  public onAfterPatch() {
    if (this.players && this.players.length) {
      const players = [];
      for (let i = 0; i < this.players.length; i++) {
        players.push(new PlayerModel(this.players[i]));
      }
      this.players = players;
    }

    if (FBKModel.needToBeConvertToFBKModel(this.from)) {
      this.from = new LeagueTeam(this.from);
    }
  }

  public addPlayer(data: any): void {
    const player: PlayerModel = new PlayerModel(data);

    if (this.players == undefined) {
      const players = [];
      players.push(player);
      this.players = players;
    } else {
      this.players.push(player);
    }
  }

  public removePlayer(userId:string): void {
    _.remove(this.players, (player) => {
      return player.user._id == userId;
    });
  }

  public setPlayers(players: PlayerModel[]) {
    this.players = players;
  }
  public getPlayerGoals() {
    let playerGoals = 0;
    this.players.forEach((player) => {
      playerGoals = playerGoals + player.goals;
    });
    return playerGoals;
  }

  public setGoals(goals) {
    this.goals= goals;
  }
  public setSets(games) {
    this.sets.push(games);
  }
  public deleteSet(indexSet) {
    this.sets.splice(indexSet, 1);
  }
}
