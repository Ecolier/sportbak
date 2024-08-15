import {FBKModel} from '../../../../../shared/models/futbak-parent-model';

const _default = {
  app: false,
  home: false,
  badges: true,
  user: false,
  games: false,
  summary: false,
  version: false,
  relationShipUser: false,
  relationShipComplex: false,
  agreements: false,
  notifications: true,
  informations: true,
  onlyOnTappingNotification: false,
};

export const NotificationPayloadReloadDefault = _default;
export class NotificationPayloadReloadModel extends FBKModel {
    public app : boolean;
    public home : boolean;
    public badges : boolean;
    public user : boolean;
    public games : boolean;
    public summary : boolean;
    public version : boolean;
    public relationShipUser : boolean;
    public relationShipComplex : boolean;
    public agreements : boolean;
    public notifications : boolean;
    public informations : boolean;
    public onlyOnTappingNotification : boolean;

    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      // HERE YOU NEED TO CONSTRUCT CHILDREN
    }

    public allHomeValuesAreFalse() {
      let result = true;
      const keys = ['badges', 'user', 'games', 'summary', 'relationShipUser', 'relationShipComplex', 'version', 'agreements', 'notifications', 'informations'];
      for (const key of keys) {
        if (this[key]) {
          result = false;
          break;
        }
      }

      return result;
    }
}
