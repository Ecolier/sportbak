import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {ManagerProvider} from '../../shared/services/manager.service';

@Component({
  selector: 'tournament-editor',
  templateUrl: './tournament-editor.component.html',
  styleUrls: ['./tournament-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TournamentEditorComponent extends FBKComponent {
  isSportChosen: boolean = false;
  complex: ComplexModel;
  sport: string;
  hasLoaded: boolean;
  tournament: TournamentModel;
  isAskingRegistration = false;
  isRegistered = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private _router: Router,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('tournaments');
  }

  fbkOnInit() {
    this.complex = this.managerProvider.getComplex();
    this.checkComplexSport(this.complex);
    if (this.activatedRoute.snapshot.queryParams['tournament_id']) {
      this.loadTournament();
    } else {
      this.hasLoaded = true;
    }
  }

  loadTournament() {
    this.managerProvider.getTournamentById(this.activatedRoute.snapshot.queryParams['tournament_id']).subscribe((response) => {
      this.tournament = new CompetitionModel(response).convertToTournament();
      this.checkComplexSport(this.complex);
      this.hasLoaded = true;
    });
  }

  registerAndRedirectToTournaments() {
    this.isRegistered = true;
    this.redirectToTournaments();
  }

  redirectToTournaments() {
    if (this.isRegistered) {
      this._router.navigate(['/manager/tournaments']);
    } else {
      this.askForRegistration();
    }
  }

  selectedSportCreation($sport) {
    this.sport = $sport;
    this.isSportChosen = true;
  }

  checkComplexSport(complex) {
    if (complex.sport.length > 1 && !this.tournament) {
      this.isSportChosen = false;
    } else {
      this.isSportChosen = true;
      this.sport = complex.sport[0];
    }
  }

  askForRegistration() {
    if (this.isSportChosen) {
      this.isAskingRegistration = true;
    } else {
      this.isRegistered = true;
      this.redirectToTournaments();
    }
  }

  closeWarning() {
    this.isAskingRegistration = false;
  }
}
