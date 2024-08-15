import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-competition-span',
  templateUrl: './manager-competition-span.component.html',
  styleUrls: ['./manager-competition-span.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerCompetitionSpanComponent extends FBKComponent {
  debugMode: boolean = false;
  createdAtDate: string;
  lastGameDate: string;
  @Input() league: LeagueModel;
  @Input() tournament: TournamentModel;
  @Output() edit = new EventEmitter();
  @Output() onClick = new EventEmitter();
  @Output() chosenSport = new EventEmitter<string>()
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
  ) {
    super(_refElement, translate, 'ManagerCompetitionSpanComponent');
  }
  fbkOnInit() {
    this.checkDebugMode();
    this.initDisplayDates();
  }

  checkDebugMode() {
    if (this.route.snapshot.queryParams['debug']) {
      this.debugMode = true;
    }
  }

  initDisplayDates() {
    if (this.league) {
      this.createdAtDate = new Date(this.league.createdAt).toLocaleDateString();
      this.lastGameDate = this.league.summary.lastGame ? new Date(this.league.summary.lastGame).toLocaleDateString() : this.getTranslation('no_games_played');
    } else {
      this.createdAtDate = new Date(this.tournament.createdAt).toLocaleDateString();
      this.lastGameDate = this.tournament.summary.lastGame ? new Date(this.tournament.summary.lastGame).toLocaleDateString() : this.getTranslation('no_games_played');
    }
  }

  onEditClick(event) {
    event.stopPropagation();
    if (this.league) {
      this.edit.emit(this.league);
    } else if (this.tournament) {
      this.edit.emit(this.tournament);
    }
    this.scrollToTop();
  }

  onCompClick() {
    if (this.league) {
      this.onClick.emit(this.league);
    } else if (this.tournament) {
      this.onClick.emit(this.tournament);
    }
    this.scrollToTop();
  }

  scrollToTop() {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
  }

  idClick(event) {
    event.stopPropagation();
  }

  chooseIcon() {
    if (this.league && this.league.sport === 'foot5') {
      return './assets/img/icons/league.png';
    }
    if (this.league && this.league.sport === 'padel') {
      return './assets/img/icons/league_v2_padel.svg';
    }
    if (this.tournament && this.tournament.sport === 'foot5') {
      return './assets/img/icons/tournament.png';
    }
    if (this.tournament && this.tournament.sport === 'padel') {
      return './assets/img/icons/tournament_v2_padel.svg';
    }
  }
}
