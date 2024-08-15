import {NotificationPayloadModel} from './payload/notification-payload.model';
import {FBKModel} from '../../../../shared/models/futbak-parent-model';

const _default = {
  status: 'inapp',
  title: 'SportBak',
  message: null,
  payload: null,
  isSilent: false,
};

export type NotificationStatus = 'inapp' | 'tapping' | 'extern';

export class NotificationModel extends FBKModel {
  public status: NotificationStatus;
  public title: string;
  public message: string;
  public payload: NotificationPayloadModel;
  public isSilent: boolean;


  constructor(data: any = {}) {
    super(data, _default);
  }

  public onBeforePatch() {
  }

  public onAfterPatch() {
    // HERE YOU NEED TO CONSTRUCT CHILDREN
    if (this.payload) {
      this.payload = new NotificationPayloadModel(this.payload);
    }
  }

  public setPayload(data) {
    if (data) {
      this.isSilent = data.isSilent ? data.isSilent : false;
      this.payload = new NotificationPayloadModel(data);
    }
  }
}
