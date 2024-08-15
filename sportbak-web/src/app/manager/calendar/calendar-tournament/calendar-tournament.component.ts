import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {GameModel} from '../../../shared/models/league/game.model';
import {PoolModel} from '../../../shared/models/league/pool.model';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'calendar-tournament',
  templateUrl: './calendar-tournament.component.html',
  styleUrls: ['./calendar-tournament.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarTournamentComponent extends FBKComponent {
  isOpen: boolean = false;
  hasLoadedTournamentGames = false;
  matches: {
    pool: PoolModel[],
    roundOf16: any[],
    quarterFinals: any[],
    semiFinals: any[],
    final: any[],
  } = {
    pool: [],
    roundOf16: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
  };
  @Input() tournament: TournamentModel;
  @Output() setGame = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.hasLoadedTournamentGames) {
      this.managerProvider.getTournamentById(this.tournament._id).subscribe({
        next: (response) => {
          this.tournament = new CompetitionModel(response).convertToTournament();
          this.tournament.setPlayoffsPhases();
          this.keepUnbookedGames();
          this.keepOnlyNecessary();
          this.hasLoadedTournamentGames = true;
          console.log(this.matches);
        },
        error: (error) => {
          showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_get_tournament);
        },
      });
    }
  }

  updateGame(game) {
    this.setGame.emit(game);
  }

  keepUnbookedGames() {
    if (this.tournament.roundOf16.length > 0) {
      this.tournament.roundOf16 = this.tournament.roundOf16.filter((game) => !game.booking || !game.booking._id);
    }
    if (this.tournament.quarterFinals.length > 0) {
      this.tournament.quarterFinals = this.tournament.quarterFinals.filter((game) => !game.booking || !game.booking._id);
    }
    if (this.tournament.semiFinals.length > 0) {
      this.tournament.semiFinals = this.tournament.semiFinals.filter((game) => !game.booking || !game.booking._id);
    }
    if (this.tournament.final.length > 0) {
      this.tournament.final = this.tournament.final.filter((game) => !game.booking || !game.booking._id);
    }
  }

  keepOnlyNecessary() {
    console.log(this.tournament);
    this.parse('roundOf16');
    this.parse('semiFinals');
    this.parse('quarterFinals');
    this.parse('final');
    if (this.tournament.pool) {
      for (const pool of this.tournament.pool) {
        const currentPool: GameModel[][][] = [];
        for (const phase of pool.game) {
          const currentPhase: GameModel[][] = [];
          for (const day of phase) {
            const currentDay: GameModel[] = [];
            for (const game of day) {
              if ((!game.booking || !game.booking._id) && game.status !== 'complete') {
                currentDay.push(game);
              }
            }
            if (currentDay.length > 0) {
              currentPhase.push(currentDay);
            }
          }
          if (currentPhase.length > 0) {
            currentPool.push(currentPhase);
          }
        }
        if (currentPool.length > 0) {
          this.matches.pool.push(pool);
        }
      }
    }
  }

  parse(field: string) {
    if (this.tournament[field]) {
      for (const element of this.tournament[field]) {
        if ((!element.booking || !element.booking._id) && element.status !== 'complete') {
          this.matches[field].push(element);
        }
      }
    }
  }
}
