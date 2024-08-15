import {FBKModel} from '../futbak-parent-model';

const _defaultOutput = {
  success: false,
  msg: '',
};

export class WhitePaperOutputRequestModel extends FBKModel {
    public success : boolean;
    public msg: string;

    constructor(data:any = {}) {
      super(data, _defaultOutput);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
