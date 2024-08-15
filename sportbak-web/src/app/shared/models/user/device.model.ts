import {FBKModel} from '../futbak-parent-model';
import {UserModel} from './user.model';

const _default = {
  _id: null,
  playground: null,
  status: null,
  createdAt: null,
  user: null,
  number: null,
  color: null,
};

export class DeviceModel extends FBKModel {
  public _id: string;
  public playground: string;
  public status: string;
  public createdAt: Date;
  public user: UserModel;
  public number: number;
  public color: string;

  constructor(data:any) {
    super(data, _default);
  }

  public onBeforePatch() {
  }
  public onAfterPatch() {
    // HERE YOU NEED TO CONSTRUCT CHILDREN
    if (FBKModel.needToBeConvertToFBKModel(this.user)) {
      this.user = new UserModel(this.user);
    }
  }
}
