import {defaultUserLevel} from '../../services/user-level.service';
import {FBKStaticUrls} from '../../values/static-urls';
import {ComplexPreferedModel} from '../complex/complexe-prefered.mode';
import {FBKModel, ObjectId} from '../futbak-parent-model';

const _default = {
  _id: null,
  nickname: null,
  username: null,
  numPhone: '',
  email: null,
  firstname: null,
  lastname: null,
  role: null,
  picture: null,
  level: defaultUserLevel,
  position: null,
  awards: null,
  status: 'guest',
  complexPrefered: null,
};

export class UserModel extends FBKModel {
    public _id : ObjectId;
    public nickname: string;
    public username: string;
    public numPhone: string;
    public email: string;
    public firstname: string;
    public lastname: string;
    public role: string;
    public picture: string; // use getPictureLink()
    public level: number;
    public position: string;
    public status : string;
    public complexPrefered : ComplexPreferedModel

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (FBKModel.needToBeConvertToFBKModel(this.complexPrefered)) {
        this.complexPrefered = new ComplexPreferedModel(this.complexPrefered);
      }
    }

    public getPictureLink(): string {
      return this.picture ? FBKStaticUrls.user.picture.base + this.picture : FBKStaticUrls.user.picture.guest;
    }

    public static getGuestPicture() {
      return FBKStaticUrls.user.picture.guest;
    }
}
