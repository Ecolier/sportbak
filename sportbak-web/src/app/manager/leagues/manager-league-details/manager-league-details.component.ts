import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionService } from 'src/app/manager/shared/services/competition.service';
import { FBKComponent } from 'src/app/shared/components/base.component';
import { ComplexModel } from 'src/app/shared/models/complex/complex.model';
import { CompetitionModel } from 'src/app/shared/models/league/competition.model';
import { LeagueModel } from 'src/app/shared/models/league/league.model';
import { TranslateAppProvider } from 'src/app/shared/services/translate/translate.service';
import { ApplicationErrorsIds, showError } from '../../shared/helpers/manager-errors.helper';
import { ManagerProvider } from '../../shared/services/manager.service';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";

@Component({
  selector: 'manager-league-details',
  templateUrl: './manager-league-details.component.html',
  styleUrls: ['./manager-league-details.component.scss'],
  providers: [CompetitionService],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerLeagueDetailsComponent extends FBKComponent {
  league: LeagueModel;
  tabSelected = 0;
  hasLoaded = false;
  complex: ComplexModel;
  numberOfTabs = 3;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    private managerProvider: ManagerProvider,
    private eventProvider : SBKEventsProvider
  ) {
    super(_refElement, translate, 'ManagerLeagueDetailsComponent');
  }


  fbkOnInit() {
    this.getLeague();
    this.eventProvider.subscribe(this, SBKEventsIds.updateCompetitionGame, (data) => {
      this.getLeague();
    })
  }

  getLeague(){
    if (this.isLeagueIdValid()) {
      this.managerProvider.getLeagueById(this.route.snapshot.queryParams['league_id']).subscribe({
        next: (response) => {
          this.league = new CompetitionModel(response).convertToLeague();
          this.hasLoaded = true;
          this.selectSectionFromURL();
        },
        error: (error) => showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_get_league),
      });
    } else {
      this.redirectToLeagues();
    }
  }

  isLeagueIdValid() {
    return this.route.snapshot.queryParams['league_id'] && this.route.snapshot.queryParams['league_id'].length > 0;
  }

  tabClicked(event: number) {
    this.tabSelected = event;
  }

  selectSectionFromURL() {
    if (this.route.snapshot.queryParams['tab'] && Number.isInteger(parseInt(this.route.snapshot.queryParams['tab']))) {
      this.tabSelected = this.route.snapshot.queryParams['tab'];
      if (this.tabSelected < 0) {
        this.tabSelected = 0;
      } else if (this.tabSelected >= this.numberOfTabs) {
        this.tabSelected = this.numberOfTabs - 1;
      }
    }
  }

  updateLeague(league:LeagueModel) {
    this.league = league;
  }

  redirectToLeagues() {
    this.router.navigate(['/manager/leagues']);
  }

  fbkOnDestroy() {
    this.eventProvider.unsubscribeAllTopics(this);
  }
}
