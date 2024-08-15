import {Conf} from 'src/app/conf';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';

export const getTeam = (id: string, game: GameModel, tournament): LeagueTeam => {
  let i = 0;

  while (tournament.teams[i] && game.teams[id].from != tournament.teams[i]._id) {
    i = i + 1;
  }
  if (tournament.teams[i]) {
    return (tournament.teams[i]);
  }
};

export const getShirt = (team: LeagueTeam, teamShirtsUrl:string): string => {
  const shirtUrl = Conf.staticBaseUrl + teamShirtsUrl;
  return (shirtUrl + team.shirt);
};
