import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';

export class LocalGameSave {
  public game: GameModel;
  public complex: ComplexModel;

  constructor(_game: GameModel, _complex: ComplexModel) {
    this.game = _game;
    this.complex = _complex;
  }
}
