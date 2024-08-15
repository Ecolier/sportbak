import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {CompetitionService} from 'src/app/manager/shared/services/competition.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../../../manager/shared/helpers/manager-errors.helper';

@Component({
  selector: 'complex-league',
  templateUrl: './complex-league.component.html',
  styleUrls: ['./complex-league.component.scss'],
  providers: [CompetitionService],
  encapsulation: ViewEncapsulation.None,
})

export class ComplexLeagueComponent extends FBKComponent {
  @Input() league: LeagueModel;

  competition: CompetitionModel;
  tabSelected: number = 0;
  loading: boolean = true;
  words_translated: any = null;
  hasLoaded: boolean = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private competitionService: CompetitionService,
  ) {
    super(_refElement, translate, 'LeagueComponent');
  }

  fbkOnInit() {
    setTimeout(() => {
      this.hasLoaded = true;
    }, 1000);
  }

  getLeagueId(id: string) {
    const self = this;
    this.loading = true;

    this.competitionService.getLeaguesById(id).subscribe({
      next: (result) => {
        if (self) {
          self.competition = new CompetitionModel(result);
          self.league = this.competition.convertToLeague();
          self.loading = false;
        }
      }, error: (error) => showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_get_league),
    });
  }

  isReady() {
    return !this.loading && this.league;
  }

  getLeagueName() {
    if (this.league) {
      return this.league.name;
    }
    return '-';
  }

  tabClicked(event: number) {
    this.tabSelected = event;
  }
}
