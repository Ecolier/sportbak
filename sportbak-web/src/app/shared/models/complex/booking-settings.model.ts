import {FBKModel, ObjectId} from '../futbak-parent-model';

const _data = {
  _id: null,
  bookingValidation: null,
  enable: null,
  slotDurationDefault: null,
  slotDurationFixed: null,
  slotDurationAuthorized: null,
  target: null,
  visibility: null,
};

export class BookingSettingsModel extends FBKModel {
    public _id: ObjectId;
    public bookingValidation: boolean;
    public enable: boolean;
    public slotDurationDefault: number;
    public slotDurationFixed: boolean;
    public slotDurationAuthorized: number[];
    public target: ObjectId;
    public visibility: string;
    constructor(data:any = {}) {
      super(data, _data);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
