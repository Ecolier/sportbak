
import {SportConstants, SportType} from 'src/app/shared/values/sport';
import {FBKModel} from '../futbak-parent-model';
import {UserModel} from '../user/user.model';
import {CompetitionSummaryModel} from './competition-summary.model';
import {CompetitionModel} from './competition.model';
import {GameModel} from './game.model';
import {LeagueTeam} from './league-team.model';
import {PoolModel} from './pool.model';
import {TournamentTeam} from './tournament-team';

const _default = {
  _id: null,
  createdAt: null,
  complex: null,
  name: null,
  teams: [],
  wpoint: 0,
  dpoint: 0,
  lpoint: 0,
  nbversus: 0,
  game: [],
  pool: [],
  finalStage: -1,
  is_pool: false,
  code: null,
  level: 1,
  summary: null,
  state: 'pending',
  final: [],
  semiFinals: [],
  quarterFinals: [],
  roundOf16: [],
  arePoolsFinished: true,
  playoffsStarted: false,
  sport: SportConstants.default,

};

export class TournamentModel extends FBKModel {
    public _id: string;
    public createdAt: Date
    public complex: string;
    public name: String;
    public teams: LeagueTeam[];
    public wpoint: number;
    public dpoint: number;
    public lpoint: number;
    public nbversus: number;
    public game: GameModel[][];
    public pool: PoolModel[];
    public finalStage: number;
    public is_pool: boolean;
    public code: string;
    public level: number;
    public summary: CompetitionSummaryModel;
    public state: string
    public final: any[];
    public semiFinals: any[];
    public quarterFinals: any[];
    public roundOf16: any[];
    public arePoolsFinished: boolean;
    public playoffsStarted: boolean;
    public sport: SportType;
    constructor(data: any = {}) {
      super(data, _default);
      this.setDisplayOptions();
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

      if (this.pool && this.pool.length) {
        const pool = [];
        for (let i = 0; i < this.pool.length; i++) {
          pool.push(new PoolModel(this.pool[i]));
        }
        this.pool = pool;
      }

      if (this.game && this.game.length) {
        const games = [];
        for (let i = 0; i < this.game.length; i++) {
          const games2 = [];
          for (let j = 0; j < this.game[i].length; j++) {
            games2.push(new GameModel(this.game[i][j]));
          }
          games.push(games2);
        }
        this.game = games;
      }

      if (this.summary) {
        this.summary = new CompetitionSummaryModel(this.summary);
      }
    }

    setDisplayOptions() {
      this.setArePoolsFinished();
    }

    setArePoolsFinished() {
      if (this.pool.length < 1) {
        this.arePoolsFinished = false;
      } else {
        this.pool.forEach((pool) => {
          if (!pool.areAllGamesPlayed()) {
            this.arePoolsFinished = false;
          } else {
            this.arePoolsFinished = true;
          }
        });
      }
    }

    setPlayoffsPhases() {
      if (this.game && this.game.length > 0) {
        if (this.getCurrentPlayoffsStep() == TournamentTeam.FINAL) {
          this.final = this.game[0];
        } else if (this.getCurrentPlayoffsStep() == TournamentTeam.SEMI_FINALS) {
          this.semiFinals = this.game[0];
          this.final = this.game[1];
        } else if (this.getCurrentPlayoffsStep() == TournamentTeam.QUARTER_FINALS) {
          this.quarterFinals = this.game[0];
          this.semiFinals = this.game[1];
          this.final = this.game[2];
        } else if (this.getCurrentPlayoffsStep() == TournamentTeam.ROUND_16) {
          this.roundOf16 = this.game[0];
          this.quarterFinals = this.game[1];
          this.semiFinals = this.game[2];
          this.final = this.game[3];
        }
      }
    }

    getCurrentPlayoffsStep() {
      if (this.game[0].length == 1) {
        return TournamentTeam.FINAL;
      } else if (this.game[0].length == 2) {
        return TournamentTeam.SEMI_FINALS;
      } else if (this.game[0].length == 4) {
        return TournamentTeam.QUARTER_FINALS;
      } else if (this.game[0].length == 8) {
        return TournamentTeam.ROUND_16;
      }
    }

    setTournamentTeamsPlayoffsPositions(tournamentTeams: TournamentTeam[]) {
      const currentPlayoffsStep = this.getCurrentPlayoffsStep();
      for (let gameIndex = 0; gameIndex < this.game[0].length; gameIndex++) {
        this.setPlayoffsTeamsPosition(currentPlayoffsStep, gameIndex, tournamentTeams, this.game[0]);
      }
    }

    setPlayoffsTeamsPosition(stepIndex: number, gameIndex: number, playoffsTeams: TournamentTeam[], playoffsStep: GameModel[]) {
      const team1 = playoffsTeams.find((team) => team.team.name == playoffsStep[gameIndex].teams[0].title);
      if (team1) {
        team1.setPlayoffsPosition(stepIndex, gameIndex, 0);
      }
      const team2 = playoffsTeams.find((team) => team.team.name == playoffsStep[gameIndex].teams[1].title);
      if (team2) {
        team2.setPlayoffsPosition(stepIndex, gameIndex, 1);
      }
    }

    getTournamentTeams() {
      const tournamentTeams = this.teams.map((team) => new TournamentTeam(team));
      if (this.game && this.game.length > 0) {
        this.setTournamentTeamsPlayoffsPositions(tournamentTeams);
      }
      return tournamentTeams;
    }

