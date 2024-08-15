import {FBKModel} from '../../../../../shared/models/futbak-parent-model';

const _default = {
  enabled: false,
  onlyDifferentPage: true,
  title: null,
  message: null,
  redirection: true,
  onlyInApp: true,
};

export const NotificationPayloadToastDefault = _default;
export class NotificationPayloadToastModel extends FBKModel {
    public enabled : boolean;
    public onlyDifferentPage : boolean;
    public title : string;
    public message : string;
    public redirection : boolean;
    public onlyInApp : boolean;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }
}
