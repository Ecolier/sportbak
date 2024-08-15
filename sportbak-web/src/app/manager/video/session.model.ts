import {PeriodType} from './period.model';

export enum SessionEventType {
  BUZZ,
  PAUSE
}

export type SessionSchedule = {
  begin: number;
  pause: number;
  period: PeriodType;
}[];

export interface SessionEvent {
  type: SessionEventType;
  time: number;
  duration?: number;
}

export interface Session {
  id : string;
  createdAt: Date;
  now? : Date;
  teamName1: string;
  teamName2: string;
  scoreTeam1: number;
  scoreTeam2: number;
  sounds: boolean;
  ambiance: boolean;
  warmup: number;
  isPaused?: boolean;
  time: number;
  period: number;
  isStarted: boolean;
  pauseTime?: number;
  currentTime?: number;
  currentPeriod?: PeriodType;
  currentPeriodId?: number;
  schedule: SessionSchedule;
  events: Array<SessionEvent>;
  duration: number;
}

export function isSessionLike(object: any): object is Session {
  return 'createdAt' in object;
}
