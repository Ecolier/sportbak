import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKStaticUrls} from '../../../../shared/values/static-urls';

@Component({
  selector: 'team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TeamEditorComponent extends FBKComponent {
  isEditingTeamName = false;
  teamNameInput = '';
  isSelectingShirt = false;
  previousTeam: LeagueTeam;
  shirtBaseURL: string = FBKStaticUrls.shirt.base;
  unknownShirt = FBKStaticUrls.shirt.baseAndUnknown;
  @Input() isDisplayed = false;
  @Input() team: LeagueTeam;
  @Input() canTeamHaveGuest = true;
  @Output() onValidate = new EventEmitter();
  @Output() hideTeamEditor = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'TeamEditorComponent');
  }

  fbkOnInit() {
  }

  fbkInputChanged() {
    this.previousTeam = new LeagueTeam();
    this.previousTeam.name = this.team?.name;
    if (this.team) {
      this.previousTeam.player = [...this.team.player];
    }
  }

  validateTeamUpdate() {
    this.resetValues();
    this.onValidate.emit();
  }

  cancelTeamUpdate() {
    this.team.player = [...this.previousTeam.player];
    this.team.name = this.previousTeam.name;
    this.hideTeamEditor.emit();
  }

  resetValues() {
    this.teamNameInput = '';
    this.isEditingTeamName = false;
  }

  editTeamName() {
    this.isEditingTeamName = true;
    this.teamNameInput = this.team.name;
  }

  updateTeamInput(value) {
    this.teamNameInput = value;
  }

  validateTeamName() {
    this.team.name = this.teamNameInput;
    this.isEditingTeamName = false;
  }

  cancelTeamNameEdit() {
    this.isEditingTeamName = false;
  }

  toggleShirtSelector() {
    this.isSelectingShirt = !this.isSelectingShirt;
  }

  addPlayerToTeam(player) {
    this.team.addPlayer(player);
  }

  removePlayer(playerIndex: number) {
    const deletedPlayerId = this.team.player[playerIndex].user._id;
    this.team.removePlayer(deletedPlayerId);
  }

  setTeamShirt(shirt: string) {
    this.team.setShirt(shirt);
    this.toggleShirtSelector();
  }

  setCaptain(playerId: string) {
    this.team.setCaptain(playerId);
  }
}
