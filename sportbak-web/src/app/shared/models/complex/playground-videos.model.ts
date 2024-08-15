import {FBKModel} from '../futbak-parent-model';

const _default = {
  enabled: false,
  automaticSoccerFieldAssociation: true,
  codeSoccerField: 'none',
  provider: 'none',
};

export class PlaygroundVideosModel extends FBKModel {
    public enabled : boolean;
    public automaticSoccerFieldAssociation : boolean;
    public codeSoccerField : string;
    public provider : string;

    constructor(data:any) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}

