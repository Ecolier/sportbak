import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompetitionService} from 'src/app/manager/shared/services/competition.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';
import { ManagerProvider } from '../../shared/services/manager.service';
import { SBKEventsProvider } from "src/app/shared/services/events.provider";
import { SBKEventsIds } from "src/app/shared/values/events-ids";

@Component({
  selector: 'manager-tournament-details',
  templateUrl: './manager-tournament-details.component.html',
  styleUrls: ['./manager-tournament-details.component.scss'],
  providers: [CompetitionService],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentDetailsComponent extends FBKComponent {
  isFromManager = false;
  tournament: TournamentModel;
  tabSelected = 0;
  hasLoaded = false;
  complex: ComplexModel;
  poolIndex: number;
  numberOfTabs = 3;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    private managerProvider:ManagerProvider,
    private eventProvider : SBKEventsProvider

  ) {
    super(_refElement, translate, 'ManagerTournamentDetailsComponent');
  }

  fbkOnInit() {
    this.initIsFromManager();
    this.initData()
    this.eventProvider.subscribe(this, SBKEventsIds.updateCompetitionGame, (data) => {
      this.initData();
    })
  }

  fbkOnDestroy(){
    this.eventProvider.unsubscribeAllTopics(this);
  }

  initData() {
    if (this.isTournamentValid()) {
      this.managerProvider.getTournamentById(this.route.snapshot.queryParams['tournament_id']).subscribe({next: (response) => {
        this.tournament = new CompetitionModel(response).convertToTournament();
        this.selectSectionFromURL();
        this.setPoolIndex();
        setTimeout(() => {
          this.initPlayoff();
        }, 500);
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_get_tournament);
        this.redirectToTournaments();
      }});
    } else {
      this.redirectToTournaments();
    }
  }

  initPlayoff() {
    this.managerProvider.getTournamentById(this.route.snapshot.queryParams['tournament_id']).subscribe({next: (response) => {
      this.tournament = new CompetitionModel(response).convertToTournament();
      this.hasLoaded = true;
      this.selectSectionFromURL();
      this.setPoolIndex();
    }, error: (error) => {
      showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_get_tournament);
      this.redirectToTournaments();
    }});
  }
  isTournamentValid() {
    return this.route.snapshot.queryParams['tournament_id'] && this.route.snapshot.queryParams['tournament_id'].length > 0;
  }

  setPoolIndex() {
    if (this.route.snapshot.queryParams['pool_index']) {
      this.poolIndex = Number(this.route.snapshot.queryParams['pool_index']);
    }
  }

  tabClicked(event: number) {
    this.tabSelected = event;
  }

  redirectToTournaments() {
    this.router.navigate(['/manager/tournaments']);
  }

  initIsFromManager() {
    this.isFromManager = this.router.url.includes('manager');
  }

  selectSectionFromURL() {
    if (!this.tournament.pool || this.tournament.pool.length == 0) {
      this.numberOfTabs = 2;
    }
    if (this.route.snapshot.queryParams['tab'] && Number.isInteger(parseInt(this.route.snapshot.queryParams['tab']))) {
      this.tabSelected = this.route.snapshot.queryParams['tab'];
      if (this.tabSelected < 0) {
        this.tabSelected = 0;
      } else if (this.tabSelected >= this.numberOfTabs) {
        this.tabSelected = this.numberOfTabs - 1;
      }
    }
  }

  updateTournament(tournament:TournamentModel) {
    this.tournament = tournament;
    this.initData();
  }

  gameClicked(game: GameModel) {
    let teamsAreReady = true;
    if (game) {
      for (const team of game.teams) {
        if (!team.from) {
          teamsAreReady = false;
          break;
        }
      }
    }
    if (teamsAreReady && this.isFromManager) {
      localStorage.setItem('currentGame', JSON.stringify(game));
      if (this.tournament.finalStage >= 0 && this.tournament.pool.length > 0) {
        this.router.navigate(['/manager/game-sheet'], {queryParams: {tournament_id: this.tournament._id, game_id: game._id, playoff: true}});
      } else {
        this.router.navigate(['/manager/game-sheet'], {queryParams: {tournament_id: this.tournament._id, game_id: game._id}});
      }
    }
  }
}
