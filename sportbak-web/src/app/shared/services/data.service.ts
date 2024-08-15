import {Injectable} from '@angular/core';
import {ComplexModel} from '../models/complex/complex.model';
import {HomeOutputRequestModel} from '../models/requests/home-request.model';
import {TeamOfTheWeekModel} from '../models/team/team-of-the-week.model';
import {SBKEventsIds} from '../values/events-ids';
import {SBKEventsProvider} from './events.provider';
import {FBKRequestProvider} from './requests/requests.service';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  public initialized : boolean = false;

  public futbakers : number = 0;
  public games : number = 0;
  public complexes : ComplexModel[] = [];
  public teams : TeamOfTheWeekModel[] = null;

  constructor(
    private request : FBKRequestProvider,
    private events : SBKEventsProvider,
  ) { }

  init() {
    this.request.getHome().subscribe((data : HomeOutputRequestModel) => {
      if (data) {
        this.futbakers = data.futbakers;
        this.games = data.games;
        this.complexes = data.complexes;
        this.teams = data.teams;
        this.initialized = true;
        this.events.publish(SBKEventsIds.dataInitialized);
      } else {
        // retry
        setTimeout(() => {
          this.init();
        }, 1000);
      }
    });
  }

  subscribeDataUpdated(observer: (_: any) => void) {
    return this.events.subscribe('dataService', SBKEventsIds.dataInitialized, observer);
  }
}
