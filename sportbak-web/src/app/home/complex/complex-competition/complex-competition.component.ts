import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {DataService} from 'src/app/shared/services/data.service';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../../manager/shared/helpers/manager-errors.helper';

@Component({
  selector: 'complex-competition',
  templateUrl: './complex-competition.component.html',
  styleUrls: ['./complex-competition.component.scss'],
})
export class ComplexCompetitionComponent extends FBKComponent {
  complex: ComplexModel;
  competitions: CompetitionModel[] = [];
  selectedCompetition: LeagueModel;
  hasWaitedForLoading: boolean = false;
  staticBaseUrl = Conf.staticBaseUrl;
  complexIdFromURL: string = '';
  leagueIdFromURL: string = '';
  gotDataResults: boolean = false;
  isOnLeagueTables = false;
  countryFromURL: string;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    public requestProvider: FBKRequestProvider,
  ) {
    super(_refElement, translate, 'ComplexCompetitionComponent');
  }

  fbkOnInit() {
    setTimeout(() => {
      this.hasWaitedForLoading = true;
    }, 2000);
    this.initData();
    this.dataService.subscribeDataUpdated(() => {
      this.gotDataResults = true;
      this.initData();
    });
  }

  initData() {
    this.getURLId();
    const complexes = this.dataService.complexes;
    this.complex = complexes.find((complex) => complex._id === this.complexIdFromURL);

    if (this.dataService.initialized) {
      this.requestProvider.getLeagues(this.complex._id).subscribe({
        next: (result) => {
          this.competitions = result;
        }, error: (error) => {
          showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_get_leagues);
        },
      });
    }
  }

  getURLId() {
    if (this.route.snapshot.queryParams['complex_id']) {
      this.complexIdFromURL = this.route.snapshot.queryParams['complex_id'];
      if (this.route.snapshot.queryParams['league_id']) {
        this.leagueIdFromURL = this.route.snapshot.queryParams['league_id'];
        this.requestProvider.getLeagueById(this.leagueIdFromURL).subscribe({
          next: (result) => {
            this.selectedCompetition = result.convertToLeague();
            this.isOnLeagueTables = true;
          }, error: (error) => {
            showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_get_league);
            this.router.navigate(['/leagues']);
          },
        });
      }
      if (this.route.snapshot.queryParams['country']) {
        this.countryFromURL = this.route.snapshot.queryParams['country'];
      }
    } else {
      this.router.navigate(['/leagues']);
    }
  }

  onCompetitionClick(competitionIndex: number) {
    this.isOnLeagueTables = true;
    this.router.navigateByUrl('my-complex', {skipLocationChange: false}).then(() => {
      this.router.navigate([`complex-ctn`], {
        queryParams: {
          nav: 'competition',
          complex_id: this.complex._id,
          league_id: this.competitions[competitionIndex]._id,
          country: this.countryFromURL,
        },
      });
    });
  }
}
