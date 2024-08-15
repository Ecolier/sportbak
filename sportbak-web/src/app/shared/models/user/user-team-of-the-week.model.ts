import {defaultUserLevel} from '../../services/user-level.service';
import {FBKStaticUrls} from '../../values/static-urls';
import {FBKModel} from '../futbak-parent-model';

const _default = {
  nickname: null,
  picture: null,
  level: defaultUserLevel,
  complex: null,
  globalrating: null,
};

export class UserTeamOfTheWeekModel extends FBKModel {
    public nickname: string;
    public picture: string;
    public level: number;
    public complex: string;
    public globalrating : number;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }

    public getPictureLink(): string {
      return this.picture ? FBKStaticUrls.user.picture.base + this.picture : FBKStaticUrls.user.picture.guest;
    }

    public static getGuestPicture() {
      return FBKStaticUrls.user.picture.guest;
    }
}
