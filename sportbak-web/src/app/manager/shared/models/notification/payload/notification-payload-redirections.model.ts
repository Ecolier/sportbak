import {FBKModel} from '../../../../../shared/models/futbak-parent-model';

const _default = {
  url: null,
  inputs: null,
  atRoot: false,
  onlyOnTappingNotification: true,
};

export class NotificationPayloadRedirectionsModel extends FBKModel {
    public url : string;
    public inputs : any;
    public atRoot : boolean;
    public onlyOnTappingNotification : boolean;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }
}
