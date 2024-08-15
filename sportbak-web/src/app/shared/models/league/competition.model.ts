import {SportConstants, SportType} from 'src/app/shared/values/sport';
import {FBKModel} from '../futbak-parent-model';
import {PlayerModel} from '../user/player.model';
import {UserModel} from '../user/user.model';
import {CompetitionSummaryModel} from './competition-summary.model';
import {GameModel} from './game.model';
import {LeagueTeam} from './league-team.model';
import {LeagueModel} from './league.model';
import {PoolModel} from './pool.model';
import {TournamentModel} from './tournament.model';


const _default = {
  _id: null,
  name: null,
  games: [],
  level: 1,
  nbVersus: 0,
  teamsForfeiting: null,
  teams: null,
  type: null,
  complex: null,
  createdAt: null,
  code: null,
  summary: null,
  league: null,
  tournament: null,
  matchPoints: null,
  sport: SportConstants.default,
  state: 'created',
};

export class CompetitionModel extends FBKModel {
    public _id: string;
    public name: string;
    public games: GameModel[];
    public level: number;
    public nbVersus: number;
    public teamsForfeiting: LeagueTeam[];
    public teams: LeagueTeam[];
    public type: string;
    public complex: string[];
    public createdAt: string;
    public code: string;
    public summary: CompetitionSummaryModel;
    public state: string;
    public league: {
        games: string[][][];
        isPrivate: boolean;
        endSeason: Date;
        startSeason: Date;
    };
    public tournament: {
        finalStages: {
            games: string[][];
            step: number;
            playoffs: string[][][];
        }
        isPool: boolean;
        pools: [{
            games: string[][][];
            name: string;
            teams: string[];
        }],
    };
    public matchPoints: {
        won: number;
        lost: number;
        draw: number;
    };
    public sport:SportType;
    constructor(data: any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.games && this.games.length) {
        const games = [];
        for (let i = 0; i < this.games.length; i++) {
          games.push(new GameModel(this.games[i]));
        }
        this.games = games;
      }

      if (this.teamsForfeiting && this.teamsForfeiting.length) {
        const teamsForfeiting = [];
        for (let i = 0; i < this.teamsForfeiting.length; i++) {
          teamsForfeiting.push(new LeagueTeam(this.teamsForfeiting[i]));
        }
        this.teamsForfeiting = teamsForfeiting;
      }

      if (this.teams && this.teams.length) {
        const teams = [];
        for (let i = 0; i < this.teams.length; i++) {
          teams.push(new LeagueTeam(this.teams[i]));
        }
        this.teams = teams;
      }

