import {SportConstants} from '../values/sport';
import {FBKModel, ObjectId} from './futbak-parent-model';

export interface Field {
  video_enabled: boolean;
  outdoor: boolean;
  position: number;
  sport: string;
  _id: string;
  name: string;
  complex: string;
  video_id: number;
  video_provider: string;
  createdAt: string;
  bookingSettings: any;
}

const _default = {
  _id: null,
  outdoor: false,
  position: 0,
  sport: SportConstants.default,
  name: null,
  complex: null,
  video_id: null,
  video_provider: null,
  video_enabled: false,
  createdAt: null,
};

export class FieldModel extends FBKModel {
  public _id: ObjectId;
  public outdoor: boolean;
  public position: number;
  public sport: string;
  public name: string;
  public complex: ObjectId;
  public video_id: number;
  public video_provider: string;
  public video_enabled: boolean;
  public createdAt: Date;

  constructor(data: any) {
    super(data, _default, ['createdAt']);
  }

  public onBeforePatch() {
  }

  public onAfterPatch() {
  }
}
