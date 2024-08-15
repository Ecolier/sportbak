import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {CompetitionService} from '../shared/services/competition.service';
import {ApplicationErrorsIds, showError} from '../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-leagues',
  templateUrl: './manager-leagues.component.html',
  styleUrls: ['./manager-leagues.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerLeaguesComponent extends FBKComponent {
  leagues: LeagueModel[];
  createdLeaguesChecked: boolean = true;
  pendingLeaguesChecked: boolean = true;
  finishedLeaguesChecked: boolean = false;
  leagueToEdit: LeagueModel;
  debugMode: boolean = false;
  isLoaded: boolean = false;
  complex: ComplexModel;
  sportFilter: any;
  sport: string;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
    private competitionService: CompetitionService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('leagues');
  }

  fbkOnInit() {
    this.competitionService.getLeagues().subscribe({
      next: (value) => {
        this.leagues = value.map((league) => new LeagueModel(league));
        this.sortLeagues();
        this.sportFilter = this.leagues;
        this.complex = this.managerProvider.getComplex();
      },
      error: (err) => showError(err, ApplicationErrorsIds.competitions.leagues.unable_to_get_leagues),
    });
  }

  toggleCreatedLeaguesVisibility(event?) {
    this.createdLeaguesChecked = !this.createdLeaguesChecked;
  }

  togglePendingLeaguesVisibility(event?) {
    this.pendingLeaguesChecked = !this.pendingLeaguesChecked;
  }

  toggleFinishedLeaguesVisibility(event?) {
    this.finishedLeaguesChecked = !this.finishedLeaguesChecked;
  }

  sortLeagues() {
    let leaguesByDates = this.leagues;
    leaguesByDates = leaguesByDates.sort((a, b) => {
      return Number(new Date(this.getSelectedDate(b.createdAt, b.summary.lastGame))) - Number(new Date(this.getSelectedDate(a.createdAt, a.summary.lastGame)));
    });
    this.leagues = leaguesByDates;
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

  addLeague(leagueToAdd) {
    this.leagues.push(leagueToAdd);
  }

  onLeagueClick(league: LeagueModel) {
    if (league.isCreated() || league.isFinished()) {
      this.redirectToLeagueDetails(league);
    } else {
      this.redirectToLeagueEdit(league);
    }
  }

  redirectToLeagueDetails(league: LeagueModel) {
    this._router.navigate(['/manager/leagues/details'], {queryParams: {league_id: league._id}});
  }

  redirectToLeagueEdit(league?: LeagueModel) {
    if (league && (league.isCreated() || league.isFinished())) {
      this._router.navigate(['/manager/leagues/details'], {queryParams: {league_id: league._id, tab: 2}});
    } else if (league) {
      this._router.navigate(['/manager/leagues/edit'], {queryParams: {league_id: league._id}});
    } else {
      this._router.navigate(['/manager/leagues/edit']);
    }
  }

  redirectToLeagues() {
    this._router.navigate(['/manager/leagues']);
  }

  selectedSport(chosenSport) {
    if (chosenSport !== 'all') {
      this.sportFilter = this.leagues.filter((league) => league.sport === chosenSport);
    } else {
      this.sportFilter = this.leagues;
    }
  }
}
