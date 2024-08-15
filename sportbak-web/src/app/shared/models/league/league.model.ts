import {SportConstants, SportType} from 'src/app/shared/values/sport';
import {FBKModel} from '../futbak-parent-model';
import {UserModel} from '../user/user.model';
import {CompetitionSummaryModel} from './competition-summary.model';
import {CompetitionModel} from './competition.model';
import {GameModel} from './game.model';
import {LeagueTeam} from './league-team.model';

const _default = {
  _id: null,
  createdAt: null,
  complex: null,
  name: null,
  levelNumber: 1,
  level: 1,
  score: 0,
  middleLevel: 1,
  startSeason: null,
  endSeason: null,
  is_Private: true,
  teams: [],
  wpoint: 0,
  dpoint: 0,
  lpoint: 0,
  nbVersus: 0,
  game: [],
  code: null,
  summary: null,
  sport: SportConstants.default,
  state: 'created',
};


export class LeagueModel extends FBKModel {
    public _id: string;
    public createdAt: Date
    public complex: string;
    public name: String;
    public levelNumber: number;
    public level: string;
    public score: number;
    public middleLevel: String;
    public startSeason: Date;
    public endSeason: Date;
    public is_Private: boolean;
    public teams: LeagueTeam[];
    public wpoint: number;
    public dpoint: number;
    public lpoint: number;
    public nbVersus: number;
    public game: GameModel[][][];
    public code: string;
    public summary: CompetitionSummaryModel;
    public state: string;
    public sport: SportType;

    constructor(data: any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.teams && this.teams.length) {
        const teams = [];
        for (let i = 0; i < this.teams.length; i++) {
          teams.push(new LeagueTeam(this.teams[i]));
        }
        this.teams = teams;
      }

      if (this.game && this.game.length) {
        const games = [];
        for (let i = 0; i < this.game.length; i++) {
          const games2 = [];
          for (let j = 0; j < this.game[i].length; j++) {
            const games3 = [];
            for (let k = 0; k < this.game[i][j].length; k++) {
              const game = new GameModel(this.game[i][j][k]);
              games3.push(game);
            }
            games2.push(games3);
          }
          games.push(games2);
        }
        this.game = games;
      }

      if (this.summary) {
        this.summary = new CompetitionSummaryModel(this.summary);
      }
    }

    getUsers(i: number): UserModel[] {
      let users: UserModel[];
      users = [];
      for (let j = 0; j < this.teams[i].player.length; j += 1) {
        users.push(new UserModel(this.teams[i].player[j].user));
      }
      return users;
    }


    updateRankTeam() {
      let rank: number;
      let j = 0;
      let rankJump = 0;
      rank = 0;

      for (let h = 0; h < this.teams.length; h++) {
        this.teams.sort(function(a, b) {
          return ((b.goal - b.tgoal) - (a.goal - a.tgoal));
        });
        this.teams.sort(function(a, b) {
          return (b.points - a.points);
        });
        for (let i = 0; i < this.teams.length; i += 1) {
          j = i - 1;
          if (j >= 0 && this.teams[i].points == this.teams[j].points &&
                    this.teams[i].goal - this.teams[i].tgoal ==
                    this.teams[j].goal - this.teams[j].tgoal) {
            rankJump += 1;
          } else if ((j >= 0 && (this.teams[i].points != this.teams[j].points ||
                    (this.teams[i].goal - this.teams[i].tgoal !=
                        this.teams[j].goal - this.teams[j].tgoal &&
                        this.teams[i].points == this.teams[j].points))) || (j < 0)) {
            rank += 1 + rankJump;
            rankJump = 0;
          }
          this.teams[i].rank = rank;
        }
        rank = 0;
        rankJump = 0;
      }
    }

    updateTeams() {
      for (let i = 0; i < this.teams.length; i++) {
        this.teams[i].updateMatch();
        this.teams[i].updateScore(this.wpoint, this.dpoint, this.lpoint);
        this.teams[i].updateLastResult();
        this.teams[i].updateCards();
      }
      this.updateRankTeam();
    }

    convertToCompetition(): CompetitionModel {
      let competition: CompetitionModel;
      competition = new CompetitionModel(
          {
            _id: this._id,
            name: this.name, nbVersus: this.nbVersus,
            matchPoints: {won: this.wpoint, lost: this.lpoint, draw: this.dpoint},
            teams: [],
            league: {
              startSeason: this.startSeason, endSeason: this.endSeason, is_Private: this.is_Private,
            },
            type: 'league', code: this.code,
            state: this.state,
            sport: this.sport,
          },
      );
      for (let i = 0; i < this.teams.length; i += 1) {
        competition.teams.push(new LeagueTeam(this.teams[i]));
        competition.teams[i].users = this.teams[i].getUsers();
      }
      return competition;
    }

    public isCreated() {
      return this.state == 'created';
    }

    public isFinished() {
      return this.state == 'finished';
    }
}
