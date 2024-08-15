import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Field } from '../models/field.model';
import { ConfigService } from './config.service';
import { SocketService } from './socket.service';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  get credentials() { 
    return {
      username: sessionStorage.getItem('username') ?? '',
      password: sessionStorage.getItem('password') ?? '' 
    }
  }
  
  set credentials(credentials: Credentials) { 
    sessionStorage.setItem('username', credentials.username);
    sessionStorage.setItem('password', credentials.password)
  }

  private _needsOnboarding = new ReplaySubject<void>(1);
  get needsOnboarding() {
    return this._needsOnboarding.asObservable();
  }

  private _error = new Subject<void>();
  get error() {
    return this._error.asObservable();
  }

  private _fields = new Subject<Field[]>();
  get fields() {
    return this._fields.asObservable();
  }

  private _success = new Subject<void>();
  get success() {
    return this._success.asObservable();
  }

  private _logged = new ReplaySubject()
  
  constructor(
    private router: Router, 
    private socketService: SocketService,
    private configService: ConfigService) {
    this.socketService.message('onboarding/needed').subscribe(this._needsOnboarding);
    this.socketService.message('onboarding/error').subscribe(this._error);
    this.socketService.message('onboarding/fields').pipe(map(data => data.fields)).subscribe(this._fields);
    this.socketService.message('onboarding/success').subscribe(this._success);
  }
  
  login(username: string, password: string) {
    this.socketService.send('onboarding/login', { username: username, password: password });
  }
  
  selectField(complexId: string, fieldId: string) {
    this.socketService.send('onboarding/selectField', {complexId: complexId, fieldId: fieldId});
  }
  
}