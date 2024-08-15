import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'league-settings',
  templateUrl: './league-settings.component.html',
  styleUrls: ['./league-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeagueSettingsComponent extends FBKComponent {
  areButtonsEnabled: boolean;
  isLoading: boolean;
  bonusPoints: number[];
  isRequestStatusVisible: boolean;
  requestStatusText: string;
  isRequestSuccess: boolean;
  @Input() league: LeagueModel;
  @Output() updateLeague = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private managerProvide: ManagerProvider,
  ) {
    super(_refElement, translate, 'CompetitionSettings');
  }

  fbkOnInit() { }

  fbkInputChanged() {
    if (this.league && !this.bonusPoints) {
      this.initBonusPoints();
    }
  }

  redirectToLeagueDetails() {
    this.router.navigate(['/manager/leagues/edit'], {queryParams: {league_id: this.league._id}});
  }

  showButtons() {
    this.areButtonsEnabled = true;
  }

  initBonusPoints() {
    this.areButtonsEnabled = false;
    this.bonusPoints = [];
    this.league.teams.forEach((team) => {
      this.bonusPoints.push(team.bonusPoints);
    });
  }

  validate() {
    this.isLoading = true;
    this.areButtonsEnabled = false;
    this.league.teams.forEach((team, index) => {
      team.bonusPoints = this.bonusPoints[index];
    });

    this.managerProvide.patchLeague(this.league.convertToCompetition()).subscribe((response) => {
      this.isLoading = false;
      this.isRequestStatusVisible = true;
      this.requestStatusText = this.getTranslation('patch_success');
      this.isRequestSuccess = true;
    }, (error) => {
      this.isLoading = false;
      this.isRequestStatusVisible = true;
      this.requestStatusText = this.getTranslation('patch_failure');
      this.isRequestSuccess = false;
    });
  }

  resetRequestStatus() {
    this.isRequestStatusVisible = false;
  }

  showUpdateStatus(data) {
    this.league = data['league'];
    this.isRequestStatusVisible = true;
    this.requestStatusText = this.getTranslation('patch_success');
    this.isRequestSuccess = data['isSuccess'];
    this.updateLeague.emit(this.league);
  }
}
