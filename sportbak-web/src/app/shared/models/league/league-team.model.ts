import {Conf} from 'src/app/conf';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKStaticUrls} from '../../values/static-urls';
import {FBKModel, ObjectId} from '../futbak-parent-model';
import {TeamModel} from '../team/team.model';
import {PlayerModel} from '../user/player.model';
import {UserModel} from '../user/user.model';
import {GameModel} from './game.model';

const _default = {
  _id: null,
  name: null,
  captain: null,
  createdAt: null,
  shirt: FBKStaticUrls.shirt.unknown,
  bonusPoints: 0,
  users: [],
  averageStatsTeam: null,
  averageStatsUsers: null,

  // LOCAL VARIABLES
  matchsplayed: 0,
  goal: 0,
  tgoal: 0,
  scoringSetsGames: 0,
  scoringSetsTGames: 0,
  wmatch: 0,
  dmatch: 0,
  lmatch: 0,
  points: 0,
  stats: null,
  player: [],
  games: [],
  lastresults: null,
  rank: -1,
  yellowcards: 0,
  redcards: 0,
  pool: '',
  randomGuestsAdded: [],
};

export class LeagueTeam extends FBKModel {
  public _id: ObjectId;
  public name: string;
  public captain: string;
  public createdAt: Date;
  public shirt: string;
  public bonusPoints: number;
  public users: UserModel[];
  public averageStatsTeam: PlayerModel;
  public averageStatsUsers: PlayerModel[];

  // LOCAL VARIABLES
  public matchsplayed: number;
  public goal: number;
  public tgoal: number;
  public scoringSetsGames: number; // Games mis
  public scoringSetsTGames: number; // Games encaissé
  public wmatch: number;
  public dmatch: number;
  public lmatch: number;
  public points: number;
  public stats: PlayerModel;
  public player: PlayerModel[];
  public games: GameModel[];
  public lastresults: number[];
  public rank: number;
  public yellowcards: number;
  public redcards: number;
  public pool: string;
  public randomGuestsAdded: string[];

  constructor(data: any = {}) {
    super(data, _default);
  }

  public onBeforePatch() {
  }

  public onAfterPatch() {
    // HERE YOU NEED TO CONSTRUCT CHILDREN
    if (this.users && this.users.length) {
      const users = [];
      for (let i = 0; i < this.users.length; i++) {
        if (FBKModel.needToBeConvertToFBKModel(this.users[i])) {
          users.push(new UserModel(this.users[i]));
        }
      }
      this.users = users;
    }

    if (this.averageStatsTeam) {
      if (FBKModel.needToBeConvertToFBKModel(this.averageStatsTeam)) {
        this.averageStatsTeam = new PlayerModel(this.averageStatsTeam);
      }
    }

    if (this.averageStatsUsers && this.averageStatsUsers.length) {
      const averageStatsUsers = [];
      for (let i = 0; i < this.averageStatsUsers.length; i++) {
        if (FBKModel.needToBeConvertToFBKModel(this.averageStatsUsers[i])) {
          averageStatsUsers.push(new PlayerModel(this.averageStatsUsers[i]));
        }
      }
      this.averageStatsUsers = averageStatsUsers;
    }
  }

  public updateMatch() {
    this.dmatch = 0;
    this.lmatch = 0;
    this.wmatch = 0;
    this.matchsplayed = 0;
    this.goal = 0;
    this.tgoal = 0;
    this.scoringSetsGames = 0;
    this.scoringSetsTGames = 0;
    for (let i = 0; i < this.games.length; i++) {
      const game = this.games[i];
      if (game.status == 'complete' || game.status == 'error') {
        this.matchsplayed += 1;
        let team = null;
        let oppenentTeam = null;

        if (game.teams[0].from == this._id) {
          team = game.teams[0];
          oppenentTeam = game.teams[1];
        } else if (game.teams[1].from == this._id) {
          team = game.teams[1];
          oppenentTeam = game.teams[0];
        }

        if (team && oppenentTeam) {
          this.goal += team.goals;
          this.tgoal += oppenentTeam.goals;
          if (team.goals > oppenentTeam.goals) {
            this.wmatch += 1;
          } else if (team.goals < oppenentTeam.goals) {
            this.lmatch += 1;
          } else if (team.goals == oppenentTeam.goals) {
            this.dmatch += 1;
          }

          if (game.sport == 'padel') {
            const sets = team.sets;
            const opponentSets = oppenentTeam.sets;
            if (sets && sets.length) {
              for (const s of sets) {
                this.scoringSetsGames += s;
              }
            }
            if (opponentSets && opponentSets.length) {
              for (const s of opponentSets) {
                this.scoringSetsTGames += s;
              }
            }
          }
        }
      }
    }
  }

