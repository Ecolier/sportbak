import { EventEmitter, Injectable } from '@angular/core';
import * as moment from 'moment';
import { Session, SessionEventType } from '../models/session.model';
import { Timer } from '../models/timer.model';
import { AdjustingInterval } from '../utilities/adjusting-interval';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  timer?: Timer;
  session?: Session;
  date: Date = new Date();

  onUpdateTimer: EventEmitter<Timer> = new EventEmitter();
  onUpdateDate: EventEmitter<Date> = new EventEmitter();
  onNewPeriod: EventEmitter<Timer> = new EventEmitter();
  onEnded: EventEmitter<Timer> = new EventEmitter();
  adjustingInterval: AdjustingInterval;

  start() { this.adjustingInterval.start(); }
  stop() { this.adjustingInterval.stop(); }

  constructor(private sessionService: SessionService) {

    this.adjustingInterval = new AdjustingInterval(() => {

      this.date = new Date();
      this.updateDate();

      if (this.timer) {
        /*if (this.timer.currentPeriod === 0 && this.timer.currentTime === 0) {
          this.onNewPeriod.emit(this.timer);
        }*/
        if (this.session?.isPaused) { this.timer.pauseTimer = this.timer.pauseTimer + 1; }
        else {
          this.timer.currentTime += 1;
          this.timer.timeLeft = this.timer.timeLeft - 1;
          if (this.timer.periodDuration === this.timer.currentTime) {
            if (this.timer.isLastPeriod)  {
              this.endTimer();
            }
            else {
              if (this.calcCurrentDuration(this.timer.currentPeriod + 1) == 0) {
                this.timer.currentPeriod = this.timer.currentPeriod + 1;
              }
              this.timer.currentPeriod = this.timer.currentPeriod + 1;
              this.timer.isLastPeriod = this.isLastPeriod(this.timer.currentPeriod);
              this.timer.periodDuration = this.calcCurrentDuration(this.timer.currentPeriod);
              this.timer.periodDurationWithPause = this.calcCurrentDurationWithPause(this.timer.currentPeriod);
              this.timer.currentTime = 0;
              this.onNewPeriod.emit(this.timer);
            }
          }
        }
        this.updateTimer();
      }

    }, 1000);

    this.sessionService.session$.subscribe(session => {
      if (this.session && session && this.session.id != session.id) {
        this.endTimer();
      }

      this.session = session;

      if (this.session) {
        let createdAt =  this.session.createdAt;
        if (this.session.now) { // allow to recalibrate date with remove offset between two clients
          let ms = this.session.now.getTime();
          let offset = new Date().getTime() - ms;
          createdAt = new Date(createdAt.getTime() + offset);
        }
        const relCurrentTimeMatch = Math.max(0, moment().diff(createdAt, 'second')); // add security to not start in negative (<0)
        let found = false;
        let currentPeriod = 1;
        while (!found && currentPeriod < this.session.schedule.length) {
          if (relCurrentTimeMatch < this.session.schedule[currentPeriod].begin) {
            currentPeriod = currentPeriod - 1
            found = true;
          } else {
            currentPeriod++;
          }
        }

        if (!found) {
          currentPeriod = this.session.schedule.length - 1;
        }

        if (!this.timer) {

          const lastPeriod = this.isLastPeriod(currentPeriod);
          let currentDuration = this.calcCurrentDuration(currentPeriod);
          let currentDurationWithPause = this.calcCurrentDurationWithPause(currentPeriod);
          let pauseTimer = 0;
          let currentPause = 0;
          for (let e of this.session.events) {
            if (e.type == SessionEventType.PAUSE) {
              if (e.duration) {
                pauseTimer += e.duration;
              } else {
                currentPause = (moment().diff(this.session.createdAt, 'second')- e.time);
                pauseTimer += currentPause;
              }
            }
          }

          const currentTime = relCurrentTimeMatch - this.session.schedule[currentPeriod].begin - this.session.schedule[currentPeriod].pause - currentPause;
          const timeLeft = this.session.duration - relCurrentTimeMatch;

          this.timer = {
            currentTime: currentTime,
            pauseTimer: pauseTimer,
            periodDuration: currentDuration,
            periodDurationWithPause: currentDurationWithPause,
            currentPeriod: currentPeriod,
            isLastPeriod: lastPeriod,
            timeLeft : timeLeft
          };

          if (this.timer.currentTime == 0) {
            this.onNewPeriod.emit(this.timer);
          }
          this.updateTimer();
        }
      } else {
        this.endTimer();
      }

    });
  }

  endTimer() {
    const timer = this.timer;
    if (timer) {
      this.onEnded.emit(timer);
    }
    this.timer = undefined;
    this.updateTimer();
  }

  running() : boolean {
    return this.timer ? true : false;
  }

  isWarmup(currendPeriod : number) : boolean {
    return currendPeriod == 0; 
  }

  isTimeBreak(currendPeriod : number) : boolean {
    return currendPeriod != 0 && currendPeriod % 2 == 0;
  }

  isPlayingPeriod(currendPeriod : number) : boolean {
    return currendPeriod >= 0 && !this.isWarmup(currendPeriod) && !this.isTimeBreak(currendPeriod);
  }

  getPlayingPeriodNumber(currendPeriod : number) : number {
    let result = -1; // error
    if (this.isPlayingPeriod(currendPeriod)) {
      if (currendPeriod == 1) {
        result = 1;
      } else {
        result =  Math.ceil(currendPeriod / 2); 
      }
    }
    return result;
  }

  isLastPeriod(currentPeriod: number) {
    return ((this.session!.schedule.length - 1) == currentPeriod);
  }

  calcCurrentDuration(currentPeriod: number) {
    if (this.isLastPeriod(currentPeriod)) {
      return this.session!.duration - this.session!.schedule[currentPeriod].begin - this.session!.schedule[currentPeriod].pause;
    } else {
      return this.session!.schedule[currentPeriod + 1].begin - this.session!.schedule[currentPeriod].begin - this.session!.schedule[currentPeriod].pause;
    }

  }

  calcCurrentDurationWithPause(currentPeriod: number) {
    if (this.isLastPeriod(currentPeriod)) {
      return this.session!.duration - this.session!.schedule[currentPeriod].begin;
    } else {
      return this.session!.schedule[currentPeriod + 1].begin - this.session!.schedule[currentPeriod].begin;
    }
  }

  updateDate() {
    this.onUpdateDate.emit(this.date);
  }

  updateTimer() {
    this.onUpdateTimer.emit(this.timer);
  }
}