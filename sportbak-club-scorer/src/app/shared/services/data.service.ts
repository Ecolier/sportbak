import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SocketCommandesMessageAction } from '../constant/socket.commandes.action.constant';
import { FrontendInterface } from '../models/interface.model';
import Screensaver from '../models/screensaver.model';
import { KeyBindings } from './gamepad.service';
import { SocketService } from './socket.service';


export interface DataInit {
    mapping: KeyBindings;
    launchSessionFromFrontend: boolean;
    launchSessionFromFrontendWithWarmup : boolean;
    pauseSessionFromFrontend : boolean;
    stopSessionFromFrontend : boolean;
    frontendInterface : FrontendInterface,
    screensaver : Screensaver,
  }
  

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _dataInit$ = new ReplaySubject<DataInit>(1);
  dataInit$ = this._dataInit$.asObservable();
  constructor(private socketService: SocketService) {
    socketService.message(SocketCommandesMessageAction.DATA_INIT).subscribe(this._dataInit$);
  }
}