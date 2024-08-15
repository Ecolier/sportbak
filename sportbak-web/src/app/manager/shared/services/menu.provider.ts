import {Injectable} from '@angular/core';
import {SBKEventsProvider} from 'src/app/shared/services/events.provider';
import {SBKEventsIds} from 'src/app/shared/values/events-ids';

@Injectable({
  providedIn: 'root',
})
export class ManagerMenuProvider {
  constructor(
    public events: SBKEventsProvider,
  ) {
  }

  show() {
    this.events.publish(SBKEventsIds.showManagerMenu);
  }

  hide() {
    this.events.publish(SBKEventsIds.hideManagerMenu);
  }
}
