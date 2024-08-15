import * as _ from 'lodash';
import {data as levelProperties} from '../../services/user-level.service';
import {FBKModel, ObjectId} from '../futbak-parent-model';
import {LeagueTeam} from '../league/league-team.model';
import {DeviceModel} from './device.model';
import {PlayerLevel} from './player-level.model';
import {PlayerGoalKeeperModel} from './playergoalkeeper.model';
import {UserModel} from './user.model';

const _default = {
  _id: null,
  user: null,
  device: null,
  team: 0,
  fromTeam: null,

  successfulpasses: 0,
  lostpasses: 0,
  totalpasses: 0,
  passaccuracy: 0,
  successfulduels: 0,
  totalduels: 0,
  successfuldribbles: 0,
  totaldribbles: 0,
  lostballs: 0,
  recoveredballs: 0,
  playedballs: 0,
  interceptions: 0,

  successfuldefensiveactions: 0,
  unsuccessfuldefensiveactions: 0,
  successfulduelswithball: 0,
  powerfulshots: 0,
  notdecisiveshots: 0,
  shotefficiency: 0,
  shotpower: 0,
  goals: 0,

  playedactions: 0,
  defensiveactions: 0,
  offensiveactions: 0,
  possession: 0,
  partnerincrime: null,
  petpeeve: null,
  calories: 0,
  playedtime: 0,
  averagespeed: 0,
  maxspeed: 0,
  distance: 0,
  highintensitytime: 0,
  influence: 0,
  globalrating: 0,
  defenserating: 0,
  attackrating: 0,
  physicalrating: 0,
  collectiverating: 0,
  passesrating: 0,

  awards: null,
  overallrankingbefore: null,
  overallrankingafter: null,
  immobilitytime: 0,
  playerstyle: 0,
  walkingstrides: 0,
  runningstrides: 0,
  walktime: 0,
  runtime: 0,
  statsLocked: false,
  statsUnlocked: null,
  valid: null,

  assists: 0,
  owngoals: 0,
  fouls: 0,
  yellowcards: 0,
  redcards: 0,
  isgoalkeeper: false,
  goalkeeper: null,

  totalGameDuration: 0,
  gameStopsDuration: 0,
  effectiveGameDuration: 0,
  playerGameDuration: 0,
  offTheFieldDuration: 0,
  substitutePlayerDuration: 0,

  games: 0,
  gamesdiff: 0,
  sets: 0,
  setsdiff: 0,
};

export class PlayerModel extends FBKModel {
  public _id: string;
  public user: UserModel;
  public device: DeviceModel;
  public team: number;

  public fromTeam : ObjectId | LeagueTeam;

  public successfulpasses : number;
	public lostpasses : number;
	public totalpasses : number;
	public passaccuracy : number;
	public successfulduels : number;
	public totalduels : number;
	public successfuldribbles : number;
	public totaldribbles : number;
	public lostballs : number;
	public recoveredballs : number;
	public playedballs : number;
  public interceptions : number;
	public successfuldefensiveactions : number;
  public unsuccessfuldefensiveactions : number;
  public successfulduelswithball: number;
	public powerfulshots : number;
	public notdecisiveshots : number;
	public shotefficiency : number;
	public shotpower : number;
  public goals : number;
	public playedactions : number;
	public defensiveactions : number;
	public offensiveactions : number;
	public possession : number;
	public partnerincrime : string;
	public petpeeve : string;
	public calories : number;
	public playedtime : number;
	public averagespeed : number;
	public maxspeed : number;
	public distance : number;
	public highintensitytime : number;
	public influence : number;
	public globalrating : number;
	public defenserating : number;
	public attackrating : number;
	public physicalrating : number;
	public collectiverating : number;
  public passesrating : number;
  public awards : any;
  public overallrankingbefore : any;
  public overallrankingafter : any;
  public immobilitytime : number;
  public playerstyle : number;
  public walkingstrides : number;
  public runningstrides : number;
  public walktime : number;
  public runtime : number;
  public statsLocked : boolean;
  public statsUnlocked : string[];
  public valid: boolean;
  public assists: number;
  public owngoals: number;
  public fouls: number;
  public yellowcards: number;
  public redcards: number;
  public isgoalkeeper: boolean;
  public goalkeeper: PlayerGoalKeeperModel;
  public totalGameDuration: number;
  public gameStopsDuration: number;
  public effectiveGameDuration: number;
  public playerGameDuration: number;
  public offTheFieldDuration: number;
  public substitutePlayerDuration:number;

  // Padel
  public games: number;
  public gamesdiff: number;
  public sets: number; // currently egal to goals
  public setsdiff: number;

  static getLevel(score): PlayerLevel {
    let levelName: string;
    if (score >= 75) {
      levelName = 'pro';
    } else if (score >= 50) {
      levelName = 'semipro';
    } else {
      levelName = 'amateur';
    }

    const level = new PlayerLevel(levelProperties[levelName]);
    _.assign(level, {
      name: levelName,
    });

    return level;
  }

