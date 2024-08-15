import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FBKComponent } from 'src/app/shared/components/base.component';
import { GameModel } from 'src/app/shared/models/league/game.model';
import { PoolModel } from 'src/app/shared/models/league/pool.model';
import { TournamentModel } from 'src/app/shared/models/league/tournament.model';
import { TranslateAppProvider } from 'src/app/shared/services/translate/translate.service';
import { getShirt, getTeam } from "src/app/manager/tournaments/tournaments.helper";
import { LeagueTeam } from 'src/app/shared/models/league/league-team.model';
import { Router } from '@angular/router';
import { SBKEventsProvider } from 'src/app/shared/services/events.provider';
import { getLeagueTeam } from "../../shared/helpers/competition.helper";

@Component({
  selector: 'pool-games',
  templateUrl: './pool-games.component.html',
  styleUrls: ['./pool-games.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PoolGamesComponent extends FBKComponent {
  TEAMS_SHIRTS_URL: string = '/teams/shirts/';
  dayDisplay: boolean[][] = [];
  phaseDisplay: boolean[] = [];
  @Input() pool: PoolModel;
  @Input() tournament:TournamentModel;
  @Output() onGameClick = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router:Router,
    private eventProvider : SBKEventsProvider
  ) {
    super(_refElement, translate, 'ManagerTournamentRankingComponent');
  }
  fbkOnInit() {
    this.initPhaseAndDayDisplay();
  }

  initPhaseAndDayDisplay() {
    this.phaseDisplay = this.pool.game.map((phase) => true);
    this.dayDisplay = this.pool.game.map((phase) => phase.map((day) => true));
  }

  togglePhase(phaseIndex: number) {
    this.phaseDisplay[phaseIndex] = !this.phaseDisplay[phaseIndex];
  }

  toggleDay(phaseIndex: number, dayIndex: number) {
    this.dayDisplay[phaseIndex][dayIndex] = !this.dayDisplay[phaseIndex][dayIndex];
  }

  gameClick(game:GameModel) {
    this.onGameClick.emit(game);
  }

  getLeagueTeams(game) {
    let teams = [getLeagueTeam(game, 0, this.tournament.teams), getLeagueTeam(game, 1, this.tournament.teams)];
    return teams;
  }

  _getShirt(team: LeagueTeam) {
    return getShirt(team, this.TEAMS_SHIRTS_URL);
  }

  redirectToCalendar(game:GameModel) {
    this.router.navigate(['/manager/calendar'], {queryParams: {game_id: game._id, comp_name: this.tournament.name, comp_type: 'tournament'}});
  }
}
