import {convertToNoSecondNoMillisecondDate} from '../../manager/shared/helpers/date.helper';
import {FBKModel, ObjectId} from './futbak-parent-model';
import {UserModel} from './user/user.model';
import {FieldModel} from './field.model';

const _default = {
  _id: null,
  initiator: null,
  status: null,
  target: null,
  targetModel: 'Game',
  complex: null,
  field: null,
  booker: null,
  bookerFirstName: null,
  bookerLastName: null,
  bookerPhone: null,
  bookerEmail: null,
  startAt: null,
  endAt: null,
  bookerComment: null,
  managerComment: null,
  notificationDate: null,
  sport: null,
};

export class BookingModel extends FBKModel {
  public _id: string;
  public initiator:string;
  public status:string;
  public target: any;
  public targetModel: string;
  public complex: ObjectId;
  public field: ObjectId | FieldModel;
  public booker: ObjectId | UserModel;
  public bookerFirstName: string;
  public bookerLastName: string;
  public bookerPhone: string;
  public bookerEmail: string;
  public startAt: Date;
  public endAt: Date;
  public bookerComment:string;
  public managerComment:string;
  public maangerInfo:string;
  public notificationDate: Date;
  public sport: string;

  constructor(data:any) {
    super(data, _default, ['startAt', 'endAt']);
    if (this.startAt) {
      this.startAt = convertToNoSecondNoMillisecondDate(this.startAt);
      this.endAt = convertToNoSecondNoMillisecondDate(this.endAt);
    }
  }

  public onBeforePatch() {
  }
  public onAfterPatch() {
    if (FBKModel.needToBeConvertToFBKModel(this.booker)) {
      this.booker = new UserModel(this.booker);
    }
    if (FBKModel.needToBeConvertToFBKModel(this.field)) {
      this.field = new FieldModel(this.field);
    }
  }

  public isWaitingManagerValidation() {
    return this.initiator == 'booker' && (this.status == 'waiting' || this.status == 'request');
  }

  public isWaitingPlayerValidation() {
    return this.initiator == 'manager' && (this.status == 'waiting' || this.status == 'request');
  }

  public createTarget(gameInfo) {
    this.target = {
      id: gameInfo.game._id,
      _id: gameInfo.game._id,
      teams: [...gameInfo.game.teams],
      competition: {
        name: gameInfo.competition,
        type: gameInfo.type,
      },
    };
  }
}
