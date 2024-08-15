import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Complex } from '../models/complex.model';
import { Field } from '../models/field.model';
import { SocketService } from './socket.service';

export interface User {
  field: Field;
  complex: Complex;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user$ = new ReplaySubject<User>(1);
  user$ = this._user$.asObservable();
  constructor(private socketService: SocketService) {
    socketService.message('data/logged').subscribe(this._user$);
  }
}