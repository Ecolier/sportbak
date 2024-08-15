import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {Session, SessionEventType} from '../session.model';
import {SessionService} from '../session.service';
import {AdjustingInterval} from './adjusting-interval';
import {Timer} from './timer.model';

export class TimerService {
  timer?: Timer;
  session?: Session;
  date: Date = new Date();

  onUpdateTimer: EventEmitter<Timer> = new EventEmitter();
  onUpdateDate: EventEmitter<Date> = new EventEmitter();
  onNewPeriod: EventEmitter<Timer> = new EventEmitter();

  adjustingInterval: AdjustingInterval;

  update(session: Session) {
    if (this.session && session && this.session.id != session.id) {
      this.timer = undefined;
      this.updateTimer();
    }

    this.session = session;

    if (this.session) {
      let createdAt = this.session.createdAt;
      if (this.session.now) { // allow to recalibrate date with remove offset between two clients
        const ms = new Date(this.session.now).getTime();
        const offset = new Date().getTime() - ms;
        createdAt = new Date(new Date(createdAt).getTime() + offset);
      }
      const relCurrentTimeMatch = Math.max(0, moment().diff(createdAt, 'second')); // add security to not start in negative (<0)
      let found = false;
      let currentPeriod = 1;
      while (!found && currentPeriod < this.session.schedule.length) {
        if (relCurrentTimeMatch < this.session.schedule[currentPeriod].begin) {
          currentPeriod = currentPeriod - 1;
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
        const currentDuration = this.calcCurrentDuration(currentPeriod);
        const currentDurationWithPause = this.calcCurrentDurationWithPause(currentPeriod);
        let pauseTimer = 0;
        let currentPause = 0;
        for (const e of this.session.events) {
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
          timeLeft: timeLeft,
        };

        this.updateTimer();
      }
    } else {
      this.timer = undefined;
      this.updateTimer();
    }
  }

  start() {
    this.adjustingInterval = new AdjustingInterval(() => {
      this.date = new Date();
      this.updateDate();

      if (this.timer) {
        if (this.timer.currentPeriod === 0 && this.timer.currentTime === 0) {
          this.onNewPeriod.emit(this.timer);
        }
        if (this.session?.isPaused) {
          this.timer.pauseTimer = this.timer.pauseTimer + 1;
        } else {
          this.timer.currentTime += 1;
          this.timer.timeLeft = this.timer.timeLeft - 1;
          if (this.timer.periodDuration === this.timer.currentTime) {
            if (this.timer.isLastPeriod) this.timer = undefined;
            else {
              if (this.calcCurrentDuration(this.timer.currentPeriod + 1) == 0) {
                this.timer.currentPeriod = this.timer.currentPeriod + 1;
              }
              this.onNewPeriod.emit(this.timer);
              this.timer.currentPeriod = this.timer.currentPeriod + 1;
              this.timer.isLastPeriod = this.isLastPeriod(this.timer.currentPeriod);
              this.timer.periodDuration = this.calcCurrentDuration(this.timer.currentPeriod);
              this.timer.periodDurationWithPause = this.calcCurrentDurationWithPause(this.timer.currentPeriod);
              this.timer.currentTime = 0;
            }
          }
        }
        this.updateTimer();
      }
    }, 1000);

    this.adjustingInterval.start();
  }

  stop() {
    this.adjustingInterval.stop();
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
