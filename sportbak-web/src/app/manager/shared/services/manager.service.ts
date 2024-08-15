import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, ReplaySubject, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserModel} from 'src/app/shared/models/user/user.model';
import {Conf} from 'src/app/conf';
import {ComplexModel} from '../../../shared/models/complex/complex.model';
import {AnnouncementModel} from '../../../shared/models/complex/announcementModel';
import {Field} from '../../../shared/models/field.model';
import {CompetitionModel} from '../../../shared/models/league/competition.model';
import {LeagueModel} from '../../../shared/models/league/league.model';
import {TournamentModel} from '../../../shared/models/league/tournament.model';
import {ManagerData} from '../models/manager-data.model';
import {ApplicationNotificationModel} from '../models/notification/application.notification.model';

@Injectable({
  providedIn: 'root',
})
export class ManagerTokenService {
  private tokenKey = 'managerToken';
  private adminKey = 'managerAdmin';
  private userIdKey = 'managerUserId';

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  setUserId(userId: string) {
    localStorage.setItem(this.userIdKey, userId);
  }
  adminMode(): string | null {
    return localStorage.getItem(this.adminKey);
  }

  isAdminMode() {
    return this.adminMode() == 'superadmin';
  }

  setAdmin(role: string) {
    localStorage.setItem(this.adminKey, role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  setAdminMode(token : string, role : string, managerId : string) {
    this.setToken(token);
    this.setAdmin(role);
    this.setUserId(managerId);
  }

  clear() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    localStorage.removeItem(this.userIdKey);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ManagerProvider {
  static allManagerData: ManagerData;
  static managerUrl = '/website/manager/';
  static loginUrl = '/users/login/';
  static isNewPasswordSet = false;

  private populate: any[] = [
    'teams.players.user',
    {
      path: 'teams.from',
      populate: [{path: 'users', model: 'User'}],
    },
    {
      path: 'teams.players.device',
      select: '_id color number',
    },
    {
      path: 'players',
      populate: {path: 'user'},
    },
    'createdBy',
    {
      path: 'field',
      select: '_id name',
    },
  ];

  allManagerData$: ManagerData;
  complex: ComplexModel;
  hasLoaded = false;

  constructor(
    private http: HttpClient,
    private tokenService: ManagerTokenService,
  ) {
  }

  initData(data) {
    this.hasLoaded = true;
    this.allManagerData$ = data;
  }

  ready() {
    return this.hasLoaded;
  }

  login(data: any): Observable<object> {
    let role = 'complexmanager';
    if (data.superAdmin) {
      role = 'superadmin';
    }
    return this.http.post(Conf.apiBaseUrl + '/users/login/' + role, data);
  }

  getHome(): Observable<ManagerData> {
    if (this.tokenService.getToken()) {
      return this.http.post<ManagerData>(Conf.apiBaseUrl + ManagerProvider.managerUrl + 'home',
          {
            platform: {
              os: 'Web',
              udid: '',
              appversion: '1.0.0',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          },
      );
    } else {
      return throwError(() => new Error('No token'));
    }
  }

  getUserAsync(token: string): Observable<UserModel> {
    return this.http.get(Conf.apiBaseUrl + ManagerProvider.managerUrl + 'home', {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    }) as Observable<UserModel>;
  }

  getFieldsAsync(): Observable<Field[]> {
    return this.getHome().pipe(map((home) => (home['complex'] as ComplexModel).fields));
  }

  getFieldAsync(id: string): Observable<Field> {
    return this.getHome().pipe(map((home) => (home['complex'] as ComplexModel).fields.find((field) => field._id === id)));
  }

  getComplexAsync(): Observable<ComplexModel> {
    return this.getHome().pipe(map((home) => home['complex'] as ComplexModel));
  }

  getComplex() {
    return new ComplexModel(this.allManagerData$.complex);
  }

  getLeagues() {
    return this.allManagerData$.leagues.map((league) => new LeagueModel(league));
  }

  getTournaments() {
    return this.allManagerData$.tournaments.map((tournament) => new TournamentModel(tournament));
  }

  getAnnouncements() {
    return this.allManagerData$.notifications.map((notification) => new AnnouncementModel(notification));
  }

  getFollowers() {
    return this.http.get<any>(Conf.apiBaseUrl + '/socialnetwork/relationship/user/follower');
  }

  getDelayBetweenNotifications() {
    return this.allManagerData$.delayBetweenTwoNotifications;
  }

  getNewPasswordNeeded() {
    return this.allManagerData$.user['newPasswordNeeded'];
  }

  newPasswordIsNeeded() {
    return this.getNewPasswordNeeded() && !ManagerProvider.isNewPasswordSet;
  }

  getUser() {
    return this.allManagerData$.user;
  }

  getNotifs() {
    return this.allManagerData$.notifs.map((notification) => new ApplicationNotificationModel(notification));
  }

  getPlatformId() {
    return this.allManagerData$.platformId;
  }

  createLeague(newLeague: CompetitionModel) {
    newLeague.reduceTeamUsers();
    return this.http.post(Conf.apiBaseUrl + '/competitions/leagues/', newLeague.prepareLeagueForBackEnd(true));
  }

  patchLeague(leagueToPatch: CompetitionModel): Observable<CompetitionModel> {
    const leagueToSend = leagueToPatch.prepareLeagueForBackEnd();

    return this.http.patch<any>(Conf.apiBaseUrl + '/competitions/leagues/infos/' + leagueToPatch._id, {
      name: leagueToSend.name,
      isPrivate: leagueToSend.league.is_Private,
      matchPoints: leagueToSend.matchPoints,
      nbVersus: leagueToSend.nbVersus,
      startSeason: leagueToSend.league.startSeason,
      endSeason: leagueToSend.league.endSeason,
      teams: leagueToSend.teams,
      state: leagueToSend.state,
    });
  }

  createTournament(newTournament: CompetitionModel) {
    const tournamentToSend = newTournament.prepareTournamentForBackEnd();
    return this.http.post(Conf.apiBaseUrl + '/competitions/tournaments', tournamentToSend);
  }

  patchTournament(tournamentToPatch: CompetitionModel) {
    const tournamentToSend = tournamentToPatch.prepareTournamentForBackEnd();

    return this.http.patch<any>(Conf.apiBaseUrl + '/competitions/tournaments/infos/' + tournamentToPatch._id, {
      name: tournamentToSend.name,
      matchPoints: tournamentToSend.matchPoints,
      nbVersus: tournamentToSend.nbVersus,
      teams: tournamentToSend.teams,
      state: tournamentToSend.state,
      tournament: tournamentToSend.tournament,
    });
  }

  sendContactMessage(messageObject) {
    return this.http.post(Conf.apiBaseUrl + ManagerProvider.managerUrl + 'message', messageObject);
  }

  sendAnnouncement(notificationObject) {
    return this.http.post(Conf.apiBaseUrl + '/messages/manager/announcements', notificationObject);
  }

  getLeagueById(id: string): Observable<CompetitionModel> {
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
      {
        path: 'games', populate: [{path: 'field'}, {path: 'booking', select: '_id startAt endAt status initiator'}],
      },
    ];
    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/leagues/' + id, {params});
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
      {
        path: 'games', populate: [{path: 'booking', select: '_id startAt endAt status initiator'}],
      },
    ];
    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/tournaments/' + id, {params});
  }

  getCompetitionsWithUnbookedGames(complexId: string, startDate: Date): Observable<object> {
    const params = new HttpParams({
      fromObject: {
        startRange: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
    return this.http.get<any>(Conf.apiBaseUrl + '/competitions/complex/' + complexId + '/with-unbooked-games', {params});
  }

  getGameById(id: string, history = false): Observable<object> {
    const populate = this.populate.slice();

    if (history) {
      populate.push({path: 'history', match: {enabled: true}});
    }

    const params = new HttpParams({
      fromObject: {
        populate: JSON.stringify(populate),
      },
    });
    return this.http.get(Conf.apiBaseUrl + '/games/' + id, {params});
  }

  public searchUsers(value: string, usersExcluded: string[], limit: number = 100): Observable<any[]> {
    const url = Conf.apiBaseUrl + '/search/users/' + value + '?limit=' + limit + '&exclureIds=[' + usersExcluded + ']';
    return this.http.get<any>(url);
  }

  getOneRandomGuest(excludeGuests = []): Observable<object> {
    let response;
    if (excludeGuests && excludeGuests.length > 0) {
      response = this.http.get(Conf.apiBaseUrl + '/users/guest/random?exclude=' + JSON.stringify(excludeGuests));
    } else {
      response = this.http.get(Conf.apiBaseUrl + '/users/guest/random');
    }
    return response;
  }

  patchGame(id: string, data: any): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/games/' + id, data);
  }

  patchGameWithBooking(bookingId: string, data: any): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/booking/' + bookingId + '/update', {
      target: data,
      targetModel: 'Game',
    });
  }

  getShirts(): Observable<string[]> {
    return this.http.get<any[]>(Conf.apiBaseUrl + '/teams/shirts/');
  }

  sendShirt(shirt: string) {
    return this.http.post(Conf.apiBaseUrl + '/teams/shirts/', {data: shirt});
  }

  deleteShirt(shirt: string) {
    const shirtPath = shirt.replace(/\//g, '~');
    return this.http.delete(Conf.apiBaseUrl + '/teams/shirts/' + shirtPath);
  }

  postSubscription(subscriptionFields) {
    return this.http.post(Conf.apiBaseUrl + '/website/post-membership', subscriptionFields);
  }

  getNumberOfFollowers() {
    return this.http.get(Conf.apiBaseUrl + ManagerProvider.managerUrl + 'announcements/people');
  }

  transitionTournamentsPoolsToPlayoffs(id: string, data): Observable<object> {
    return this.http.patch(Conf.apiBaseUrl + '/competitions/tournaments/finalstages/' + id, data);
  }

  changePassword(data) {
    return this.http.patch(Conf.apiBaseUrl + ManagerProvider.managerUrl + 'password', data);
  }
}
