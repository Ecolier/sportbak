import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Conf} from 'src/app/conf';
import {UserModel} from '../models/user/user.model';


@Injectable({
  providedIn: 'root',
})
export class UserProvider {
  constructor(
    private http: HttpClient,
  ) { }

  search(input): Observable<any[]> {
    return this.http
        .get<any[]>(Conf.apiBaseUrl + '/users/search?limit=10&name=' + input)
        .pipe(
            map((result) => {
              if (result) {
                let users = result['result'];
                if (!users) {
                  users = [];
                }
                return _.map(users, (user) => {
                  return new UserModel(user);
                });
              }
            }),
        );
  }

  get(params: any = {}): Observable<UserModel[]> {
    _.set(params, 'selectors.role', 'player');
    return this.http
        .get<any[]>(Conf.apiBaseUrl + '/users', {
          params: params,
        })
        .pipe(
            map((users) => {
              users.sort(
                  function(a, b) {
                    if (a.nickname.toLowerCase() < b.nickname.toLowerCase()) return -1;
                    if (a.nickname.toLowerCase() > b.nickname.toLowerCase()) return 1;
                    return 0;
                  },
              );
              return _.map(users, (user) => {
                return new UserModel(user);
              });
            }),
        );
  }

  getOneRandomGuest(excludeGuests = []) : Observable<Object> {
    let obs = null;
    if (excludeGuests && excludeGuests.length > 0) {
      obs = this.http.get(Conf.apiBaseUrl + '/users/guest/random?exclude='+JSON.stringify(excludeGuests));
    } else {
      obs = this.http.get(Conf.apiBaseUrl + '/users/guest/random');
    }
    return obs;
  }

  login(data: any): Observable<Object> {
    return this.http.post(Conf.apiBaseUrl + '/users/login', data);
  }

  getHome(token): Observable<Object> {
    return this.http.get(Conf.apiBaseUrl + '/website/manager/home', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)});
  }
}
