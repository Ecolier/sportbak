import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, HostListener} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TournamentTeam} from 'src/app/shared/models/league/tournament-team';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'playoffs-editor',
  templateUrl: './playoffs-editor.component.html',
  styleUrls: ['./playoffs-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayoffsEditorComponent extends FBKComponent {
  selectedTeamIndex: number = undefined;
  isSelected: boolean = false;
  isValidationModalDisplayed: boolean = false;
  ROUND_16 = TournamentTeam.ROUND_16;
  QUARTER_FINALS = TournamentTeam.QUARTER_FINALS;
  SEMI_FINALS = TournamentTeam.SEMI_FINALS;
  FINAL = TournamentTeam.FINAL;
  shouldDisplayStepSelector: boolean = false;
  fromStepSelector: boolean = false;
  phases= [
    {phase: 'final',
      phaseId: 3},
    {phase: 'semi_finals',
      phaseId: 2},
    {phase: 'quarter_finals',
      phaseId: 1},
    {phase: 'round_16',
      phaseId: 0},
  ];
  @Input() shouldUpdate: boolean;
  @Input() poolsToPlayoff: boolean;
  @Input() currentStep: number;
  @Input() isShowingPlayoffsEditor: boolean = false;
  @Input() isCompCreated = false;
  @Input() startedPhase:number;
  @Input() selectedStep:number;
  @Input() competitionTree;
  @Input() isPool;
  @Input() teams: TournamentTeam[];
  @Input() tournament: TournamentModel;
  @Output() cancelPlayoffs = new EventEmitter();
  @Output() checkForUpdate = new EventEmitter();
  @Output() updatePoolToPlayoff = new EventEmitter();
  @Output() chosenPhase = new EventEmitter();
  @Output() checkParamsValid = new EventEmitter();
  @Output() setCurrentStep = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'PlayoffsEditorComponent');
  }

  fbkOnInit() {
    this.checkShouldDisplayStepSelector();
  }

  initializeCurrentStep() {
    if (!this.currentStep) {
      if (this.teams.length > 0) {
        this.currentStep = this.getCurrentStepFromTeamsNumber();
      } else {
        this.currentStep = 0;
      }
    } else if (this.teams.length > 0) {
      const newStep = this.getCurrentStepFromTeamsNumber();
      if (newStep != this.currentStep && !this.fromStepSelector) {
        this.currentStep = newStep;
      }
    } else {
      this.currentStep = 0;
    }
  }


  getCurrentStepFromTeamsNumber() {
    let currentStep;
    if (this.teams.length > 15) {
      currentStep = this.ROUND_16;
    } else if (this.teams.length > 7 && this.teams.length < 16) {
      currentStep = this.QUARTER_FINALS;
    } else if (this.teams.length > 3 && this.teams.length < 8) {
      currentStep = this.SEMI_FINALS;
    } else if (this.teams.length > 0 && this.teams.length < 4) {
      currentStep = this.FINAL;
    }
    return currentStep;
  }

  resetAllTeamsPlayoffsPosition() {
    this.deselect();
    this.teams.forEach((team) => {
      team.resetPlayoffsPosition();
    });
    this.checkUpdate();
  }

  checkPoolsFinished() {
    if (this.tournament) {
      this.tournament.setDisplayOptions();
    }
    if (this.tournament && this.tournament.isCreated() && !this.tournament.arePoolsFinished && this.tournament.finalStage < 0) {
      this.isValidationModalDisplayed = true;
    } else {
      this.showPlayoffs();
    }
  }

  toggleIsValidationModalDisplayed() {
    this.isValidationModalDisplayed = !this.isValidationModalDisplayed;
  }

  showPlayoffs() {
    this.isValidationModalDisplayed = false;
    this.isShowingPlayoffsEditor = true;
    this.initializeCurrentStep();
    this.checkUpdate();
  }

  checkShouldDisplayStepSelector() {
    this.shouldDisplayStepSelector = this.tournament && this.tournament.is_pool && this.tournament.isCreated() && !this.tournament.playoffsStarted;
  }

  hidePlayoffs() {
    if (this.poolsToPlayoff == true) {
      this.tournament.finalStage = -1;
      this.resetAllTeamsPlayoffsPosition();
      this.cancelPlayoffs.emit();
    } else {
      this.setCurrentStep.emit(this.currentStep);
      this.deselect();
      this.checkParamsValid.emit();
    }
    this.isShowingPlayoffsEditor = false;
  }

  validatePlayoffs() {
    this.checkParamsValid.emit();
    if (this.poolsToPlayoff == true) {
      this.updateTournament();
      this.poolsToPlayoff = false;
      this.hidePlayoffs();
      this.updatePoolToPlayoff.emit();
    } else {
      this.hidePlayoffs();
    }
  }

  setSelectedTeam(teamIndex: number) {
    this.selectedTeamIndex = teamIndex;
    this.isSelected = true;
  }
  @HostListener('document:keydown.escape', ['$sevent'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.deselect();
  }
  deselect() {
    this.selectedTeamIndex = null;
    this.isSelected = false;
  }
  setTeamPosition(phaseIndex: number, gameIndex: number, teamIndex: number) {
    const phase = this.competitionTree.phases[this.competitionTree.phases.length-1].phasesId;
    if (phaseIndex == phase) {
      if (this.isSelected) {
        this.isSelected = false;
      }
      const teamAlreadyAtThatPosition = this.teams.find((team) => team.playoffsPosition.step == phaseIndex && team.playoffsPosition.game == gameIndex && team.playoffsPosition.team == teamIndex);
      if (this.selectedTeamIndex != undefined && !teamAlreadyAtThatPosition) {
        this.teams[this.selectedTeamIndex].setPlayoffsPosition(phaseIndex, gameIndex, teamIndex);
        this.selectedTeamIndex = undefined;
      }
    }
    this.checkUpdate();
  }
  setRandom() {
    this.resetAllTeamsPlayoffsPosition();
    let teamsArray = [];
    const phase = this.competitionTree.phases.length - 1;
    const gamesPhase = this.competitionTree.phases[phase].games.length *2;
    let games = 0;
    let indexTeam = 0;
    for (let index = 0; index < this.teams.length; index++) {
      teamsArray.push(index);
    }
    for (let teams = 0; teams < gamesPhase; teams++) {
      const randomTeam = teamsArray[Math.floor(Math.random() * teamsArray.length)];
      teamsArray = teamsArray.filter((team) => team != randomTeam);
      this.selectedTeamIndex = randomTeam;
      this.setTeamPosition(this.competitionTree.phases[phase].phasesId, games, indexTeam);
      indexTeam++;
      if (indexTeam == 2) {
        indexTeam = 0;
        games++;
      }
    }
    this.deselect();
  }

  removeTeamPosition(team: TournamentTeam) {
    team.resetPlayoffsPosition();
    this.checkUpdate();
  }

  selectPhase() {
    this.deselect();
    this.resetAllTeamsPlayoffsPosition();
    this.chosenPhase.emit(this.selectedStep);
  }
  updateTournament() {
    this.tournament.finalStage = this.selectedStep;
    this.currentStep = this.selectedStep;
    if (this.tournament && !this.tournament.isCreated()) {
      this.tournament.is_pool = this.isPool;
    }
  }

  checkUpdate() {
    this.checkForUpdate.emit();
  }
}
