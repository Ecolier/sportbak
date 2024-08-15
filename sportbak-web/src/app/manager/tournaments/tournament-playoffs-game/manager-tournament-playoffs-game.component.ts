import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Conf} from 'src/app/conf';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {TournamentGame} from '../../shared/helpers/tournament-helpers';
const SHIRTS_URL = Conf.staticBaseUrl + '/teams/shirts/';
const UNKNOWN_SHIRT = 'default/shirt_unknown.png';

@Component({
  selector: 'manager-tournament-playoffs-game',
  templateUrl: './manager-tournament-playoffs-game.component.html',
  styleUrls: ['./manager-tournament-playoffs-game.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentPlayoffsGameComponent extends FBKComponent {
  @Input() game: TournamentGame;
  @Output() onGameClick = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(_refElement, translate, 'ManagerTournamentPlayoffsGameComponent');
  }
  fbkOnInit() {
  }

  getTeamJersey(team: LeagueTeam): string {
    if (team) {
      return (SHIRTS_URL + team.shirt);
    }
    return this.getDefaultJersey();
  }

  getDefaultJersey(): string {
    return SHIRTS_URL + UNKNOWN_SHIRT;
  }
}
