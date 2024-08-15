import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'calendar-league',
  templateUrl: './calendar-league.component.html',
  styleUrls: ['./calendar-league.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarLeagueComponent extends FBKComponent {
  isOpen: boolean = false;
  hasLoadedLeagueGames: boolean = false;
  unbookedGames: GameModel[][][] = [];
  @Input() league: LeagueModel;
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
    if (this.isOpen && !this.hasLoadedLeagueGames) {
      this.managerProvider.getLeagueById(this.league._id).subscribe({
        next: (response) => {
          this.league = new CompetitionModel(response).convertToLeague();
          this.keepUnbookedGames();
          this.hasLoadedLeagueGames = true;
        },
        error: (error) => showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_get_league),
      });
    }
  }

  keepUnbookedGames() {
    this.unbookedGames = [];
    this.league.game.forEach((phase) => {
      this.unbookedGames.push([]);
    });

    for (let phaseI = 0; phaseI < this.league.game.length; phaseI++) {
      for (let dayI = 0; dayI < this.league.game[phaseI].length; dayI++) {
        this.unbookedGames[phaseI][dayI] = this.getDayUnbookedGames(this.league.game[phaseI][dayI]);
      }
    }
    this.league.game = this.unbookedGames;
  }

  getDayUnbookedGames(day: GameModel[]) {
    return day.filter((game) => !game.booking || !game.booking._id);
  }

  updateGame(game) {
    this.setGame.emit(game);
  }

  hasPendingGames(day) {
    let hasPendingGames = false;
    day.forEach((games) => {
      if (games.status == 'pending') {
        hasPendingGames = true;
      }
    });
    return hasPendingGames;
  }
}
