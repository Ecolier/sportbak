import {FBKModel} from '../futbak-parent-model';

const _default = {
  titile: null,
  filename: null,
  type: null,
};


export class AdvertisingPictureModel extends FBKModel {
    public title : string;
    public filename: string;
    public type : string;

    constructor(data:any) {
      super(data, _default);
    }


    public onBeforePatch() {
    }
    public onAfterPatch() {
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }
}
