import {FBKModel, ObjectId} from '../futbak-parent-model';
import {AdvertisingModel} from './advertising.model';
import {ComplexModel} from './complex.model';
import {PlaygroundVideosModel} from './playground-videos.model';

const _default = {
  _id: null,
  title: null,
  name: null,
  complex: null,
  advertisings: [],
  videos: null,
  isUsingStartTime: false,
};


export class PlaygroundModel extends FBKModel {
    public _id : ObjectId;
    public title: string;
    public name : string;
    public complex : ObjectId | ComplexModel;
    public advertisings : AdvertisingModel[];
    public videos : PlaygroundVideosModel;
    public isUsingStartTime: boolean;

    constructor(data:any) {
      super(data, _default);
    }


    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (FBKModel.needToBeConvertToFBKModel(this.complex)) {
        this.complex = new ComplexModel(this.complex);
      }
      if (this.advertisings && this.advertisings.length) {
        const advertisings = [];
        for (let i = 0; i < this.advertisings.length; i++) {
          advertisings.push(new AdvertisingModel(this.advertisings[i]));
        }
        this.advertisings = advertisings;
      }
      if (this.videos) {
        this.videos = new PlaygroundVideosModel(this.videos);
      }
    }
}

