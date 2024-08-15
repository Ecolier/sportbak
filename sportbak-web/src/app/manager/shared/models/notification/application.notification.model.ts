import {NotificationPayloadRedirectionsModel} from './payload/notification-payload-redirections.model';
import {SportConstants, SportType} from '../../../../shared/values/sport';
import {FBKModel, ObjectId} from '../../../../shared/models/futbak-parent-model';

const _default = {
  _id: null,
  createdAt: null,
  openedAt: null,
  seenAt: null,
  redirections: null,
  notificationId: null,
  title: null,
  message: null,
  type: null,
  data: null,
  sport: SportConstants.default,
};

export const ApplicationNotificationTypes = {
  relationship: 'relationship',
  booking: 'booking',
};

export type ApplicationNotificationType = 'relationship' | 'booking';
export class ApplicationNotificationModel extends FBKModel {
    public _id : ObjectId;
    public createdAt : Date;
    public openedAt : Date;
    public seenAt : Date;
    public type : ApplicationNotificationType;
    public notificationId : string;
    public title : string;
    public message : string;
    public data : any;
    public sport: SportType;

    constructor(data:any = {}) {
      super(data, _default, ['createdAt', 'openedAt', 'seenAt']);
    }

    public onBeforePatch(data) {
      let redirectionObj : NotificationPayloadRedirectionsModel = null;
      if (data.redirections) {
        try {
          redirectionObj = JSON.parse(data.redirections);
        } catch (e) {}
      }
      data.redirections = redirectionObj;
    }
    public onAfterPatch() {
      if (this.data && typeof this.data === 'string') {
        try {
          this.data = JSON.parse(this.data);
        } catch (err) {
          this.data = null;
        }
      }
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }
}
