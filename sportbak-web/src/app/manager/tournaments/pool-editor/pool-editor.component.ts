import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, HostListener} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {PoolModel} from 'src/app/shared/models/league/pool.model';
import {TournamentTeam} from 'src/app/shared/models/league/tournament-team';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'pool-editor',
  templateUrl: './pool-editor.component.html',
  styleUrls: ['./pool-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PoolEditorComponent extends FBKComponent {
  isShowingPoolEditor = false;
  nextPoolNumber: number;
  selectedTeamIndex: number = undefined;
  confrontationsOptions = [1, 2, 3, 4];
  isShowingExplanation = false;
  @Input() tournament
  @Input() isCompCreated = false;
  @Input() selectedConfrontations;
  @Input() isPool;
  @Input() currentStep: number;
  @Input() teams: TournamentTeam[];
  @Input() pools: PoolModel[] = [];
  @Input() victoryPoints: number;
  @Input() drawPoints: number;
  @Input() lossPoints: number;
  @Output() checkPoolsTeams = new EventEmitter();
  @Output() setPools = new EventEmitter();
  @Output() setConfrontations = new EventEmitter();
  @Output() setVictoryPoints = new EventEmitter();
  @Output() setDrawPoints = new EventEmitter();
  @Output() setLossPoints = new EventEmitter();
  @Output() checkPoolsValid = new EventEmitter();
  @Output() setCurrentStep = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'PoolEditorComponent');
  }

  fbkOnInit() {
    this.sortPools();
    this.pools.forEach((pool) => {
      this.teams.forEach((team) => {
        if (pool.containsTeam(team.team)) {
          team.setPool(pool.name);
        }
      });
    });
  }
  showPoolEditor() {
    this.teams.forEach((team) => {
      team.resetPlayoffsPosition();
    });
    this.isShowingPoolEditor = true;
    this.currentStep = -1;
    this.setCurrentStep.emit(this.currentStep);
    this.initPools();
  }
  closePoolEditor() {
    this.isShowingPoolEditor = false;
  }

  hidePoolEditor() {
    this.isShowingPoolEditor = false;
    this.updateTournamentPools();
    this.checkPoolsValid.emit();
  }

  setSelectedTeam(teamIndex: number) {
    this.selectedTeamIndex = teamIndex;
  }

  addPool() {
    this.nextPoolNumber = this.findNextPoolNumber();
    this.pools.push(new PoolModel({name: this.getTranslation('pool_name') + (this.nextPoolNumber)}));
    this.sortPools();
  }

  addTeamToPool(poolIndex: number) {
    if (this.selectedTeamIndex != undefined) {
      this.pools[poolIndex].addTeam(this.teams[this.selectedTeamIndex].team);
      this.teams[this.selectedTeamIndex].setPool(this.pools[poolIndex].name);
      this.selectedTeamIndex = undefined;
    }
  }

  removeTeamFromPool(poolIndex: number, team: TournamentTeam) {
    team.resetPool();
    this.pools[poolIndex].removeTeam(team.team);
  }

  removePool(poolIndex: number) {
    this.pools[poolIndex].resetTeamsPool(this.teams);
    this.pools.splice(poolIndex, 1);
  }

  updateConfrontations(value) {
    this.setConfrontations.emit(value);
  }

  updateTournamentPools() {
    this.setPools.emit(this.pools);
    if (this.tournament) {
      this.tournament.arePoolsFinished = false;
      this.tournament.finalStage = -1;
      this.tournament.is_pool = this.isPool;
    }
  }

  toggleIsShowingExplanation() {
    this.isShowingExplanation = !this.isShowingExplanation;
  }

  findNextPoolNumber(): number {
    const poolNumber = this.pools.length;
    const poolNumbers = this.pools.map((pool) => this.getPoolNumber(pool));
    for (let i = 1; i < poolNumbers[poolNumbers.length - 1]; i++) {
      if (!poolNumbers.includes(i)) {
        return i;
      }
    }
    return poolNumber + 1;
  }

  getPoolNumber(pool: PoolModel): number {
    return Number(pool.name.replace(/[a-zA-Z]* n°/, ''));
  }

  private sortPools(): void {
    this.pools.sort((a, b) => {
      return this.getPoolNumber(a) - this.getPoolNumber(b);
    });
  }

  private initPools() {
    if (this.pools.length === 0) {
      this.addPool();
    }
  }

  randomFill() {
    this.clearPools();
    const poolsNumber = this.pools.length;
    let poolIndex = 0;
    let teamsArray = this.teams;
    for (let teamIndex = 0; teamIndex < this.teams.length; teamIndex++) {
      const randomTeam = teamsArray[Math.floor(Math.random() * teamsArray.length)];
      teamsArray = teamsArray.filter((team) => team != randomTeam);
      if (poolIndex < poolsNumber) {
        this.pools[poolIndex].addTeam(randomTeam.team);
        randomTeam.setPool(this.pools[poolIndex].name);
        poolIndex++;
      } else if (poolIndex == poolsNumber) {
        poolIndex = 0;
        this.pools[poolIndex].addTeam(randomTeam.team);
        randomTeam.setPool(this.pools[poolIndex].name);
        poolIndex++;
      }
    }
    this.selectedTeamIndex = null;
  }
  clearPools() {
    this.selectedTeamIndex = null;
    for (let poolIndex = 0; poolIndex < this.pools.length; poolIndex++) {
      if (this.pools[poolIndex].teams.length > 0) {
        this.pools[poolIndex].resetTeamsPool(this.teams);
        const teamsLenght = this.pools[poolIndex].teams.length;
        for (let teamIndex = 0; teamIndex < teamsLenght; teamIndex++) {
          const team = this.pools[poolIndex].teams[0];
          if (team) {
            team.resetPool();
            this.pools[poolIndex].removeTeam(team);
          }
        }
      }
    }
  }
  @HostListener('document:keydown.escape', ['$sevent'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.selectedTeamIndex = null;
  }
}
