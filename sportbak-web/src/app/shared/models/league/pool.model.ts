import {FBKModel} from '../futbak-parent-model';
import {GameModel} from './game.model';
import {LeagueTeam} from './league-team.model';
import {TournamentTeam} from './tournament-team';

const _default = {
  _id: null,
  name: null,
  teams: null,
  game: null,
};

export class PoolModel extends FBKModel {
  public _id: string;
  public name: string;
  public teams: LeagueTeam[] = [];
  public game: GameModel[][][] = [];

  constructor(data: any) {
    super(data, _default);
    if (data.teams && data.teams.length > 0) {
      data.teams.forEach((team) => {
        this.teams.push(team);
      });
    }
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
  }

  public addTeam(teamToAdd: LeagueTeam) {
    this.teams.push(teamToAdd);
    teamToAdd.setPool(this.name);
  }

  public containsTeam(teamToFind: LeagueTeam) {
    return this.teams.find((team) => team.name == teamToFind.name);
  }

  public removeTeam(teamToRemove: LeagueTeam) {
    teamToRemove.resetPool();
    this.teams = this.teams.filter((team) => team.name != teamToRemove.name);
  }

  public areAllGamesPlayed() {
    let areAllGamesPlayed = true;

    this.game.forEach((phase) => {
      phase.forEach((day) => {
        day.forEach((game) => {
          const game2 = game as GameModel;
          if (!game2.isGameFinished()) {
            areAllGamesPlayed = false;
          }
        });
      });
    });
    return areAllGamesPlayed;
  }

  public checkForRemovedTeams(teams: LeagueTeam[]) {
    this.teams.forEach((team) => {
      if (teams.indexOf(team) == -1) {
        const teamToRemoveIndex = this.teams.indexOf(team);
        this.teams.splice(teamToRemoveIndex, 1);
      }
    });
  }

  resetTeamsPool(tournamentTeams: TournamentTeam[]) {
    tournamentTeams.forEach((tournamentTeam) => {
      this.teams.forEach((team) => {
        if (team.name === tournamentTeam.team.name) {
          tournamentTeam.resetPool();
        }
      });
    });
  }

  getGamesWithTeam(team: LeagueTeam) {
    const gamesWithTeam = [];
    this.game.forEach((phase) => {
      phase.forEach((day) => {
        day.forEach((game) => {
          if (game.teams.filter((gameTeam) => gameTeam.title == team.name).length > 0) {
            gamesWithTeam.push(game);
          }
        });
      });
    });


    return gamesWithTeam;
  }

  calculateTeamPoints(pointsForWin: number, pointsForDraw: number, pointsForLoss: number) {
    this.teams.forEach((team) => {
      const gamesOfTeam = this.getGamesWithTeam(team);
      team.calculatePoints(gamesOfTeam, pointsForWin, pointsForDraw, pointsForLoss);
    });
  }

  getTeams() {
    return this.teams;
  }
}
