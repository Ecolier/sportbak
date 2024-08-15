import {FBKModel, ObjectId} from '../futbak-parent-model';

const _default = {
  _id: null,
  name: null,
};

export class ComplexPreferedModel extends FBKModel {
    public _id : ObjectId;
    public name : string;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
