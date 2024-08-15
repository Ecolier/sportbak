import {FBKModel} from '../futbak-parent-model';

const _default = {
  saves: 0,
  concededgoals: 0,
  playedballs: 0,
  successfulpasses: 0,
  passaccuracy: 0,
  totalduels: 0,
  successfulduels: 0,
  globalrating: 0,
  footgamerating: 0,
  dueslrating: 0,
  savesrating: 0,
};

export class PlayerGoalKeeperModel extends FBKModel {
 public saves: number;
 public concededgoals: number;
 public playedballs: number;
 public successfulpasses: number;
 public passaccuracy: number;
 public totalduels: number;
 public successfulduels: number;
 public globalrating: number;
 public footgamerating: number;
 public duelsrating: number;
 public savesrating: number;

 constructor(data: any) {
   super(data, _default);
 }

 public onBeforePatch() {}
 public onAfterPatch(): void {}
}
