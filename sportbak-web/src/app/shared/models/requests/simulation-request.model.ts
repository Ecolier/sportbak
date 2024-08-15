import {FBKModel} from '../futbak-parent-model';


const _defaultInput = {
  firstname: null,
  lastname: null,
  phone: null,
  mail: null,
  complex: null,
  playgrounds: null,
  countries: null,
  language: '',
};

export class SimulationInputRequestModel extends FBKModel {
    public firstname : string;
    public lastname : string;
    public phone : string;
    public mail : string;
    public complex: string;
    public playgrounds : number;
    public countries: string;
    public language: string;

    constructor(data:any = {}) {
      super(data, _defaultInput);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}


const _defaultOutput = {
  bma: [],
  devise: '',
};

export class SimulationOutputRequestModel extends FBKModel {
    public bma : number[];
    public devise: string;

    constructor(data:any = {}) {
      super(data, _defaultOutput);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
    }
}
