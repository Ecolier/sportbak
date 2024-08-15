import {FBKModel} from '../futbak-parent-model';

const _default = {
  color: '#f1b811',
  darkColor: '#c1930b',
  icon: 'shoe',
  label: 'Amateur',
};

export class PlayerLevel extends FBKModel {
  public color: string;
  public darkColor: string;
  public icon: string;
  public label: string;

  constructor(data: any) {
    super(data, _default);
  }

  public onBeforePatch() {}
  public onAfterPatch() {}
}
