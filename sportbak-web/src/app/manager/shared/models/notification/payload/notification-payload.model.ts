import {NotificationPayloadRedirectionsModel} from './notification-payload-redirections.model';
import {NotificationPayloadReloadDefault, NotificationPayloadReloadModel} from './notification-payload-reload.model';
import {NotificationPayloadToastDefault, NotificationPayloadToastModel} from './notification-payload-toast.model';
import {FBKModel} from '../../../../../shared/models/futbak-parent-model';
import {SportConstants, SportType} from '../../../../../shared/values/sport';

const _default = {
  id: null,
  redirections: [],
  data: null,
  reload: NotificationPayloadReloadDefault,
  toast: NotificationPayloadToastDefault,
  sport: SportConstants.default,
  type: null,
  reference: null,
};

export class NotificationPayloadModel extends FBKModel {
  public id: string;
  public data: any;
  public redirections: NotificationPayloadRedirectionsModel[];
  public reload: NotificationPayloadReloadModel;
  public toast: NotificationPayloadToastModel;
  public sport: SportType;
  public type: string;
  public reference: string;

  constructor(data: any = {}) {
    super(data, _default);
  }

  public onBeforePatch() {
  }

  public onAfterPatch() {
    // HERE YOU NEED TO CONSTRUCT CHILDREN
    if (this.redirections && this.redirections.length) {
      const redirections = [];
      for (const redirection of this.redirections) {
        redirections.push(new NotificationPayloadRedirectionsModel(redirection));
      }
      this.redirections = redirections;
    }
    if (this.reload) {
      this.reload = new NotificationPayloadReloadModel(this.reload);
    }
    if (this.toast) {
      this.toast = new NotificationPayloadToastModel(this.toast);
    }
  }
}
