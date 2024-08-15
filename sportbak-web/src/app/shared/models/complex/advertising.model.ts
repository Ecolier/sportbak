import {FBKModel} from '../futbak-parent-model';
import {AdvertisingPictureModel} from './advertising-picture.model';

const _default = {
  titile: null,
  pictures: [],
};


export class AdvertisingModel extends FBKModel {
    public title : string;
    public pictures: AdvertisingPictureModel[];

    constructor(data:any) {
      super(data, _default);
    }


    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.pictures && this.pictures.length) {
        const pictures = [];
        for (let i = 0; i < this.pictures.length; i++) {
          pictures.push(new AdvertisingPictureModel(this.pictures[i]));
        }
        this.pictures = pictures;
      }
    }
}
