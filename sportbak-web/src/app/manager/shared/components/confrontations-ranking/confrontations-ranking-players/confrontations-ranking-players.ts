import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {PlayerModel} from 'src/app/shared/models/user/player.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SportConstants, SportType} from 'src/app/shared/values/sport';
import {FBKStaticUrls} from 'src/app/shared/values/static-urls';
import {ConfrontationsRakingFoot5Template} from './conf.foot5';
import {ConfrontationsRakingPadelTemplate} from './conf.padel';

const _staticShirtUrl = FBKStaticUrls.shirt.base;
const _unknownShirtUrl = FBKStaticUrls.shirt.unknown;

type Template = {
  width : string,
  scrollable : boolean,
  tableWidth : string,
  columns : any[]
}
@Component({
  selector: 'futbak-competitions-confrontations-ranking-players',
  templateUrl: 'confrontations-ranking-players.html',
  styleUrls: ['./confrontations-ranking-players.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CompetitionsConfrontationsRankingPlayersComponent extends FBKComponent {
  @Input() public sport : SportType;
  @Input() public teams : LeagueTeam[];
  @Input() public focusUserId : string;
  @Output() public clickOnPlayer = new EventEmitter<PlayerModel>();
  @Output() public clickOnTeam = new EventEmitter<LeagueTeam>();

  public allTeamsPlayers: Object[] = [];
  public sortAscending : boolean = true;
  public sortPlayerColumnAscending : boolean = true;
  public playerIndexSelected: number = 0;
  public _linkId : string;
  public titleFontSize : number = 13;
  public nameStyle : any = {};
  public rowHeight : number;
  public rowContentHeight : number;
  public scrollingMaximum : boolean = false;

  // ******************************************************* //
  // ******************  TEMPLATE  ******************* //
  // ******************************************************* //

  public templates = [];
  public styles : any = {};
  public staticShirtUrl = _staticShirtUrl;
  public unknownShirtUrl = _unknownShirtUrl;

  // ******************************************************* //
  // ******************************************************* //
  // ******************************************************* //

  constructor(
    protected _refElement: ElementRef,
    protected translate : TranslateAppProvider,
  ) {
    super(_refElement, translate, 'CompetitionsConfrontationsRankingPlayersComponent');
  }

  fbkOnInit() {
    const width = this.getWidth();
    this._linkId = this.getUniqueComponentId();
    this.initAllTeamsPlayers();
    this.addInfosPlayers();
    this.initialPlayersSort(this.allTeamsPlayers, false);
    this.addRankPlayers();
    this.initTemplateColumns(width);
    this.initVariables(width);
  }

  fbkAfterInit() {
    const width = this.getWidth();
    this.initVariables(width);
    // this.takeScreenshot(5000);
  }

  async takeScreenshot(afterDelay = 0) {
    /* await FBKUtilitiesService.delay(Math.max(0, afterDelay));
    let doc = this._refElement.nativeElement;
    this.screenshotProvider.saveElementScreenshot('rank', doc);*/
  }

  fbkInputChanged(inputName : string, currentValue : any, lastValue : any) {
    if (inputName == 'teams') {
      const width = this.getWidth();
      this.initVariables(width);
    }
  }

  initVariables(width) {
    this.rowHeight = 25;
    if (width > 600) {
      this.rowHeight = 35;
    }
    this.nameStyle = this.getNameStyle(width);
    this.styles['normal'] = this.getNormalValueStyle(width);
    this.rowContentHeight = Math.floor(this.rowHeight * 0.75);
    if (width < 400) {
      this.titleFontSize = 13;
    } else if (width < 600) {
      this.titleFontSize = 14;
    } else if (width < 1000) {
      this.titleFontSize = 15;
    } else {
      this.titleFontSize = 16;
    }
    // this.titleFontSize = Math.floor(width * 0.1 / 3.25);
    if (this.templates) {
      for (const column of this.templates) {
        column.styles['header'] = this.getColumnStyle(column, true);
        column.styles['value'] = this.getColumnStyle(column);
      }
    }
  }

  initTemplateColumns(width) {
    if (this.sport == SportConstants.foot5.name) {
      this.templates = ConfrontationsRakingFoot5Template.getTemplate(this.getTranslation.bind(this), width);
    } else if (this.sport == SportConstants.padel.name) {
      this.templates = ConfrontationsRakingPadelTemplate.getTemplate(this.getTranslation.bind(this), width);
    }
  }


  initAllTeamsPlayers() {
    this.allTeamsPlayers = [];
    for (let index = 0; index < this.teams.length; index++) {
      for (let i = 0; i < this.teams[index].player.length; i++) {
        this.allTeamsPlayers.push({...this.teams[index].player[i], shirt: this.teams[index].shirt});
      }
    }
  }

  addInfosPlayers() {
    this.allTeamsPlayers = this.allTeamsPlayers.map((player, index)=>(
      {...player, nickname: player['user'].nickname, combined: parseInt(player['goals'] + player['assists']), me: this.focusUserId ? player['user']['_id'] == this.focusUserId : false}
    ));
  }

  addRankPlayers() {
    this.allTeamsPlayers = this.allTeamsPlayers.map((player, index)=>(
      {...player, rank: index + 1}
    ));
  }

  // ******************************************************* //
  // ******************  COLUMN  ******************* //
  // ******************************************************* //

  playerColumnClicked(index) {
    if (this.playerIndexSelected == index) {
      this.sortPlayerColumnAscending = this.sortPlayerColumnAscending ? false : true;
    } else {
      this.sortPlayerColumnAscending = true;
    }
    this.playerIndexSelected = index;
    const inverseSort = this.templates[index].defaultSortInverse ? this.sortPlayerColumnAscending : !this.sortPlayerColumnAscending;
    this.sortPlayersByKey(this.allTeamsPlayers, this.templates[index].key, inverseSort);
  }

  // ******************************************************* //
  // ******************  STYLE  ******************* //
  // ******************************************************* //

  getNormalValueStyle(width) {
    const style = {};
    let fontSize = 12;
    if (width < 400) {
      fontSize = 12;
    } else if (width < 600) {
      fontSize = 12;
    } else if (width < 1000) {
      fontSize = 13;
    } else {
      fontSize = 14;
    }
    style['fontSize'] = fontSize + 'px';// Math.min(this.rowContentHeight, Math.floor(width * 0.15 / 4.5)) + 'px';
    return style;
  }


  getNameStyle(width) {
    const style = {};
    let fontSize = 13;
    if (width < 400) {
      fontSize = 13;
    } else if (width < 600) {
      fontSize = 13;
    } else if (width < 1000) {
      fontSize = 14;
    } else {
      fontSize = 15;
    }
    style['fontSize'] = fontSize + 'px';// Math.min(this.rowContentHeight, Math.floor(width * 0.15 / 4)) + 'px';
    return style;
  }

  getColumnStyle(column, header = false) {
    const style = {};
    if (!header) {
      style['height'] = this.rowHeight + 'px';
    }
    style['width'] = column.width;
    return style;
  }

  // ******************************************************* //
  // ******************  GET VALUES  ******************* //
  // ******************************************************* //

  getValue(stats, key) {
    let result = stats[key];
    if (key == 'AGsets') {
      result = stats['sets'] - stats['setsdiff'];
    }
    if (key == 'AGgames') {
      result = stats['games'] - stats['gamesdiff'];
    }
    return result;
  }


  // ******************************************************* //
  // ******************  SORT VALUES  ******************* //
  // ******************************************************* //

  initialPlayersSort(players : Object[], asc = true) {
    return this.sortPlayersByKey(players, 'rank', asc);
  }

  sortPlayersByKey(players : Object[], key, asc = true) {
    if (key == 'nickname') {
      players.sort((a, b) => {
        const result = a['nickname'].localeCompare(b['nickname']);
        return (asc ? 1 : (-1)) * result;
      });
    } if (key == 'AGsets') {
      players.sort((a, b) => {
        const result = (a['sets'] - a['setsdiff']) - (b['sets'] - b['setsdiff']);
        return (asc ? 1 : (-1)) * result;
      });
    } if (key == 'AGgames') {
      players.sort((a, b) => {
        const result = (a['games'] - a['gamesdiff']) - (b['games'] - b['gamesdiff']);
        return (asc ? 1 : (-1)) * result;
      });
    } if (key == 'rank') {
      players.sort((a, b) => {
        let result = 0;
        if (a['rank'] && b['rank']) {
          result = a['rank'] - b['rank'];
        } else {
          result = a['victory'] - b['victory'];
          if (result == 0) {
            result = a['setsdiff'] - b['setsdiff'];
          }
          if (result == 0) {
            result = a['gamesdiff'] - b['gamesdiff'];
          }
        }
        return (asc ? 1 : (-1)) * result;
      });
    } else {
      return players.sort((a, b) => {
        const result = (a[key] - b[key]);
        return (asc ? 1 : (-1)) * result;
      });
    }
  }

  playerClicked(player) {
    this.clickOnPlayer.emit(player);
  }
}
