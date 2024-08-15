import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Conf} from 'src/app/conf';
import {CompetitionModel} from '../../../shared/models/league/competition.model';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  constructor(
    public http: HttpClient,
  ) {
  }

  patchTeamsCompetition(id: string, teamId: string, data): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/competitions/' + id + '/team/' + teamId, data);
  }

  patchParamCompetition(id: string, data): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/competitions/' + id + '/teams/', data);
  }

  getLeagues(search = null): Observable<any[]> {
    const projection = ['_id',
      'createdAt',
      'type',
      'name',
      'level',
      'league.startSeason',
      'league.endSeason',
      'league.isPrivate',
      'summary',
      'state',
      'sport',
    ];
    const objParams: any = {
      projection: JSON.stringify(projection),
      populate: JSON.stringify('summary'),
    };
    if (search) {
      objParams.search = search;
    }
    const params = new HttpParams({
      fromObject: objParams,
    });
    return this.http.get<any[]>(Conf.apiBaseUrl + '/competitions/leagues/', {params});
  }

  getLeaguesById(id: string): Observable<CompetitionModel> {
    const populate = [{
      path: 'teams',
      model: 'Team',
      populate: [{
        path: 'users',
        model: 'User',
        select: '_id nickname picture position',
      },
      {
        path: 'averageStatsTeam',
        model: 'UserStat',
      },
      {
        path: 'averageStatsUsers',
        model: 'UserStat',
      }],
    }, 'games'];
    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/leagues/' + id, {params});
  }

  postLeagues(data: CompetitionModel): Observable<object> {
    const obj = this.buildCompetition(data);
    return this.http.post(Conf.apiBaseUrl + '/competitions/leagues/', obj);
  }

  postTeamLeaguesById(id: string, data): Observable<object> {
    return this.http.post(Conf.apiBaseUrl + '/competitions/leagues/team/' + id, data);
  }

  patchParametersLeague(id: string, isPrivate: boolean, matchPoints: { won: number, draw: number, lost: number }, nbVersus: number): Observable<CompetitionModel> {
    return this.http.patch<any>(Conf.apiBaseUrl + '/competitions/leagues/infos/' + id, {
      isPrivate,
      matchPoints,
      nbVersus,
    });
  }

  patchParametersTournament(id: string, matchPoints: { won: number, draw: number, lost: number }, nbVersus: number): Observable<CompetitionModel> {
    return this.http.patch<any>(Conf.apiBaseUrl + '/competitions/tournaments/infos/' + id, {
      matchPoints,
      nbVersus,
    });
  }

  getTournaments(search = null): Observable<any[]> {
    const projection = [
      '_id',
      'createdAt',
      'type',
      'name',
      'level',
      'league.startSeason',
      'league.endSeason',
      'league.isPrivate',
      'summary',
      'state',
      'sport',
    ];
    const objParams: any = {
      projection: JSON.stringify(projection),
      populate: JSON.stringify('summary'),
    };
    if (search) {
      objParams.search = search;
    }
    const params = new HttpParams({
      fromObject: objParams,
    });
    return this.http.get<any[]>(Conf.apiBaseUrl + '/competitions/tournaments', {params});
  }

  getShirts(): Observable<string[]> {
    return this.http.get<any[]>(Conf.apiBaseUrl + '/teams/shirts/');
  }

  getTournamentById(id: string): Observable<CompetitionModel> {
    const populate = [
      {
        path: 'teams',
        model: 'Team',
        populate: [{
          path: 'users',
          model: 'User',
          select: '_id nickname picture position',
        },
        {
          path: 'averageStatsTeam',
          model: 'UserStat',
        },
        {
          path: 'averageStatsUsers',
          model: 'UserStat',
        }],
      },
      'games',
    ];
    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/tournaments/' + id, {params});
  }

  postTournaments(data: CompetitionModel): Observable<object> {
    const obj = this.buildCompetition(data);
    return this.http.post(Conf.apiBaseUrl + '/competitions/tournaments/', obj);
  }

  patchGameDate(competitionId: string, gameId: string, startedAt: Date): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/competitions/' + competitionId + '/game/startedAt/' + gameId, {
      startedAt,
    });
  }
 
  patchDirectGame( gameId: string, scores:any): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/games/' + gameId + '/score?status=update', {
      scores
    });
  }

  patchPlayoffsTournaments(id: string, data): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/competitions/tournaments/finalstages/' + id, data);
  }

  private buildCompetition(data: CompetitionModel) {
    const obj = JSON.parse(JSON.stringify(data));
    const teams = [];
    for (const team of data.teams) {
      const usersId = [];
      for (const user of team.users) {
        usersId.push(user._id);
      }
      team.users = usersId;
      teams.push(team);
    }
    obj.teams = teams;
    return obj;
  }
}
