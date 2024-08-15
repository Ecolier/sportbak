import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKAssetsPaths} from 'src/app/shared/values/assets-paths';
import {FBKStaticUrls} from 'src/app/shared/values/static-urls';
import {FBKComponent} from '../../../shared/components/base.component';
import {Dataset} from './draw-playoffs.model';
import {DrawPlayoffsService} from './draw-playoffs.service';

const staticShirtUrl = FBKStaticUrls.shirt.base;
const unknownShirtUrl = FBKStaticUrls.shirt.unknown;
const emptyShirtUrl = FBKStaticUrls.shirt.empty;

@Component({
  selector: 'futbak-competitions-playoffs',
  templateUrl: 'playoffs.html',
  styleUrls: ['./playoffs.scss'],
})

export class CompetitionsPlayoffsComponent extends FBKComponent {
  @Input() public tournament : TournamentModel;

  @Output() clickOnGame = new EventEmitter<GameModel>();

  private drawPlayoffService : DrawPlayoffsService;
  private supportCanvas : HTMLElement;
  private canvas : HTMLCanvasElement;

  private assetsPath = FBKAssetsPaths;

  private dataset : Dataset;

  public roundSelected : number = 0;
  public roundsAvailable : string[];
  public playoffsAvailable : boolean = true;
  public supportCanvasId : string;
  public canvasId : string;

  constructor(
    protected _refElement: ElementRef,
    protected translate : TranslateAppProvider,
  ) {
    super(_refElement, translate, 'CompetitionsPlayoffsComponent');
    this.supportCanvasId = this.getUniqueComponentId() + '-support-canvas';
    this.canvasId = this.getUniqueComponentId() + '-canvas';
  }

  fbkOnInit() {
    this.initVariable();
    if (this.playoffsAvailable) {
      this.supportCanvas = document.getElementById(this.supportCanvasId);
      this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
      this.drawPlayoffService = new DrawPlayoffsService(this.supportCanvas, this.canvas, this);
      this.redraw();
      setTimeout(() => {
        // Redraw after delay to wait font be preloaded
        this.redraw();
      }, 3000);
    }
  }

  fbkAfterInit() {
  }

  fbkWidthChanged(oldWidth : number, newWidth : number, lastWidthDifferentZero : number) {
    if (newWidth != 0) {
      if (newWidth != lastWidthDifferentZero) {
        if (this.drawPlayoffService && this.dataset) {
          this.redraw();
        }
      }
    }
  }

  redraw() {
    if (this.playoffsAvailable) {
      this.dataset = DrawPlayoffsService.generateDataset(this.tournament, this.clickOnTeam.bind(this), this.roundSelected);
      this.drawPlayoffService.draw(this.dataset);
    }
  }

  clickOnTeam(game : GameModel, team : LeagueTeam) {
    this.clickOnGame.emit(game);
  }

  async initVariable() {
    const width = this.getWidth();
    this.playoffsAvailable = this.tournament.finalStage >= 0;
    if (this.tournament) {
      if (this.playoffsAvailable) {
        const rounds = [this.getTranslation('eighth'), this.getTranslation('quarter'), this.getTranslation('semi'), this.getTranslation('final')];
        this.roundsAvailable = [];
        for (let i = this.tournament.finalStage; i < rounds.length; i++) {
          this.roundsAvailable.push(rounds[i]);
        }
      }
    }
  }

  changeRoundSelected(roundSelected) {
    this.roundSelected = roundSelected;
    this.redraw();
  }
}
