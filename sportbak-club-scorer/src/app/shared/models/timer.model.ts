export interface Timer {
  currentTime: number;
  pauseTimer: number;
  timeLeft : number;
  periodDuration: number;
  periodDurationWithPause: number;
  currentPeriod: number;
  isLastPeriod: boolean;
}