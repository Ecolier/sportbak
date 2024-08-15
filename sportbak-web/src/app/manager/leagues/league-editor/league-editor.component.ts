import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {CompetitionModel} from 'src/app/shared/models/league/competition.model';
import {LeagueModel} from 'src/app/shared/models/league/league.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';

@Component({
  selector: 'league-editor',
  templateUrl: './league-editor.component.html',
  styleUrls: ['./league-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeagueEditorComponent extends FBKComponent {
  isSportChosen: boolean = false;
  complex: ComplexModel;
  sport: string;
  hasLoaded: boolean;
  league: LeagueModel;
  isAskingRegistration = false;
  isRegistered = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private _router: Router,
    private managerProvider: ManagerProvider,
    protected managerMenuService: ManagerMenuService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('leagues');
  }

  fbkOnInit() {
    this.complex = this.managerProvider.getComplex();
    this.checkComplexSport(this.complex);
    if (this.activatedRoute.snapshot.queryParams['league_id']) {
      this.loadLeague();
    } else {
      this.hasLoaded = true;
    }
  }

  loadLeague() {
    this.managerProvider.getLeagueById(this.activatedRoute.snapshot.queryParams['league_id']).subscribe((response) => {
      this.league = new CompetitionModel(response).convertToLeague();
      this.checkComplexSport(this.complex);
      this.hasLoaded = true;
    });
  }

  registerAndRedirectToLeagues() {
    this.isRegistered = true;
    this.redirectToLeagues();
  }

  redirectToLeagues() {
    if (this.isRegistered) {
      this._router.navigate(['/manager/leagues']);
    } else {
      this.askForRegistration();
    }
  }

  selectedSportCreation($sport) {
    this.sport = $sport;
    this.isSportChosen = true;
  }

  checkComplexSport(complex) {
    if (complex.sport.length > 1 && !this.league) {
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
      this.redirectToLeagues();
    }
  }

  closeWarning() {
    this.isAskingRegistration = false;
  }
}
