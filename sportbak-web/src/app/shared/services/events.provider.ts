import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {FBKComponent} from '../components/base.component';

type EventTarget = string | FBKComponent;
type EventFBKTarget = FBKComponent;

@Injectable({
  providedIn: 'root',
})
export class SBKEventsProvider {
  private channels: { [key: string]: any } = {};

  private convertEventTargetToString(target: EventTarget) : string {
    let strTarget = null;
    if (typeof target === 'string') {
      strTarget = target;
    } else {
      strTarget = (target as EventFBKTarget).getUniqueComponentId();
    }
    return strTarget;
  }

  subscribe(target: EventTarget, topic: string, observer: (_: any) => void): Subscription {
    if (!this.channels[topic]) {
      this.channels[topic] = {};
    }

    this.channels[topic][this.convertEventTargetToString(target)] = new Subject<any>();

    return this.channels[topic][this.convertEventTargetToString(target)].subscribe(observer);
  }

  unsubscribe(target: EventTarget, topic: string): void {
    if (!target || !this.channels[topic]) {
      return;
    }

    const subject = this.channels[topic][this.convertEventTargetToString(target)];
    if (subject) {
      subject.complete();
      delete this.channels[topic][this.convertEventTargetToString(target)];
    }
  }

  unsubscribeAllTopics(target: EventTarget): void {
    if (!target) {
      return;
    }
    const topics = Object.keys(this.channels);
    for (const topic of topics) {
      this.unsubscribe(target, topic);
    }
  }

  publish(topic: string, data: any = null): void {
    if (this.channels[topic]) {
      const targets = Object.keys(this.channels[topic]);
      for (const target of targets) {
        const subject = this.channels[topic][target];
        if (subject) {
          subject.next(data);
        }
      }
    }
  }

  destroy(topic: string): void {
    if (!this.channels[topic]) {
      return;
    }

    const targets = Object.keys(this.channels[topic]);
    for (const target of targets) {
      const subject = this.channels[topic][target];
      if (subject) {
        subject.complete();
      }
    }
    delete this.channels[topic];
  }
}