      if (this.summary) {
        this.summary = new CompetitionSummaryModel(this.summary);
      }
    }

    convertToLeague(): LeagueModel {
      let league: LeagueModel;
      league = new LeagueModel({_id: this._id, name: this.name, level: this.level, nbVersus: this.nbVersus, createdAt: this.createdAt, code: this.code, state: this.state});
      league.wpoint = this.matchPoints.won;
      league.dpoint = this.matchPoints.draw;
      league.lpoint = this.matchPoints.lost;
      league.teams = [];
      for (let i = 0; i < this.teams.length; i++) {
        let stats = this.teams[i].averageStatsTeam;
        if (!stats) {
          stats = new PlayerModel({});
        }

        league.teams.push(new LeagueTeam({
          _id: this.teams[i]._id,
          captain: this.teams[i].captain,
          createdAt: this.teams[i].createdAt,
          shirt: this.teams[i].shirt,
          name: this.teams[i].name,
          bonusPoints: this.teams[i].bonusPoints,
          stats: stats,
        }));
        league.teams[i].games = [];
        league.teams[i].player = [];

        const team = this.teams[i];
        const users = team.users;
        const avgStats = team.averageStatsUsers;
        if (users && avgStats) {
          for (const user of users) {
            const userId = user._id;
            let found = false;
            for (const avgStat of avgStats) {
              if (avgStat.user.toString() == userId) {
                avgStat.user = new UserModel(user);
                league.teams[i].player.push(avgStat);
                found = true;
                break;
              }
            }

            if (!found) {
              const emptyStats = new PlayerModel({});
              emptyStats.user = new UserModel(user);
              league.teams[i].player.push(new PlayerModel(emptyStats));
            }
          }
        }


        league.teams[i].users = [];
        for (let j = 0; j < this.teams[i].users.length; j += 1) {
          league.teams[i].users.push(new UserModel(this.teams[i].users[j]));
        }
      }
      for (let f = 0; f < this.league.games.length; f++) {
        league.game[f] = [];
        for (let i = 0; i < this.league.games[f].length; i++) {
          league.game[f][i] = [];
          for (let j = 0; j < this.league.games[f][i].length; j++) {
            league.game[f][i][j] = this.getGameById(this.league.games[f][i][j]);
          }
        }
      }
      for (let i = 0; i < this.teams.length; i++) {
        league.teams[i].games = this.getGame(league.teams[i]._id, league.game);
      }
      league.is_Private = this.league.isPrivate;
      league.endSeason = this.league.endSeason;
      league.startSeason = this.league.startSeason;
      league.sport = this.sport;
      league.updateTeams();
      return (league);
    }

    getGame(id: string, game: GameModel[][][]): GameModel[] {
      const games: GameModel[] = [];
      if (this.games.length > 0) {
        for (let i = 0; i < game.length; i++) {
          for (let f = 0; f < game[i].length; f++) {
            for (let j = 0; j < game[i][f].length; j++) {
              if ( game[i][f][j] && game[i][f][j].teams && (game[i][f][j].teams[0].from == id || game[i][f][j].teams[1].from == id)) {
                games.push(game[i][f][j]);
              }
            }
          }
        }
      }
      return (games);
    }

    convertToTournament(): TournamentModel {
      let tournament: TournamentModel;
      tournament = new TournamentModel({_id: this._id, name: this.name, level: this.level, nbversus: this.nbVersus, createdAt: this.createdAt, code: this.code, state: this.state});
      tournament.wpoint = this.matchPoints.won;
      tournament.dpoint = this.matchPoints.draw;
      tournament.lpoint = this.matchPoints.lost;
      tournament.teams = [];
      for (let i = 0; i < this.teams.length; i++) {
        let stats = this.teams[i].averageStatsTeam;
        if (!stats) {
          stats = new PlayerModel({});
        }
        tournament.teams.push(new LeagueTeam({
          _id: this.teams[i]._id,
          captain: this.teams[i].captain,
          createdAt: this.teams[i].createdAt,
          shirt: this.teams[i].shirt,
          name: this.teams[i].name,
          bonusPoints: this.teams[i].bonusPoints,
          stats: stats,
        }));
        tournament.teams[i].player = [];

        const team = this.teams[i];
        const users = team.users;
        const avgStats = team.averageStatsUsers;
        if (users && avgStats) {
          for (const user of users) {
            const userId = user._id;
            let found = false;
            for (const avgStat of avgStats) {
              if (avgStat.user.toString() == userId) {
                avgStat.user = new UserModel(user);
                tournament.teams[i].player.push(avgStat);
                found = true;
                break;
              }
            }

            if (!found) {
              const emptyStats = new PlayerModel({});
              emptyStats.user = new UserModel(user);
              tournament.teams[i].player.push(new PlayerModel(emptyStats));
            }
          }
        }


        tournament.teams[i].users = [];
        for (let j = 0; j < this.teams[i].users.length; j += 1) {
          tournament.teams[i].users.push(new UserModel(this.teams[i].users[j]));
        }
      }
      for (let p = 0; p < this.tournament.pools.length; p++) {
        tournament.pool.push(new PoolModel({name: this.tournament.pools[p].name}));
        tournament.pool[p].teams = [];
        for (let i = 0; i < this.tournament.pools[p].teams.length; i++) {
          tournament.pool[p].teams[i] = new LeagueTeam(this.getTeamById(this.tournament.pools[p].teams[i]));
        }
      }
      for (let p = 0; p < this.tournament.pools.length; p++) {
        for (let f = 0; f < this.tournament.pools[p].games.length; f++) {
          tournament.pool[p].game[f] = [];
          for (let i = 0; i < this.tournament.pools[p].games[f].length; i++) {
            tournament.pool[p].game[f][i] = [];
            for (let j = 0; j < this.tournament.pools[p].games[f][i].length; j++) {
              tournament.pool[p].game[f][i][j] = this.getGameById(this.tournament.pools[p].games[f][i][j]);
            }
          }
        }
      }
      for (let i = 0; i < tournament.teams.length; i++) {
        for (let f = 0; f < this.games.length; f++) {
          if (this.isInGame(this.games[f], tournament.teams[i]._id) == true) {
            tournament.teams[i].games.push(this.games[f]);
          }
        }
      }
      for (let p = 0; p < tournament.pool.length; p++) {
        for (let o = 0; o < tournament.pool[p].teams.length; o++) {
          tournament.pool[p].teams[o].games = [];
          for (let f = 0; f < tournament.pool[p].game.length; f++) {
            for (let i = 0; i < tournament.pool[p].game[f].length; i++) {
              for (let j = 0; j < tournament.pool[p].game[f][i].length; j++) {
                if (this.isInGame(tournament.pool[p].game[f][i][j], tournament.pool[p].teams[o]._id) == true) {
                  tournament.pool[p].teams[o].games.push(tournament.pool[p].game[f][i][j]);
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < this.tournament.finalStages.games.length; i++) {
        tournament.game[i] = [];
        for (let f = 0; f < this.tournament.finalStages.games[i].length; f++) {
          if (this.tournament.finalStages.games[i][f] == null) {
            tournament.game[i][f] = null;
          } else {
            tournament.game[i][f] = this.getGameById(this.tournament.finalStages.games[i][f]);
          }
        }
      }
      tournament.finalStage = this.tournament.finalStages.step;
      tournament.is_pool = this.tournament.isPool;
      tournament.sport = this.sport;
      return (tournament);
    }

    getGameById(id: string): GameModel {
      let i = 0;

      if (this.games) {
        while (i < this.games.length && id != this.games[i]._id) {
          i++;
        }

        if (i < this.games.length && id == this.games[i]._id) {
          return (this.games[i]);
        }
      } else {
        return null;
      }
    }

    getTeamById(id: string): LeagueTeam {
      let i = 0;

      while (i < this.teams.length && id != this.teams[i]._id) {
        i++;
      }

      if (i < this.teams.length && id == this.teams[i]._id) {
        return (this.teams[i]);
      }
    }

    isInGame(game: GameModel, id: string): boolean {
      if (game && (id == game.teams[0].from || id == game.teams[1].from)) {
        return (true);
      }
      return (false);
    }

    reduceTeamUsers() {
      if (this.teams[0]) {
        this.teams[0].users = this.teams[0].users.map((user) => new UserModel({_id: user._id}));
      }
    }

    prepareTournamentForBackEnd() {
      return {
        code: this.code,
        matchPoints: {...this.matchPoints},
        name: this.name,
        nbVersus: this.nbVersus,
        state: this.state,
        teams: this.teams.map((team) => {
          return {
            _id: team._id,
            name: team.name,
            captain: team.captain,
            shirt: team.shirt,
            users: team.users.map((user) => user._id),
            bonusPoints: team.bonusPoints,
          };
        }),
        tournament: JSON.parse(JSON.stringify(this.tournament)),
        type: this.type,
        sport: this.sport,
      };
    }

    prepareLeagueForBackEnd(isCreating: boolean = false) {
      return {
        games: this.games,
        matchPoints: {...this.matchPoints},
        name: this.name,
        nbVersus: this.nbVersus,
        state: this.state,
        teams: this.teams.map((team) => {
          if (isCreating) {
            return {
              name: team.name,
              captain: team.captain,
              shirt: team.shirt,
              users: team.users.map((user) => user._id),
              bonusPoints: team.bonusPoints,
            };
          } else {
            return {
              _id: team._id,
              name: team.name,
              captain: team.captain,
              shirt: team.shirt,
              users: team.users.map((user) => user._id),
              bonusPoints: team.bonusPoints,
            };
          }
        }),
        league: JSON.parse(JSON.stringify(this.league)),
        type: this.type,
        sport: this.sport,
      };
    }
}

