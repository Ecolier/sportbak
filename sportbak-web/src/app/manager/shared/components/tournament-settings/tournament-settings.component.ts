import {Component, ElementRef, Input, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerProvider} from '../../services/manager.service';

@Component({
  selector: 'tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TournamentSettingsComponent extends FBKComponent {
  areButtonsEnabled: boolean;
  isLoading: boolean;
  bonusPoints: number[];
  isRequestStatusVisible: boolean;
  requestStatusText: string;
  isRequestSuccess: boolean;
  @Input() tournament: TournamentModel;
  @Output() updateTournament = new EventEmitter();
  @Output() updateData = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider:ManagerProvider,
    private router:Router,
  ) {
    super(_refElement, translate, 'CompetitionSettings');
  }

  fbkOnInit() { }

  fbkInputChanged() {
    if (this.tournament && !this.bonusPoints) {
      this.initBonusPoints();
    }
  }

  redirectToTournamentDetails() {
    this.router.navigate(['/manager/tournaments/edit'], {queryParams: {tournament_id: this.tournament._id}});
  }

  showButtons() {
    this.areButtonsEnabled = true;
  }

  initBonusPoints() {
    this.areButtonsEnabled = false;
    this.bonusPoints = [];
    this.tournament.teams.forEach((team) => {
      this.bonusPoints.push(team.bonusPoints);
    });
  }

  validate() {
    this.isLoading = true;
    this.areButtonsEnabled = false;

    this.tournament.teams.forEach((team, index) => {
      team.bonusPoints = this.bonusPoints[index];
    });

    this.managerProvider.patchTournament(this.tournament.convertToCompetition()).subscribe((response) => {
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
    this.tournament = data['tournament'];
    this.isRequestStatusVisible = true;
    this.requestStatusText = this.getTranslation('patch_success');
    this.isRequestSuccess = data['isSuccess'];
    this.updateTournament.emit(this.tournament);
    this.updateData.emit('ok');
  }
}
