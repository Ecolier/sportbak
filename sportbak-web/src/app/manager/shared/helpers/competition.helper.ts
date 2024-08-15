const  getLeagueTeam = (game, teamIndex, teams) => {
  let result = null;
  if (game && game.teams && teamIndex < game.teams.length) {
    let team = game.teams[teamIndex];
    if (team && team.from) {
      if (typeof team.from == 'object') {
        result = team.from;
      } else if (typeof team.from == 'string') {
        if (teams) {
          result = teams.find((leagueTeam) => leagueTeam._id == team.from);
        }
      }
    }
  }
  return result;
}

export {getLeagueTeam}