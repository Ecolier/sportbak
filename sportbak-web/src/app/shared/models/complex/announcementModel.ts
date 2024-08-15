import {FBKModel, ObjectId} from '../futbak-parent-model';

const _default = {
  _id: null,
  title: null,
  content: null,
  createdAt: null,
  targets: [],
  peopleOfTargets: 0,
};

export class AnnouncementModel extends FBKModel {
    public _id: ObjectId;
    title: string;
    content: string;
    createdAt: Date;
    targets: string[];
    peopleOfTargets: 0;

    constructor(data: any = {}) {
      super(data, _default);
      this.initCreatedAt();
    }

    public initCreatedAt() {
      this.createdAt = new Date(this.createdAt);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
