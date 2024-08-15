import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {TournamentGame, TournamentTeam} from '../../shared/helpers/tournament-helpers';

const ROUND_OF_16_NB_OF_GAMES = 8;
const QUARTER_FINALS_NB_OF_GAMES = 4;
const SEMI_FINALS_NB_OF_GAMES = 2;
const FINAL_NB_OF_GAMES = 1;

@Component({
  selector: 'manager-tournament-playoffs',
  templateUrl: './manager-tournament-playoffs.component.html',
  styleUrls: ['./manager-tournament-playoffs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentPlayoffsComponent extends FBKComponent {
  roundOf16Games: TournamentGame[];
  quarterFinalsGames: TournamentGame[];
  semiFinalsGames: TournamentGame[];
  finalGame: TournamentGame[];
  isFromManager: boolean = false;
  complex: ComplexModel;
  @Input() tournament: TournamentModel;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'ManagerTournamentPlayoffsComponent');
  }

  fbkOnInit() {
    this.initIsFromManager();

    if (this.isTournamentValid()) {
      this.finalGame = this.initializeStep(FINAL_NB_OF_GAMES);
      this.semiFinalsGames = this.initializeStep(SEMI_FINALS_NB_OF_GAMES);
      this.quarterFinalsGames = this.initializeStep(QUARTER_FINALS_NB_OF_GAMES);
      this.roundOf16Games = this.initializeStep(ROUND_OF_16_NB_OF_GAMES);
    }
  }
  isTournamentValid() {
    return this.tournament && this.tournament.game && this.tournament.game.length > 0;
  }

  getGamesOfStep(numberOfGamesInStep: number) {
    return this.tournament.game.find((step)=> step.length == numberOfGamesInStep);
  }

  getTournamentGamesOfStep( unchangedGamesOfStep: GameModel[]) {
    return unchangedGamesOfStep.map((game) => {
      const team1 = new TournamentTeam();
      const team2 = new TournamentTeam();
      team1.gameTeam = game.teams[0];
      team1.leagueTeam = this.tournament.teams.find((team)=> team.name == team1.gameTeam.title);
      team2.gameTeam = game.teams[1];
      team2.leagueTeam = this.tournament.teams.find((team)=> team.name == team2.gameTeam.title);
      return new TournamentGame(team1, team2, game);
    });
  }

  initializeStep(nbOfGames:number) {
    let stepGames = [];
    const unchangedGames = this.getGamesOfStep(nbOfGames);

    if (unchangedGames) {
      stepGames = this.getTournamentGamesOfStep(unchangedGames);
      const emptyGames = stepGames.find((game) => game.team1.gameTeam.title == 'EMPTY');
      if (emptyGames) {
        stepGames = null;
      }
    }
    return stepGames;
  }

  initIsFromManager() {
    this.isFromManager = this.router.url.includes('manager');
  }

  onGameClick(game: TournamentGame) {
    this.complex = new ComplexModel(this.managerProvider.getComplex());
    const game2 = new GameModel(game.gameRef);
    game2.teams[0].from = game.team1.leagueTeam;
    game2.teams[1].from = game.team2.leagueTeam;
    if (this.complex && this.isFromManager) {
      localStorage.setItem('currentGame', JSON.stringify(game2));
      localStorage.setItem('currentComplex', JSON.stringify(this.complex));
      this.router.navigate(['/manager/game-sheet'], {queryParams: {game_id: game2._id, tournament_id: this.tournament._id}});
    }
  }
}
