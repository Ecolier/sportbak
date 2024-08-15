import {FBKModel} from '../futbak-parent-model';
import {UserTeamOfTheWeekModel} from '../user/user-team-of-the-week.model';

const _default = {
  from: null,
  to: null,
  users: null,
};

export class TeamOfTheWeekModel extends FBKModel {
    public from: Date;
    public to: Date;
    public users: UserTeamOfTheWeekModel[];

    constructor(data:any = {}) {
      super(data, _default, ['from', 'to']);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.users && this.users.length) {
        const users = [];
        for (let i = 0; i < this.users.length; i++) {
          users.push(new UserTeamOfTheWeekModel(this.users[i]));
        }
        this.users = users;
      }
    }
}
