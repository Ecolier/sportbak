import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TeamModel} from 'src/app/shared/models/team/team.model';

export class TournamentTeam {
  public leagueTeam: LeagueTeam;
  public gameTeam: TeamModel;
}

export class TournamentGame {
  public team1: TournamentTeam;
  public team2: TournamentTeam;
  public gameRef: GameModel;

  constructor(_team1: TournamentTeam, _team2: TournamentTeam, _gameRef: GameModel) {
    this.team1 = _team1;
    this.team2 = _team2;
    this.gameRef = _gameRef;
  }
}
