import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {PoolModel} from 'src/app/shared/models/league/pool.model';
import {TournamentTeam} from 'src/app/shared/models/league/tournament-team';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {CompetitionTree} from 'src/app/shared/models/league/competition-tree.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../shared/helpers/manager-errors.helper';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';

@Component({
  selector: 'manager-tournament-creator',
  templateUrl: './manager-tournament-creator.component.html',
  styleUrls: ['./manager-tournament-creator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentCreatorComponent extends FBKComponent {
  name = '';
  confrontations = 1;
  pointsForVictory = 3;
  pointsForDraw = 1;
  pointsForLoss = 0;
  areParamsValid = false;
  isShowingWarningModal: boolean;
  isShowingPoolToPlayoffModal: boolean;
  isShowingNotifyPlayersModal: boolean;
  arePoolsValid = true;
  arePlayoffsValid = false;
  selectedTeams: TournamentTeam[] = [];
  leagueTeams: LeagueTeam[] = [];
  allTeamsHavePlayers = true;
  allTeamsHaveDifferentNames = true;
  isPool: boolean;
  pools: PoolModel[] = [];
  shouldDisplayPoolsEditor = false;
  shouldDisplayPlayoffsEditor = false;
  shouldDisplayModeSelector = false;
  shouldEnableSave = false;
  shouldEnableStart = false;
  startedPhase: number
  selectedStep: number;
  finalSelected: boolean;
  competitionTree: CompetitionTree;
  action: 'save' | 'start';
  isShowingPlayoffsEditor: boolean
  poolsToPlayoff:boolean
  currentsStep: number;
  @Input() tournamentToEdit: TournamentModel;
  @Input() sport;
  @Output() onUpdate = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(_refElement, translate, 'ManagerTournamentCreatorComponent');
  }

  fbkOnInit() {
    if (this.tournamentToEdit) {
      this.initializeValuesFromTournamentToEdit();
      this.checkParamsValidity();
    }
    this.checkDisplayOptions();
    this.checkButtonsEnabled();
    document.getElementById('tournamentName').getElementsByTagName('input')[0].focus();
  }

  initializeValuesFromTournamentToEdit() {
    this.name = this.tournamentToEdit.name.toString();
    this.confrontations = this.tournamentToEdit.nbversus + 1;
    this.pointsForVictory = this.tournamentToEdit.wpoint;
    this.pointsForDraw = this.tournamentToEdit.dpoint;
    this.pointsForLoss = this.tournamentToEdit.lpoint;
    this.isPool = this.tournamentToEdit.finalStage < 0 ? true : false;
    this.selectedTeams = this.tournamentToEdit.isCreated() && this.tournamentToEdit.finalStage >= 0 ? this.tournamentToEdit.getTournamentTeams().filter((tournamentTeam) => tournamentTeam.playoffsPosition.step >= 0): this.tournamentToEdit.getTournamentTeams();
    this.leagueTeams = this.tournamentToEdit.teams;
    this.pools = this.tournamentToEdit.pool;
    this.currentsStep = this.tournamentToEdit.finalStage;
    this.startedPhase = this.tournamentToEdit.state =='created' && this.tournamentToEdit.finalStage >= 0 ? this.getStep(this.selectedTeams.length) : this.getStep(null);
  }

  setName(value) {
    this.name = value;
    this.checkParamsValidity();
  }

  setConfrontations(value) {
    this.confrontations = parseInt(value);
  }

  setPointsForVictory(value) {
    this.pointsForVictory = value;
    this.checkParamsValidity();
  }

  setPointsForDraw(value) {
    this.pointsForDraw = value;
    this.checkParamsValidity();
  }

  setPointsForLoss(value) {
    this.pointsForLoss = value;
    this.checkParamsValidity();
  }

  setPools(pools) {
    this.pools = pools.map((pool) => new PoolModel(pool));
    this.checkParamsValidity();
  }

  setAllTeamHaveDifferentNames(allTeamHaveDifferentNames: boolean) {
    this.allTeamsHaveDifferentNames = allTeamHaveDifferentNames;
    this.checkButtonsEnabled();
  }

  addTournamentTeam(team: LeagueTeam) {
    this.selectedTeams.push(new TournamentTeam(team));
    this.checkParamsValidity();
    this.checkButtonsEnabled();
    this.finalSelected = null;
    this.startedPhase = null;
  }

  deleteTournamentTeam(teamIndex: number) {
    this.pools.forEach((pool) => {
      if (pool.containsTeam(this.selectedTeams[teamIndex].team)) {
        pool.removeTeam(this.selectedTeams[teamIndex].team);
      }
    });
    this.selectedTeams.splice(teamIndex, 1);
    this.checkPoolsValid();
    this.checkPlayoffsValid();
    this.checkButtonsEnabled();
    this.finalSelected = null;
    this.startedPhase = null;
  }

  checkParamsValidity() {
    const allParams = [this.name, this.pointsForVictory, this.pointsForDraw, this.pointsForLoss];
    this.areParamsValid = allParams.filter((param) => param.toString().trim().length < 1).length < 1;
    this.checkAllTeamsHavePlayers();
    this.checkPoolsValid();
    this.checkPlayoffsValid();
  }

  checkAllTeamsHavePlayers() {
    this.allTeamsHavePlayers = this.selectedTeams.length > 0 ?
      this.selectedTeams.filter((tournamentTeam) => tournamentTeam.team.player.length < 1).length == 0 : true;
    this.checkButtonsEnabled();
  }

  checkPoolsValid() {
    if (!this.isPool) {
      this.arePoolsValid = false;
    } else {
      let allPoolsHaveTeams = true;
      this.pools.forEach((pool) => {
        if (pool.teams.length < 2) {
          allPoolsHaveTeams = false;
        }
      });
      this.arePoolsValid = allPoolsHaveTeams && this.pools.length > 0;
    }
    this.checkButtonsEnabled();
  }

  checkPlayoffsValid() {
    let step;
    if (!this.selectedStep && this.currentsStep) {
      step = this.currentsStep;
    } else {
      step = this.selectedStep;
    }
    this.arePlayoffsValid = false;
    if (!this.tournamentToEdit) {
      this.checkStepValid(step);
    } else {
      if (!this.selectedStep && this.tournamentToEdit.state == 'created') {
        this.arePlayoffsValid = true;
      } else {
        this.checkStepValid(step);
      }
    }
    if (this) {
      this.checkButtonsEnabled();
    }
  }

  checkStepValid(step) {
    const teams = this.selectedTeams;
    const validTeam = [];
    teams.forEach((team) => {
      if (team.playoffsPosition.game >= 0) {
        validTeam.push(team.team);
      }
      if (step == 3 && validTeam.length >= 2) {
        this.arePlayoffsValid = true;
      }
      if (step == 2 && validTeam.length >= 4) {
        this.arePlayoffsValid = true;
      }
      if (step == 1 && validTeam.length >= 8) {
        this.arePlayoffsValid = true;
      }
      if (step == 0 && validTeam.length >= 16) {
        this.arePlayoffsValid = true;
      }
    });
  }

  checkAndUpdatePoolsTeams() {
    this.pools.forEach((pool) => {
      pool.checkForRemovedTeams(this.selectedTeams.map((tournamentTeam) => tournamentTeam.team));
    });
  }

  checkDisplayOptions() {
    this.checkModeDisplay();
    this.checkPoolsDisplay();
    this.checkPlayoffsDisplay();
  }

  checkModeDisplay() {
    this.shouldDisplayModeSelector = !this.tournamentToEdit || (this.tournamentToEdit && !this.tournamentToEdit.isCreated());
  }

  checkPoolsDisplay() {
    this.shouldDisplayPoolsEditor = (this.isPool && !this.tournamentToEdit) || (this.isPool && this.tournamentToEdit && !this.tournamentToEdit.isCreated());
  }

  checkPlayoffsDisplay() {
    this.shouldDisplayPlayoffsEditor = (!this.isPool && !this.tournamentToEdit) || (!this.isPool && this.tournamentToEdit && !this.tournamentToEdit.isCreated()) || (this.isPool && this.tournamentToEdit && this.tournamentToEdit.isCreated() && this.tournamentToEdit.finalStage < 0);
  }

  checkButtonsEnabled() {
    this.checkSaveEnabled();
    this.checkStartEnabled();
  }

  checkStartEnabled() {
    if (this.isPool == true) {
      this.shouldEnableStart = this.areParamsValid && this.arePoolsValid && this.selectedTeams.length > 1 && this.allTeamsHavePlayers && this.allTeamsHaveDifferentNames;
    } else {
      this.shouldEnableStart = this.areParamsValid && this.arePlayoffsValid && this.selectedTeams.length > 1 && this.allTeamsHavePlayers && this.allTeamsHaveDifferentNames;
    }
  }

  checkSaveEnabled() {
    if ((this.tournamentToEdit && this.tournamentToEdit.state !== 'created') || !this.tournamentToEdit) {
      if (this.currentsStep < 0) {
        this.shouldEnableSave = this.areParamsValid && this.allTeamsHaveDifferentNames;
      } else {
        this.shouldEnableSave = this.areParamsValid;
      }
    } else {
      if (this.currentsStep < 0) {
        this.shouldEnableSave = this.areParamsValid;
      } else {
        this.shouldEnableSave = this.areParamsValid && this.arePlayoffsValid;
      }
    }
  }

  toggleEditors() {
    this.shouldDisplayPoolsEditor = !this.shouldDisplayPoolsEditor;
    this.shouldDisplayPlayoffsEditor = !this.shouldDisplayPlayoffsEditor;

    if (!this.tournamentToEdit || !this.tournamentToEdit.isCreated()) {
      this.isPool = !this.isPool;
    }
    this.checkParamsValidity();
  }

  phaseHasGames(phase) {
    let phaseHasGames = false;
    phase.forEach((game) => {
      game.forEach((team) => {
        if (team != undefined) {
          phaseHasGames = true;
        }
      });
    });
    return phaseHasGames;
  }

  convertPlayoffsTeamsToTeamsNames(phase) {
    if (this.phaseHasGames(phase)) {
      let teamsNames = phase.map((game) => game ? game.map((team) => team ? team.team.name : null) : []);
      teamsNames = teamsNames.map((game) => game[0] == null && game[1] == null ? [] : game);
      return teamsNames;
    } else {
      return [];
    }
  }

  onSaveClick(action) {
    this.poolsToPlayoff = null;
    if (action === 'update') {
      this.updateTournament(this.tournamentToEdit.state);
    }
    if (action === 'save') {
      this.action = 'save';
      if (this.tournamentToEdit) {
        this.onSaveAction(() => this.backToTournamentsList());
      } else {
        this.showNotifyPlayerModal();
      }
    }
  }

  onSaveAction(action: () => void) {
    if (this.tournamentToEdit) {
      this.updateTournament(this.tournamentToEdit.state);
    } else {
      const newTournament = this.createTournamentFromData('pending');
      this.managerProvider.createTournament(newTournament.convertToCompetition()).subscribe({
        next: (response) => {
          this.isShowingNotifyPlayersModal = true;
          action();
        }, error: (error) => showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_create_tournament),
      });
    }
  }

  onStartClick() {
    this.isShowingWarningModal = true;
    this.action = 'start';
  }

  validateWarningModal() {
    this.isShowingWarningModal = false;
    if (this.tournamentToEdit) {
      this.startAndRedirectToDetails();
    } else {
      this.showNotifyPlayerModal();
    }
  }

  cancelWarningModal() {
    this.isShowingWarningModal = false;
  }


  showNotifyPlayerModal() {
    this.isShowingNotifyPlayersModal = true;
  }

  togglePoolToPlayoffModal() {
    this.isShowingPoolToPlayoffModal = !this.isShowingPoolToPlayoffModal;
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
        this.saveAndBackToTournamentsList();
        break;
      case 'start':
        this.startAndRedirectToDetails();
        break;
    }
  }

  hideNotifyPlayerModal() {
    this.isShowingNotifyPlayersModal = false;
  }

  createTournamentFromData(state: string) {
    const newTournament = new TournamentModel({
      name: this.name,
      state: state,
      nbversus: this.confrontations - 1,
      wpoint: this.pointsForVictory,
      dpoint: this.pointsForDraw,
      lpoint: this.pointsForLoss,
      teams: this.selectedTeams.map((tournamentTeam) => tournamentTeam.team),
      is_pool: this.isPool,
      pool: this.pools,
      finalStage: this.currentsStep,
      roundOf16: this.convertPlayoffsTeamsToTeamsNames(this.getRoundOf16()),
      quarterFinals: this.convertPlayoffsTeamsToTeamsNames(this.getQuarterFinals()),
      semiFinals: this.convertPlayoffsTeamsToTeamsNames(this.getSemiFinals()),
      final: this.convertPlayoffsTeamsToTeamsNames(this.getFinal()),
      sport: this.sport,
    });

    return newTournament;
  }
  updateTournament(newState: string) {
    if (this.poolsToPlayoff) {
      this.isPool = false;
    }
    this.updateTournamentTeam();
    this.updateTournamentFromData(newState);
    this.managerProvider.patchTournament(this.tournamentToEdit.convertToCompetition()).subscribe({
      next: (response) => {
        if (this.tournamentToEdit.isCreated() && !this.tournamentToEdit.arePoolsFinished && this.poolsToPlayoff == true) {
          this.tournamentToEdit.arePoolsFinished = true;
          this.tournamentToEdit.playoffsStarted = true;
          this.poolsToPlayoff == undefined;
          this.managerProvider.transitionTournamentsPoolsToPlayoffs(
              this.tournamentToEdit._id,
              {playoffs: this.tournamentToEdit.convertToCompetition().tournament.finalStages.playoffs},
          ).subscribe({
            next: (response) => {},
            error: (error) => console.error(error),
          });
        }
        if (newState === 'created') {
          if (this.onUpdate) {
            this.onUpdate.emit({isSuccess: true, tournament: new CompetitionModel(response).convertToTournament()});
          }
          this.router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: response['_id']}});
        } else {
          this.backToTournamentsList();
        }
      },
      error: (error) => showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_patch_tournament),
    });
  }

  updateTournamentTeam() {
    if (this.tournamentToEdit.isCreated() && this.tournamentToEdit.finalStage >= 0) {
      this.selectedTeams = this.selectedTeams.filter((tournamentTeam) => tournamentTeam.playoffsPosition.step >= 0);
    }
  }

  getFinal() {
    return [[
      this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.FINAL && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 0),
      this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.FINAL && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 1),
    ]];
  }

  getSemiFinals() {
    return [
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.SEMI_FINALS && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.SEMI_FINALS && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.SEMI_FINALS && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.SEMI_FINALS && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 1)],
    ];
  }

  getQuarterFinals() {
    return [
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 2 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 2 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 3 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.QUARTER_FINALS && team.playoffsPosition.game == 3 && team.playoffsPosition.team == 1)],
    ];
  }

  getRoundOf16() {
    return [
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 0 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 1 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 2 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 2 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 3 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 3 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 4 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 4 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 5 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 5 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 6 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 6 && team.playoffsPosition.team == 1)],
      [this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 7 && team.playoffsPosition.team == 0),
        this.selectedTeams.find((team) => team.playoffsPosition.step == TournamentTeam.ROUND_16 && team.playoffsPosition.game == 7 && team.playoffsPosition.team == 1)],
    ];
  }
  updateTournamentFromData(state: string) {
    this.tournamentToEdit.name = this.name.toString();
    this.tournamentToEdit.nbversus = this.confrontations - 1;
    this.tournamentToEdit.wpoint = this.pointsForVictory;
    this.tournamentToEdit.dpoint = this.pointsForDraw;
    this.tournamentToEdit.lpoint = this.pointsForLoss;
    this.tournamentToEdit.teams = this.selectedTeams.map((tournamentTeam) => tournamentTeam.team);
    this.tournamentToEdit.state = state;
    this.tournamentToEdit.pool = this.pools;
    this.tournamentToEdit.is_pool = this.isPool;
    this.tournamentToEdit.final = this.convertPlayoffsTeamsToTeamsNames(this.getFinal());
    this.tournamentToEdit.semiFinals = this.convertPlayoffsTeamsToTeamsNames(this.getSemiFinals());
    this.tournamentToEdit.quarterFinals = this.convertPlayoffsTeamsToTeamsNames(this.getQuarterFinals());
    this.tournamentToEdit.roundOf16 = this.convertPlayoffsTeamsToTeamsNames(this.getRoundOf16());
  }

  finalizeTournamentCreation(action?: (response?) => void) {
    if (this.tournamentToEdit) {
      this.updateTournament('created');
    } else {
      const newTournament = this.createTournamentFromData('created');
      this.managerProvider.createTournament(newTournament.convertToCompetition()).subscribe({
        next: (response) => {
          action(response);
        }, error: (error) => showError(error, ApplicationErrorsIds.competitions.tournaments.unable_to_create_tournament),
      });
    }
  }

  backToTournamentsList() {
    if (!(this.route.snapshot.queryParams['options'] && this.route.snapshot.queryParams['options'].includes('noredirect'))) {
      this.router.navigate(['/manager/tournaments']);
    }
  }

  saveAndBackToTournamentsList() {
    this.onSaveAction(() => this.backToTournamentsList());
  }

  saveAndRedirectToAnnouncements() {
    this.onSaveAction(() => this.router.navigate(['/manager/announcements/new']));
  }

  allPoolHaveTeam() {
    for (const pool of this.pools) {
      if (pool.teams.length === 0) {
        return false;
      }
    }
    return true;
  }

  selectTournamentType(type) {
    if (type == 'pool') {
      this.isPool = true;
    } else if (type == 'final') {
      this.isPool = false;
      if (this.tournamentToEdit && this.tournamentToEdit.state !== 'created') {
        this.pools = [];
      }
      if (!this.finalSelected ) {
        if (!this.selectedStep) {
          if (this.currentsStep && this.currentsStep >= 0) {
            this.buildTree(this.currentsStep);
          } else {
            this.buildTree(this.startedPhase);
          }
        } else {
          this.buildTree(this.selectedStep);
        }
      }
      this.finalSelected = true;
    }
  }
  getStep(teams:number) {
    if (!teams) {
      teams = this.leagueTeams.length;
    }
    if (teams >= 16) {
      return 0;
    }
    if (teams<16 && teams>=8) {
      return 1;
    }
    if (teams < 8 && teams >= 4) {
      return 2;
    }
    if (teams < 4 && teams >= 1) {
      return 3;
    }
  }
  buildTree(step:number) {
    this.competitionTree = new CompetitionTree;
    if (!step) {
      this.competitionTree.setStage(this.getStep(null));
    } else {
      this.competitionTree.setStage(step);
    }
    if (this.competitionTree && this.competitionTree.phases.length > 0 && !this.selectedStep) {
      this.selectedStep = this.competitionTree.phases[this.competitionTree.phases.length-1].phasesId;
    }
  }

  selectStep(step:number) {
    this.buildTree(step);
    this.selectedStep = step;
  }

  setCurrentStep(step) {
    this.currentsStep = step;
  }

  startPlayoffs() {
    this.poolsToPlayoff = true;
    this.tournamentToEdit.finalStage = 0;
    this.selectTournamentType('final');
    this.checkPlayoffsValid();
    this.isShowingPlayoffsEditor = true;
  }
  cancelPlayoffs() {
    this.isPool = true;
    this.poolsToPlayoff = null;
  }
  private startAndRedirectToAnnouncements() {
    this.finalizeTournamentCreation(() => this.router.navigate(['/manager/announcements/new']));
  }

  private startAndRedirectToDetails() {
    this.finalizeTournamentCreation(
        (response) => this.router.navigate(['/manager/tournaments/details'], {queryParams: {tournament_id: response._id}}),
    );
  }
}
