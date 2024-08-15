import {FBKModel} from '../futbak-parent-model';

const _default = {
  country: null,
  zipcode: null,
  city: null,
  street: null,
};

export class ComplexFullAddressModel extends FBKModel {
    public country : string;
    public zipcode : string;
    public city : string;
    public street : string;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
