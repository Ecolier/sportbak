import {Injectable} from '@angular/core';
import {Subject, Subscription, throwError} from 'rxjs';

type EventTarget = any;

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private channels: { [key: string]: {[k : string] : Subject<any>} } = {};
    private objectToId : { [key : string] : any} = {};
    private index : number = 0;

    private convertEventTargetToString(target: EventTarget) : string {
        var strTarget = ''    
        if (target) {
            for (let k of Object.keys(this.objectToId)) {
                if (this.objectToId[k] == k) {
                    strTarget = k;
                    break;
                }
            }

            if (!strTarget) {
                strTarget = (this.index++) + '';
                this.objectToId[strTarget] = target;
            }
        }
        return strTarget;
    }

    private removeTargetIfNeeded(target : EventTarget) {
        if(target) {
            let key = this.convertEventTargetToString(target);
            let topics = Object.keys(this.channels);
            let exists = false;
            for (let topic of topics) {
                if (this.channels[topic][key]) {
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                delete this.objectToId[key];
            }
        }
    }
 
    subscribe(target: EventTarget, topic: string, observer: (_: any) => void): Subscription {
        if (!target) 
            throw new Error('Target is null');
        if (!this.channels[topic]) {
            this.channels[topic] = {};
        }
        let key = this.convertEventTargetToString(target);
        this.channels[topic][key] = new Subject<any>();
        return this.channels[topic][key].subscribe(observer);
    }

    unsubscribe(target: EventTarget, topic: string): void {
        if (!target || !this.channels[topic]) 
            return;
        let key = this.convertEventTargetToString(target);
        let subject = this.channels[topic][key]
        if (subject) {
            subject.complete();
            subject.unsubscribe();
            delete this.channels[topic][key];
        }
        this.removeTargetIfNeeded(target);
    }

    unsubscribeAllTopics(target: EventTarget): void {
        if (!target) 
            return;
        let topics = Object.keys(this.channels);
        for (let topic of topics) {
            this.unsubscribe(target, topic);
        }
    }

    publish(topic: string, data: any = null): void {
        if (this.channels[topic]) {
            let targets = Object.keys(this.channels[topic]);
            for (let target of targets) {
                let subject = this.channels[topic][target];
                if (subject) {
                    subject.next(data);
                }
            }
        }
    }

    destroy(topic: string): void {
        if (!this.channels[topic])
            return;

        let targets = Object.keys(this.channels[topic]);
        for (let target of targets) {
            let subject = this.channels[topic][target];
            if (subject) {
                subject.complete();
                subject.unsubscribe();
            }
            this.removeTargetIfNeeded(target);
        }
        delete this.channels[topic];
    }
}