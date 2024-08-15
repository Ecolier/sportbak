import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';

@Component({
  selector: 'manager-league-creator',
  templateUrl: './manager-league-creator.component.html',
  styleUrls: ['./manager-league-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerLeagueCreatorComponent extends FBKComponent {
  @Input() sport: string;
  name: string = '';
  confrontations: number[];
  selectedConfrontations: number = 1;
  pointsForVictory: number = 3;
  pointsForDraw: number = 1;
  pointsForDefeat: number = 0;
  selectedTeams: LeagueTeam[] = [];
  allTeamsHavePlayers: boolean = true;
  allTeamsHaveDifferentNames: boolean = true;
  areParamsValid: boolean = false;
  isSaveHovered: boolean;
  isStartHovered: boolean;
  isShowingWarningModal: boolean;
  isShowingNotifyPlayersModal: boolean;
  isLeagueCreated: boolean = false;
  shouldEnableStart: boolean = false;
  action: 'save' | 'start';
  @Input() leagueToEdit: LeagueModel;
  @Output() displayLeaguesList = new EventEmitter();
  @Output() onBackClick = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(_refElement, translate, 'ManagerLeagueCreatorComponent');
  }

  fbkOnInit() {
    this.initializeConfrontations();
    if (this.leagueToEdit) {
      this.initializeValuesFromLeagueToEdit();
      this.checkParamsValidity();
    }
    document.getElementById('leagueName').getElementsByTagName('input')[0].focus();
  }

  initializeConfrontations() {
    this.confrontations = [1, 2, 3, 4];
  }

  initializeValuesFromLeagueToEdit() {
    this.name = this.leagueToEdit.name.toString();
    this.selectedConfrontations = this.leagueToEdit.nbVersus ? this.leagueToEdit.nbVersus + 1 : 1;
    this.pointsForVictory = this.leagueToEdit.wpoint;
    this.pointsForDraw = this.leagueToEdit.dpoint;
    this.pointsForDefeat = this.leagueToEdit.lpoint;
    this.selectedTeams = this.leagueToEdit.teams;
    this.isLeagueCreated = this.leagueToEdit ? this.leagueToEdit.state === 'created' : false;
  }

  setName(value) {
    this.name = value;
    this.checkParamsValidity();
  }

  setConfrontations(value) {
    this.selectedConfrontations = value;
    this.checkParamsValidity();
  }

  setPointsForVictory(value) {
    this.pointsForVictory = value;
    this.checkParamsValidity();
  }

  setPointsForDraw(value) {
    this.pointsForDraw = value;
    this.checkParamsValidity();
  }

  setPointsForDefeat(value) {
    this.pointsForDefeat = value;
    this.checkParamsValidity();
  }

  checkParamsValidity() {
    const allParams = [this.name, this.selectedConfrontations, this.pointsForVictory, this.pointsForDraw, this.pointsForDefeat];
    this.checkAllTeamsHavePlayers();
    this.areParamsValid = allParams.filter((param) => param.toString().trim().length < 1).length < 1;
    this.checkShouldEnableStart();
  }

  checkAllTeamsHavePlayers() {
    this.allTeamsHavePlayers = this.selectedTeams.length > 0 ?
      this.selectedTeams.filter((team) => team.player.length < 1).length === 0 : true;
  }

  checkShouldEnableStart() {
    this.shouldEnableStart = this.areParamsValid && this.selectedTeams.length > 1 && this.allTeamsHavePlayers && this.allTeamsHaveDifferentNames;
  }

  addLeagueTeam(leagueTeam) {
    this.checkParamsValidity();
  }

  onTeamDelete(teamToDeleteIndex) {
    const teamToDelete = this.selectedTeams[teamToDeleteIndex];
    this.selectedTeams = this.selectedTeams.filter((team) => team.name !== teamToDelete.name);
    this.checkParamsValidity();
  }


  createLeagueFromData(state: string) {
    return new LeagueModel({
      name: this.name,
      state,
      nbVersus: this.selectedConfrontations - 1,
      wpoint: this.pointsForVictory,
      dpoint: this.pointsForDraw,
      lpoint: this.pointsForDefeat,
      startSeason: new Date(Date.now()).getFullYear(),
      endSeason: new Date(Date.now()).getFullYear() + 1,
      teams: this.selectedTeams,
      sport: this.sport,
    });
  }

  showNotifyPlayerModal() {
    this.isShowingNotifyPlayersModal = true;
  }

  hideNotifyPlayerModal() {
    this.isShowingNotifyPlayersModal = false;
  }

  onSaveAction(nextAction?: () => void) {
    if (this.leagueToEdit) {
      this.updateLeague(this.leagueToEdit.state);
    } else {
      const newLeague = this.createLeagueFromData('pending');
      this.managerProvider.createLeague(newLeague.convertToCompetition()).subscribe({
        next: (response) => {
          const leagueInResponse = new CompetitionModel(response).convertToLeague();
          this.isShowingNotifyPlayersModal = true;
          nextAction();
        },
      });
    }
  }

  onSaveClick() {
    this.action = 'save';
    if (this.leagueToEdit) {
      this.onSaveAction();
    } else {
      this.showNotifyPlayerModal();
    }
  }

  onSaveHover() {
    this.isSaveHovered = this.isSaveHovered ? this.isSaveHovered : true;
  }

  onSaveExit() {
    this.isSaveHovered = false;
  }

  onStartClick() {
    this.action = 'start';
    if (this.leagueToEdit) {
      this.finalizeLeagueCreation();
    } else {
      this.isShowingWarningModal = true;
    }
  }

  onStartHover() {
    this.isStartHovered = this.isStartHovered ? this.isStartHovered : true;
  }

  onStartExit() {
    this.isStartHovered = false;
  }

  validateWarningModal() {
    this.isShowingWarningModal = false;
    this.showNotifyPlayerModal();
  }

  cancelWarningModal() {
    this.isShowingWarningModal = false;
  }

  finalizeLeagueCreation(nextAction?: (leagueInResponse?: LeagueModel) => void) {
    if (this.leagueToEdit) {
      this.updateLeague('created');
    } else {
      const newLeague = this.createLeagueFromData('created');
      let leagueInResponse;
      this.managerProvider.createLeague(newLeague.convertToCompetition()).subscribe({
        next: (response) => {
          leagueInResponse = new CompetitionModel(response).convertToLeague();
          this.showNotifyPlayerModal();
          nextAction(leagueInResponse);
        }, error: (error) => showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_create_league),
      });
    }
  }

  updateLeagueFromData(state: string) {
    this.leagueToEdit.name = this.name;
    this.leagueToEdit.nbVersus = this.selectedConfrontations - 1;
    this.leagueToEdit.wpoint = this.pointsForVictory;
    this.leagueToEdit.dpoint = this.pointsForDraw;
    this.leagueToEdit.lpoint = this.pointsForDefeat;
    this.leagueToEdit.state = state;
    this.leagueToEdit.teams = this.selectedTeams;
  }

  updateLeague(newState: string) {
    this.updateLeagueFromData(newState);
    this.managerProvider.patchLeague(this.leagueToEdit.convertToCompetition())
        .subscribe({
          next: (response) => {
            this.leagueToEdit = new CompetitionModel(response).convertToLeague();
            if (newState === 'created') {
              this.router.navigate(['/manager/leagues/details'], {queryParams: {league_id: this.leagueToEdit._id}});
              if (this.onUpdate) {
                this.onUpdate.emit({isSuccess: true, league: this.leagueToEdit});
              }
            } else {
              console.log('this.backToLeaguesList();');

              this.backToLeaguesList();
            }
          },
          error: (error) => showError(error, ApplicationErrorsIds.competitions.leagues.unable_to_patch_league),
        },
        );
  }

  onUpdateClick() {
    this.updateLeague(this.leagueToEdit.state);
  }

  backToLeaguesList() {
    if (!(this.route.snapshot.queryParams['options'] && this.route.snapshot.queryParams['options'].includes('noredirect'))) {
      this.router.navigate(['/manager/leagues']);
    }
  }

  onNotifyPlayerYesClick() {
    switch (this.action) {
      case 'save':
        this.saveAndRedirectToAnnouncements();
        break;
      case 'start':
        this.startAndRedirectToAnnouncements();
        break;
    }
  }

  onNotifyPlayerNoClick() {
    switch (this.action) {
      case 'save':
        this.saveAndBackToLeaguesList();
        break;
      case 'start':
        this.startAndGoToDetails();
        break;
    }
  }

  saveAndRedirectToAnnouncements() {
    this.onSaveAction(
        () => this.router.navigate(['/manager/announcements/new']),
    );
  }

  saveAndBackToLeaguesList() {
    this.onSaveAction(
        () => this.backToLeaguesList(),
    );
  }

  startAndRedirectToAnnouncements() {
    this.finalizeLeagueCreation(
        () => this.router.navigate(['/manager/announcements/new']),
    );
  }

  startAndGoToDetails() {
    this.finalizeLeagueCreation(
        (leagueInResponse: LeagueModel) => this.router.navigate(['/manager/leagues/details'], {queryParams: {league_id: leagueInResponse._id}}),
    );
  }

  setAllTeamHaveDifferentNames(allTeamHaveDifferentNames: boolean) {
    this.allTeamsHaveDifferentNames = allTeamHaveDifferentNames;
  }

  redirectToContact() {
    window.open(window.location.origin + '/manager/contact');
  }
}
