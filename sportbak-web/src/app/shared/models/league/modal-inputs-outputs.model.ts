import {FBKModel} from '../futbak-parent-model';
import {LeagueTeam} from './league-team.model';

export abstract class ModalOutputsModel extends FBKModel {
  constructor(data:any, _default) {
    super(data, _default);
  }

    abstract onBeforePatch();
    abstract onAfterPatch();
}

export abstract class ModalInputsModel extends FBKModel {
  // static runModal(mc : ModalController, page : any, data : ModalInputsModel, options = null) {
  //     let modal = mc.create(page, data, options);
  //     if (modal) {
  //         modal.present();
  //     }
  //     return modal;
  // }

  constructor(data:any, _default) {
    super(data, _default);
  }

    abstract onBeforePatch();
    abstract onAfterPatch();
}

// *********************************************** //
// ************  Select Team By Shirt *************** //
// *********************************************** //

export class SelectTeamByShirtModalInputsModel extends ModalInputsModel {
  public static create(teams : LeagueTeam[]) {
    return new SelectTeamByShirtModalInputsModel({teams: teams});
  }
    public teams : LeagueTeam[];

    constructor(data: any) {
      super(data, {teams: null});
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.teams && this.teams.length) {
        const teams = [];
        for (let i = 0; i < this.teams.length; i++) {
          teams.push(new LeagueTeam(this.teams[i]));
        }
        this.teams = teams;
      }
    }
}

export class SelectTeamByShirtModalOutputsModel extends ModalOutputsModel {
  public static create(team : LeagueTeam) {
    return new SelectTeamByShirtModalOutputsModel({team: team});
  }
    public team : LeagueTeam;

    constructor(data: any) {
      super(data, {team: null});
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (this.team) {
        this.team = new LeagueTeam(this.team);
      }
    }
}
