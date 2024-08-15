import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewEncapsulation} from '@angular/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {PlayerModel} from '../../../../shared/models/user/player.model';
import {ApplicationErrorsIds, showError} from '../../helpers/manager-errors.helper';
import {FBKStaticUrls} from '../../../../shared/values/static-urls';

@Component({
  selector: 'manager-team-adder',
  templateUrl: './manager-team-adder.component.html',
  styleUrls: ['./manager-team-adder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTeamAdderComponent extends FBKComponent {
  isAddingTeam = false;
  isAddingRandomPlayer = false;
  newTeamName = '';
  isValidationModalDisplayed = false;
  isUpdatingTeam = false;
  teamToDeleteIndex: number;
  teamToEdit: LeagueTeam;
  allShirts: string[] = [];
  newShirt: string;
  unknownShirt = FBKStaticUrls.shirt.baseAndUnknown;
  players: PlayerModel[];
  AllTeamHaveDifferentNames : boolean = true;
  @Input() teams: LeagueTeam[];
  @Input() isCompCreated = false;
  @Input() canTeamHaveGuest = true;
  @Input() addsPlayerAtCreation = false;
  @Output() checkTeamPlayers = new EventEmitter();
  @Output() onTeamAdd = new EventEmitter();
  @Output() onTeamDelete = new EventEmitter();
  @Output() checkStart = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'ManagerTeamAdderComponent');
  }

  fbkOnInit() {
    this.managerProvider.getShirts().subscribe({
      next: (response) => this.allShirts = response,
      error: (error) => showError(error, ApplicationErrorsIds.shirts.unable_to_get_shirts),
    });
    this.newShirt = '/default/shirt_unknown.png';
  }

  setNewTeamName(newName) {
    this.getAllTeamsHaveDifferentNames();
    this.newTeamName = newName;
  }

  toggleIsAddingTeam() {
    this.isAddingTeam = !this.isAddingTeam;
    this.focusTeamName();
  }

  private focusTeamName() {
    setTimeout(() => {
      document.getElementById('teamName')?.focus();
    }, 0);
  }

  toggleIsValidationModalDisplayed() {
    this.isValidationModalDisplayed = !this.isValidationModalDisplayed;
  }

  toggleIsUpdatingTeam() {
    this.isUpdatingTeam = !this.isUpdatingTeam;
    this.checkTeamPlayers.emit();
    if (this.checkStart) {
      this.checkStart.emit();
    }
  }

  onAddNewTeam() {
    if (this.AllTeamHaveDifferentNames == true) {
      if (this.allShirts) {
        const defaultShirts = this.allShirts.filter((shirt) => shirt.match('default/'));
        this.newShirt = defaultShirts[Math.floor(Math.random() * defaultShirts.length)];
        this.allShirts = defaultShirts.filter((shirt) => shirt !== this.newShirt);
      }
      const newTeam = new LeagueTeam({name: this.newTeamName, shirt: this.newShirt});
      if (this.addsPlayerAtCreation) {
        this.isAddingRandomPlayer = true;
        newTeam.addRandomPlayer(this.managerProvider)
            .then(() => this.addNewTeam(newTeam))
            .catch((error) => showError(error, ApplicationErrorsIds.players.cannot_add_random_player))
            .finally(() => {
              this.isAddingRandomPlayer = false;
              this.focusTeamName();
            });
      } else {
        this.addNewTeam(newTeam);
      }
    }
  }

  addNewTeam(newTeam: LeagueTeam) {
    this.teams.push(newTeam);
    this.newTeamName = '';
    this.checkTeamPlayers.emit();
    if (this.onTeamAdd) {
      this.onTeamAdd.emit(newTeam);
    }
  }

  @HostListener('document:keydown.enter', ['$sevent'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isAddingTeam && this.newTeamName.length > 0) {
      this.onAddNewTeam();
    }
  }

  getAllTeamsHaveDifferentNames() {
    const teamNames = this.teams.map((team) => team.name);
    this.AllTeamHaveDifferentNames = true;
    for (let i = 0; i < teamNames.length; i++) {
      if (teamNames[i] == this.newTeamName) {
        this.AllTeamHaveDifferentNames = false;
      }
    }
  }

  setTeamToEdit(teamIndex: number) {
    this.teamToEdit = this.teams[teamIndex];
    this.toggleIsUpdatingTeam();
  }

  setTeamToDelete(teamIndex: number) {
    this.teamToDeleteIndex = teamIndex;
    this.toggleIsValidationModalDisplayed();
  }

  deleteTeam() {
    const teamToDelete = this.teams[this.teamToDeleteIndex];
    this.teams = this.teams.filter((team) => team.name != teamToDelete.name);
    if (this.onTeamDelete) {
      this.onTeamDelete.emit(this.teamToDeleteIndex);
    }
    this.toggleIsValidationModalDisplayed();
  }
}
