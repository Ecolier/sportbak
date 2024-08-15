import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {CompetitionService} from '../shared/services/competition.service';
import {ApplicationErrorsIds, showError} from '../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-tournaments',
  templateUrl: './manager-tournaments.component.html',
  styleUrls: ['./manager-tournaments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentsComponent extends FBKComponent {
  tournaments: TournamentModel[];
  createdTournamentsChecked: boolean = true;
  pendingTournamentsChecked: boolean = true;
  finishedTournamentsChecked: boolean = false;
  tournamentToEdit: TournamentModel;
  isLoaded: boolean = false;
  complex: ComplexModel;
  sport: string;
  sportFilter: any;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
    private competitionService: CompetitionService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('tournaments');
  }

  fbkOnInit() {
    this.competitionService.getTournaments().subscribe({
      next: (value) => {
        this.tournaments = value.map((tournament) => new TournamentModel(tournament));
        this.sortTournaments();
        this.sportFilter = this.tournaments;
        this.complex = this.managerProvider.getComplex();
      },
      error: (err) => showError(err, ApplicationErrorsIds.competitions.tournaments.unable_to_get_tournaments),
    });
  }

  sortTournaments() {
    let tournamentsByDates = this.tournaments;
    tournamentsByDates = tournamentsByDates.sort((a, b) => {
      return Number(new Date(this.getSelectedDate(b.createdAt, b.summary.lastGame))) - Number(new Date(this.getSelectedDate(a.createdAt, a.summary.lastGame)));
    });
    this.tournaments = tournamentsByDates;
    this.isLoaded = true;
  }

  getSelectedDate(createdDate, lastGame) {
    const dateC = new Date(createdDate);
    const dateL = new Date(lastGame);
    if (dateC > dateL) {
      return createdDate;
    } else {
      return lastGame;
    }
  }

  toggleCreatedTournamentsVisibility(event?) {
    this.createdTournamentsChecked = !this.createdTournamentsChecked;
  }

  togglePendingTournamentsVisibility(event?) {
    this.pendingTournamentsChecked = !this.pendingTournamentsChecked;
  }

  toggleFinishedTournamentsVisibility(event?) {
    this.finishedTournamentsChecked = !this.finishedTournamentsChecked;
  }

  addCreatedTournament(tournamentToAdd: TournamentModel) {
    this.tournaments.push(tournamentToAdd);
  }

  onTournamentClick(tournament: TournamentModel) {
    if (tournament.isCreated() || tournament.isFinished()) {
      this.redirectToTournamentDetails(tournament);
    } else {
      this.redirectToTournamentEdit(tournament);
    }
  }

  redirectToTournamentDetails(tournament: TournamentModel) {
    this._router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: tournament._id}});
  }

  redirectToTournaments() {
    this._router.navigate(['/manager/tournaments']);
  }

  redirectToTournamentEdit(tournament?:TournamentModel) {
    if (tournament && (tournament.isCreated() || tournament.isFinished())) {
      this._router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: tournament._id, tab: 2}});
    } else if (tournament) {
      this._router.navigate(['/manager/tournaments/edit'], {queryParams: {tournament_id: tournament._id}});
    } else {
      this._router.navigate(['/manager/tournaments/edit']);
    }
  }

  selectedSport(chosenSport) {
    if (chosenSport != 'all') {
      this.sportFilter = this.tournaments.filter((tournament) => tournament.sport == chosenSport);
    } else {
      this.sportFilter = this.tournaments;
    }
  }
}
