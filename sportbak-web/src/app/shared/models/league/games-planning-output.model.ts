import {FBKModel} from '../futbak-parent-model';
import {GameModel} from './game.model';


const _default = {
  date: null,
  game: null,
};


export class StartedAtOfGameUpdatedEventEmitterModel extends FBKModel {
    public date : Date;
    public game : GameModel;
    constructor(date, game) {
      const data = {
        date: date,
        game: game,
      };
      super(data, _default);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (FBKModel.needToBeConvertToFBKModel(this.game)) {
        this.game = new GameModel(this.game);
      }
    }
}

const _default2 = {
  date: null,
  game: null,
};


export class ClickOnGameventEmitterModel extends FBKModel {
    public game : GameModel;
    constructor(game) {
      const data = {
        game: game,
      };
      super(data, _default2);
    }

    public onBeforePatch() {
    }
    public onAfterPatch() {
      if (FBKModel.needToBeConvertToFBKModel(this.game)) {
        this.game = new GameModel(this.game);
      }
    }
}