  public updateScore(wpoint: number, dpoint: number, lpoint: number) {
    this.points = this.wmatch * wpoint + this.dmatch * dpoint + this.lmatch * lpoint + this.bonusPoints;
  }

  public updateLastResult() {
    const gametemp: GameModel[] = [];
    const lengthArray = 3;
    this.lastresults = [];

    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].status == 'complete' || this.games[i].status == 'error') {
        gametemp.push(this.games[i]);
      }
    }

    if (gametemp.length > 0) {
      gametemp.sort(function(a, b) {
        return (new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      });
    }

    for (let j = 0; j < gametemp.length && j < lengthArray; j++) {
      let result = 0;
      if (gametemp[j].teams[0].goals > gametemp[j].teams[1].goals) {
        result = 1;
      } else if (gametemp[j].teams[0].goals < gametemp[j].teams[1].goals) {
        result = -1;
      }

      if (gametemp[j].teams[1].from == this._id) {
        result *= -1;
      }
      this.lastresults.push(result);
    }
    this.lastresults = this.lastresults.reverse();
  }

  public updateCards() {
    this.updateYellowCards();
    this.updateRedCards();
  }

  public updateYellowCards() {
    for (let index = 0; index < this.player.length; index++) {
      this.yellowcards = this.yellowcards + this.player[index].yellowcards;
    }
  }

  public updateRedCards() {
    for (let index = 0; index < this.player.length; index++) {
      this.redcards = this.redcards + this.player[index].redcards;
    }
  }

  public getUsers(): UserModel[] {
    return this.player.map((player) => new UserModel(player.user));
  }

  public getPlayersFromUsers() {
    return this.users.map((user) => new PlayerModel({user: user}));
  }

  public setShirt(shirt: string) {
    this.shirt = shirt;
  }

  public getShirt() {
    return Conf.staticBaseUrl + '/teams/shirts/' + this.shirt;
  }

  public setPool(pool: string) {
    this.pool = pool;
  }

  public resetPool() {
    this.setPool('');
  }

  public convertToGameTeam() {
    return new TeamModel({
      title: this.name,
      goals: this.goal,
      players: this.users.map((user) => new PlayerModel({user: user})),
      from: this._id,
    });
  }

  public addPlayer(player: PlayerModel) {
    this.player.push(player);
    if (this.player.length < 2) {
      this.setCaptain(this.player[0].user._id);
    }
  }

  setCaptain(playerId: string) {
    this.captain = playerId;
  }

  async addRandomPlayer(provider: ManagerProvider): Promise<boolean> {
    const myPromise = new Promise<boolean>((resolve, reject) => {
      provider.getOneRandomGuest(this.randomGuestsAdded).subscribe({
        next: (response) => {
          const guestPlayer = new PlayerModel({user: new UserModel(response)});
          this.randomGuestsAdded.push(guestPlayer._id);
          this.addPlayer(guestPlayer);
          resolve(true);
        }, error: (error) => {
          reject(error);
        },
      });
    });
    return await myPromise;
  }

  public removePlayer(playerId: string) {
    this.player = this.player.filter((player) => player.user._id != playerId);
    const playerIndex = this.player.findIndex((player) => player._id == playerId);
    if (this.captain == playerId && this.player.length > 0) {
      this.setCaptain(this.player[0].user._id);
    }
    const index = this.randomGuestsAdded.indexOf(playerId);
    if (index != -1) {
      this.randomGuestsAdded = this.randomGuestsAdded.filter((guest, guestIndex) => guestIndex != index);
    }
  }

  public calculatePoints(gamesWithTeam: GameModel[], pointsForWin: number, pointsForDraw: number, pointsForLoss: number) {
    let teamPoints = 0;
    gamesWithTeam.forEach((game) => {
      const team = game.teams.find((team) => team.title == this.name);
      const otherTeam = game.teams.find((team) => team.title != this.name);

      if (team.goals > otherTeam.goals) {
        teamPoints = teamPoints + pointsForWin;
      } else if (team.goals == otherTeam.goals) {
        teamPoints = teamPoints + pointsForDraw;
      } else if (team.goals < otherTeam.goals) {
        teamPoints = teamPoints + pointsForLoss;
      }
    });

    this.points = teamPoints;
  }

  public containUser(userId) {
    let result = false;
    if (this.users) {
      if (this.users.find((u) => u._id == userId)) {
        result = true;
      }
    }
    return result;
  }
}
