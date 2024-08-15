import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';
import {LeagueModel} from '../../../shared/models/league/league.model';


@Component({
  selector: 'futbak-league-ranking',
  templateUrl: 'league-ranking.component.html',
  styleUrls: ['./league-ranking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class LeagueRankingComponent extends FBKComponent {
  @Input() public league : LeagueModel;

  public tabSelected: number = 0;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider) {
    super(_refElement, translate, 'LeagueRankingComponent');
  }

  fbkOnInit() { }

  tabClicked(event: number) {
    this.tabSelected = event;
  }
}
