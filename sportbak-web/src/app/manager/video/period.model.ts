export enum PeriodType {
  WARM_UP = 0,
  GAME = 1,
  HALF_TIME = 2
};

export interface PeriodTimings {
  type: PeriodType;
  // duration: number;
  startTime: number;
  // initialEndTime: number;
  // endTimeWithPause: number;
}
