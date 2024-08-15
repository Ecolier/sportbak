import {LeagueTeam} from './league-team.model';

export class TournamentTeam {
  public static ROUND_16 = 0;
  public static QUARTER_FINALS = 1;
  public static SEMI_FINALS = 2;
  public static FINAL = 3;

  team: LeagueTeam;
  poolName: string = '';
  playoffsPosition: {step:number, game: number, team: number};
  constructor(team: LeagueTeam) {
    this.team = team;
    this.resetPlayoffsPosition();
  }

  public setPool(poolName:string) {
    this.poolName = poolName;
  }

  public resetPool() {
    this.poolName = '';
  }

  public setPlayoffsPosition(newStep:number, newGamePosition: number, newTeamPosition: number) {
    this.playoffsPosition = {step: newStep, game: newGamePosition, team: newTeamPosition};
  }

  public resetPlayoffsPosition() {
    this.playoffsPosition = {step: -1, game: -1, team: -1};
  }
}
