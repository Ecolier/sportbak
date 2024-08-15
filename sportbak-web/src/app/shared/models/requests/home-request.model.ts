import {ComplexModel} from '../complex/complex.model';
import {FBKModel} from '../futbak-parent-model';
import {TeamOfTheWeekModel} from '../team/team-of-the-week.model';

const _default = {
  futbakers: 0,
  games: 0,
  complexes: [],
  teams: [],
};

export class HomeOutputRequestModel extends FBKModel {
    public futbakers : number;
    public games : number;
    public complexes : ComplexModel[];
    public teams : TeamOfTheWeekModel[];


    constructor(data:any = {}) {
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.complexes && this.complexes.length) {
        const complexes = [];
        for (let i = 0; i < this.complexes.length; i++) {
          complexes.push(new ComplexModel(this.complexes[i]));
        }
        this.complexes = complexes;
      }
      if (this.teams && this.teams.length) {
        const teams = [];
        for (let i = 0; i < this.teams.length; i++) {
          teams.push(new TeamOfTheWeekModel(this.teams[i]));
        }
        this.teams = teams;
      }
    }
}
