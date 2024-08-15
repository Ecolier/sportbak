const phasesTitles = [
  'final',
  'semi_finals',
  'quarter_finals',
  'round_16',
];
const phasesId = [3, 2, 1, 0];
const games = [1, 2, 4, 8];
export class CompetitionTree {
  phases = [];
  constructor() {
  }
  public setStage(step:number) {
    let phases;
    if (step == 3) {
      phases = 1;
    }
    if (step == 2) {
      phases = 2;
    }
    if (step == 1) {
      phases = 3;
    }
    if (step == 0) {
      phases = 4;
    }
    for (let indexPhases = 0; indexPhases < phases; indexPhases++) {
      this.phases.push({
        phasesTitles: phasesTitles[indexPhases],
        phasesId: phasesId[indexPhases],
        games: [],
      });
      for (let indexGames = 0; indexGames < games[indexPhases]; indexGames++) {
        this.phases[indexPhases].games.push({gameIndex: indexGames});
      }
    }
  }
}
