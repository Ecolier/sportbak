import {FBKModel} from '../futbak-parent-model';


const _default = {
  bestPlayer: null,
  bestTeam: null,
  lastGame: null,
};

export class CompetitionSummaryModel extends FBKModel {
    public bestPlayer : {
        nickname: string;
        picture: string;
        stats : {
            globalrating : number;
        };
        team : {
            name : string;
            shirt : string;
        };
    };
    public bestTeam : {
        name : string;
        shirt : string;
        stats : {
            globalrating : number;
        };
    };
    public lastGame: string;

    constructor(data: any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}

