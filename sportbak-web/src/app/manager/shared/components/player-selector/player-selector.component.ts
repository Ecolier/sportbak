import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {PlayerModel} from 'src/app/shared/models/user/player.model';
import {UserModel} from 'src/app/shared/models/user/user.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ApplicationErrorsIds, showError} from '../../helpers/manager-errors.helper';

@Component({
  selector: 'player-selector',
  templateUrl: './player-selector.component.html',
  styleUrls: ['./player-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerSelectorComponent extends FBKComponent {
  playerInput: string = '';
  hasTypedAgain: boolean = false;
  playersMatchingSearch: PlayerModel[] = [];
  randomGuestsAdded: string[] = [];
  isFromCompetition: boolean = false;
  @Input() playersToExclude: PlayerModel[] = [];
  @Input() canHaveGuest: boolean = true;
  @Input() placeholder: string = '';
  @Output() selectPlayer = new EventEmitter();
  @Output() onStartType = new EventEmitter();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'PlayerSelectorComponent');
  }

  fbkOnInit() {
    this.focusInput();
  }

  updatePlayerInput(newValue: string) {
    this.playerInput = newValue;
    this.waitForTypeEnd(newValue);
  }

  waitForTypeEnd(newValue) {
    setTimeout(() => {
      if (newValue === this.playerInput) {
        this.playersMatchingSearch = [];
        this.searchPlayers(this.playerInput);
      }
    }, 500);
  }

  searchPlayers(search: string) {
    const searchedPlayer = search;
    const playersExcluded = this.playersToExclude.map((player) => '"' + player.user._id + '"');
    this.managerProvider.searchUsers(this.playerInput, playersExcluded).subscribe({
      next: (response) => {
        if (response['search'] === searchedPlayer) {
          response['users'].forEach((user) => {
            this.playersMatchingSearch.push(new PlayerModel({user}));
          });
        }
      }, error: (error) => showError(error, ApplicationErrorsIds.players.unable_to_get_players),
    });
  }

  getGuestPlayer() {
    this.managerProvider.getOneRandomGuest(this.randomGuestsAdded).subscribe({
      next: (response) => {
        const guestPlayer = new PlayerModel({user: new UserModel(response)});
        this.randomGuestsAdded.push(guestPlayer._id);
        this.selectPlayer.emit(guestPlayer);
      }, error: (error) => showError(error, ApplicationErrorsIds.players.cannot_get_random_player),
    });
  }

  onPlayerClick(player: PlayerModel) {
    this.selectPlayer.emit(player);
    this.playerInput = '';
    this.focusInput();
  }

  private focusInput() {
    document.getElementById('playerInput').focus();
  }

  onClearClick() {
    this.playerInput = '';
  }
}
