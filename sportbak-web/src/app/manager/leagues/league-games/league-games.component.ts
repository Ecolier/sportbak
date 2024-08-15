import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from '../../../shared/components/base.component';
import {GameModel} from '../../../shared/models/league/game.model';
import {
  ClickOnGameventEmitterModel,
  StartedAtOfGameUpdatedEventEmitterModel,
} from '../../../shared/models/league/games-planning-output.model';
import {LeagueModel} from '../../../shared/models/league/league.model';
import {TranslateAppProvider} from '../../../shared/services/translate/translate.service';
import {CompetitionService} from '../../shared/services/competition.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';


@Component({
  selector: 'futbak-league-games',
  templateUrl: 'league-games.component.html',
  styleUrls: ['league-games.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class LeagueGamesComponent extends FBKComponent {
  teamsFiltered: LeagueModel[] = [];
  tabSelected = 0;
  private games: GameModel[] = [];
  @Input() public league: LeagueModel;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private competitionService: CompetitionService,
  ) {
    super(_refElement, translate, 'LeagueGamesComponent');
  }

  fbkOnInit() {
    const limit = 10;
    for (let i = 0; i < this.league.game.length; i++) {
      for (let j = 0; j < this.league.game[i].length; j++) {
        for (let k = 0; k < this.league.game[i][j].length; k++) {
          this.games.push(this.league.game[i][j][k]);

          if (this.games.length >= limit) {
            break;
          }
        }
        if (this.games.length >= limit) {
          break;
        }
      }
      if (this.games.length >= limit) {
        break;
      }
    }
  }

  getTeams(game) {
    const ids = [];
    if (game) {
      const teams = game.teams;
      for (const team of teams) {
        if (team.from) {
          ids.push(team.from);
        }
      }
    }
    const teams = [];
    for (const id of ids) {
      for (const team of this.league.teams) {
        if (team._id == id) {
          teams.push(team);
        }
      }
    }
    return teams;
  }

  tabClicked(event: number) {
    this.tabSelected = event;
  }

  startedAtOfGameUpdated(event: StartedAtOfGameUpdatedEventEmitterModel) {
    const game = event.game;
    const date = event.date;
    this.competitionService.patchGameDate(this.league._id, game._id, date).subscribe({
      next: (result) => {},
      error: (error) => showError(error, ApplicationErrorsIds.games.error_patching_game_date),
    });
  }

  gameInPendingClicked(event: ClickOnGameventEmitterModel) {
    // this.navCtrl.push("game-end", { game: event.game, isInCompet: true });
  }

  gameFinishedClicked(event: ClickOnGameventEmitterModel) {
    //   this.navCtrl.push('game-result', {
    //     id: event.game._id,
    //   }, {
    //     animate: false
    //   });
  }
}