    getPlayoffsQualifiedTeams(nbOfTeamsNeeded: number) {
      this.calculateAllTeamsPoints();
      let teams = this.getAllTeamsFromPools();
      teams = this.rankTeams(teams);
      teams = teams.slice(0, nbOfTeamsNeeded);
      return teams;
    }

    calculateAllTeamsPoints() {
      this.pool.forEach((pool) => {
        pool.calculateTeamPoints(this.wpoint, this.dpoint, this.lpoint);
      });
    }

    getAllTeamsFromPools() {
      const teams = [];
      this.pool.forEach((pool) => {
        teams.push(...pool.getTeams());
      });
      return teams;
    }

    rankTeams(teams: LeagueTeam[]) {
      return this.teams.sort((a, b) => {
        const result = (a['points'] - b['points']);
        return (true ? 1 : (-1)) * result;
      });
    }

    getUsers(i: number): UserModel[] {
      let users: UserModel[];
      users = [];
      for (let j = 0; j < this.teams[i].player.length; j += 1) {
        users.push(new UserModel(this.teams[i].player[j].user));
      }
      return users;
    }

    getTeams(i: number): string[] {
      let teams: string[];
      teams = [];
      for (let j = 0; j < this.pool[i].teams.length; j += 1) {
        if (this.pool[i].teams[j] == null) {
          teams.push(null);
        } else {
          teams.push(this.pool[i].teams[j].name);
        }
      }
      return teams;
    }

    playoffsPhaseToStringArray(phase: GameModel[]) {
      if (phase && phase.length > 0) {
        return phase.map((game) =>[game.teams[0].title, game.teams[1].title]);
      } else {
        return [];
      }
    }

    convertToCompetition(): CompetitionModel {
      let competition: CompetitionModel;
      competition = new CompetitionModel({
        _id: this._id,
        name: this.name,
        nbVersus: this.nbversus,
        matchPoints: {won: this.wpoint, lost: this.lpoint, draw: this.dpoint},
        teams: [],
        tournament: {
          finalStages: {
            playoffs: [],
          },
          isPool: this.is_pool,
          pools: this.pool.map((pool) => {
            return {
              name: pool.name,
              teams: pool.teams.map((team) => team.name),
            };
          }),
        },
        type: 'tournament',
        sport: this.sport,
      });
      if (this.roundOf16.length < 1 && this.quarterFinals.length < 1 && this.semiFinals.length < 1 && this.final.length < 1) {
        competition.tournament.finalStages = null;
      } else {
        competition.tournament.finalStages.playoffs = [
          this.roundOf16,
          this.quarterFinals,
          this.semiFinals,
          this.final,
        ];
      }
      for (let i = 0; i < this.teams.length; i += 1) {
        competition.teams.push(new LeagueTeam({
          _id: this.teams[i]._id,
          captain: this.teams[i].captain,
          name: this.teams[i].name,
          shirt: this.teams[i].shirt,
          bonusPoints: this.teams[i].bonusPoints,
        }));
        competition.teams[i].users = this.getUsers(i);
      }
      competition.state = this.state;
      return competition;
    }

    fillEmptyMatch(i: number, competition: CompetitionModel) {
      if (i != 0 && competition.tournament.finalStages.playoffs[i - 1].length > 0) {
        if (this.teams.length % 2 == 0 && competition.tournament.finalStages.playoffs[i].length == 0) {
          for (let j = 0; j < competition.tournament.finalStages.playoffs[i - 1].length / 2; j += 1) {
            competition.tournament.finalStages.playoffs[i].push(null);
          }
        }
        if (this.teams.length % 2 != 0 && competition.tournament.finalStages.playoffs[i].length == 1) {
          for (let j = 0; j < competition.tournament.finalStages.playoffs[i - 1].length / 2 - 1; j += 1) {
            competition.tournament.finalStages.playoffs[i].push(null);
          }
        }
      }
      if (competition.tournament.finalStages.playoffs[i + 1].length == 0 && this.teams.length % 2 != 0 &&
            competition.tournament.finalStages.playoffs[i].length == 1) {
        if ((this.pool[i].name == 'eightFinal' && this.teams.length > 9) || (this.pool[i].name == 'QuartFinal' && this.teams.length > 5 &&
                competition.tournament.finalStages.playoffs[i - 1].length == 0)) {
          competition.tournament.finalStages.playoffs[i].push(null);
        }
      }
    }

    isCreated() {
      return this.state == 'created';
    }

    isFinished() {
      return this.state == 'finished';
    }

    getTeamFromId(teamId : string) : LeagueTeam {
      let result = null;
      if (this.teams) {
        for (const team of this.teams) {
          if (team._id == teamId) {
            result = team;
            break;
          }
        }
      }
      return result;
    }

    getWinnerTeamIfPossible() : LeagueTeam {
      let result = null;
      if (this.game) {
        const length = this.game.length;
        if (length) {
          const finals = this.game[length-1];
          if (finals.length) {
            const game = finals[0];
            if (game.status == 'complete') {
              let fromTeam = null;
              if (game.teams[0].goals > game.teams[1].goals) {
                fromTeam = game.teams[0].from;
              } else if (game.teams[0].goals < game.teams[1].goals) {
                fromTeam = game.teams[1].from;
              }

              if (fromTeam) {
                result = this.getTeamFromId(fromTeam);
              }
            }
          }
        }
      }
      return result;
    }
}