  static getAverageStatsPlayer(players : PlayerModel[]) {
    const averagePlayer = new PlayerModel({});
    const keys = ['successfulpasses', 'lostpasses', 'totalpasses', 'passaccuracy', 'successfulduels', 'totalduels', 'successfuldribbles', 'totaldribbles',
      'lostballs', 'recoveredballs', 'playedballs', 'interceptions', 'successfuldefensiveactions', 'unsuccessfuldefensiveactions',
      'powerfulshots', 'notdecisiveshots', 'shotefficiency', 'shotpower', 'goals', 'playedactions', 'defensiveactions',
      'offensiveactions', 'possession', 'partnerincrime', 'petpeeve', 'calories', 'playedtime', 'averagespeed', 'maxspeed',
      'distance', 'highintensitytime', 'influence', 'globalrating', 'defenserating', 'attackrating', 'physicalrating',
      'collectiverating', 'passesrating'];

    for (const key of keys) {
      let averageValue = 0;

      if (players && players.length) {
        for (const playerModel of players) {
          averageValue += playerModel[key];
        }
        averageValue /= players.length;
      }
      averagePlayer[key] = averageValue;
    }
    return averagePlayer;
  }

  static getSumStatsPlayer(players : PlayerModel[]) {
    const averagePlayer = new PlayerModel({});
    const keys = ['successfulpasses', 'lostpasses', 'totalpasses', 'passaccuracy', 'successfulduels', 'totalduels', 'successfuldribbles', 'totaldribbles',
      'lostballs', 'recoveredballs', 'playedballs', 'interceptions', 'successfuldefensiveactions', 'unsuccessfuldefensiveactions',
      'powerfulshots', 'notdecisiveshots', 'shotefficiency', 'shotpower', 'goals', 'playedactions', 'defensiveactions',
      'offensiveactions', 'possession', 'partnerincrime', 'petpeeve', 'calories', 'playedtime', 'averagespeed', 'maxspeed',
      'distance', 'highintensitytime', 'influence', 'globalrating', 'defenserating', 'attackrating', 'physicalrating',
      'collectiverating', 'passesrating'];

    for (const key of keys) {
      let averageValue = 0;

      if (players && players.length) {
        for (const playerModel of players) {
          averageValue += playerModel[key];
        }
      }
      averagePlayer[key] = averageValue;
    }
    return averagePlayer;
  }

  constructor(data: any) {
    super(data, _default);
  }

  public addGoal(): void {
    this.goals = this.goals || 0;
    this.goals++;
  }

  public addAssist(): void {
    this.assists = this.assists || 0;
    this.assists++;
  }

  public addOwnGoal(): void {
    this.owngoals = this.owngoals || 0;
    this.owngoals++;
  }

  public addFoul():void {
    this.fouls = this.fouls || 0;
    this.fouls++;
  }

  public setGoals(goals: number) {
    this.goals = goals;
  }

  public setAssists(assists: number) {
    this.assists = assists;
  }

  public setFouls(fouls: number) {
    this.fouls = fouls;
  }

  public setYellowCards(yellowCards: number) {
    this.yellowcards = yellowCards;
  }

  public setRedCards(redCards: number) {
    this.redcards = redCards;
  }

  public setOwnGoals(ownGoals: number) {
    this.owngoals = ownGoals;
  }

  public addYellowCard():void {
    this.yellowcards = this.yellowcards || 0;
    this.yellowcards++;
  }

  public addRedCard():void {
    this.redcards = this.redcards || 0;
    this.redcards = 1;
  }

  public removeGoal(): void {
    this.goals = this.goals == 0 ? 0 : this.goals - 1;
  }

  public removeAssist(): void {
    this.assists = this.assists == 0 ? 0 : this.assists - 1;
  }

  public removeFoul(): void {
    this.fouls = this.fouls == 0 ? 0 : this.fouls - 1;
  }

  public removeOwnGoal() {
    this.owngoals = this.owngoals == 0 ? 0 : this.owngoals - 1;
  }

  public resetYellowCards() {
    this.yellowcards = 0;
  }

  public resetRedCards() {
    this.redcards = 0;
  }

  public getLevel(level: number) {
    return PlayerModel.getLevel(level);
  }

  public isLocked() {
    return this.statsLocked;
  }

  public getGeneralLevel() {
    return PlayerModel.getLevel(this.user.level);
  }

  public getLevelOfGame() {
    return PlayerModel.getLevel(this.globalrating);
  }

  public getPictureLink(): string {
    return this.user.getPictureLink();
  }

  public onBeforePatch(data): void {
    _.forEach(['goals', 'shoots', 'successpasses', 'totalpasses'], (key) => {
      data[key] = _.toInteger(data[key]);
    });
  }

  public onAfterPatch(): void {
    this.goals = this.goals;
    if (_.isPlainObject(this.user)) {
      this.user = new UserModel(this.user);
    }
    if (_.isPlainObject(this.device)) {
      this.device = new DeviceModel(this.device);
    }
    if (_.isString(this.device)) {
      this.device = new DeviceModel({
        _id: this.device,
      });
    }
    if (_.isPlainObject(this.goalkeeper)) {
      this.goalkeeper = new PlayerGoalKeeperModel(this.goalkeeper);
    }
  }

  public static getAllProperties() {
    return Object.keys(_default);
  }
}
