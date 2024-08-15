import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {PlayerModel} from 'src/app/shared/models/user/player.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKAssetsPaths} from 'src/app/shared/values/assets-paths';
import {FBKColors} from 'src/app/shared/values/colors';
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
  selector: 'futbak-competitions-confrontations-ranking-teams',
  templateUrl: 'confrontations-ranking-teams.html',
  styleUrls: ['./confrontations-ranking-teams.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class CompetitionsConfrontationsRankingTeamsComponent extends FBKComponent {
  @Input() public sport : SportType;
  @Input() public teams : LeagueTeam[];
  @Input() public focusUserId : string;
  @Output() public clickOnPlayer = new EventEmitter<PlayerModel>();
  @Output() public clickOnTeam = new EventEmitter<LeagueTeam>();

  public allTeamsPlayers: Object[] = [];
  public headerIndexSelected : number = 0;
  public partIndexSelected : number = 0;
  private sortAscending : boolean = true;
  public _linkId : string;
  public titleFontSize : number = 13;
  public nameStyle : any = {};
  private rowHeight : number;
  public rowContentHeight : number;
  public scrollingMaximum : boolean = false;
  public teamsObj : any[];
  public assestsPath = FBKAssetsPaths.competition;


  // ******************************************************* //
  // ******************  TEMPLATE  ******************* //
  // ******************************************************* //

  public templates : Template[];
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
    super(_refElement, translate, 'CompetitionsConfrontationsRankingTeamsComponent');
  }

  fbkOnInit() {
    const width = this.getWidth();
    this.initialSort();
    this._linkId = this.getUniqueComponentId();
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
    this.updateTeams();
    this.rowContentHeight = Math.floor(this.rowHeight * 0.75);
    this.nameStyle = this.getNameStyle(width);
    this.styles['points'] = this.getSpecialValueStyle(width);
    this.styles['normal'] = this.getNormalValueStyle(width);
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
      for (const template of this.templates) {
        for (const column of template.columns) {
          column.styles['header'] = this.getColumnStyle(column, true);
          column.styles['value'] = this.getColumnStyle(column);
        }
      }
    }
  }

  updateTeams() {
    const teams = [];
    if (this.teams) {
      for (const team of this.teams) {
        teams.push({...team, isMyTeam: this.focusUserId ? team.containUser(this.focusUserId) : false});
      }
    }
    this.teamsObj = teams;
  }

  initTemplateColumns(width) {
    if (this.sport == SportConstants.foot5.name) {
      this.templates = ConfrontationsRakingFoot5Template.getTemplate(this.getTranslation.bind(this), width);
    } else if (this.sport == SportConstants.padel.name) {
      this.templates = ConfrontationsRakingPadelTemplate.getTemplate(this.getTranslation.bind(this), width);
    }
  }

  // ******************************************************* //
  // ******************  COLUMN  ******************* //
  // ******************************************************* //

  headerColumnClicked(partIndex, index) {
    if (this.headerIndexSelected == index && this.partIndexSelected == partIndex) {
      this.sortAscending = this.sortAscending ? false : true;
    } else {
      this.sortAscending = true;
    }
    this.headerIndexSelected = index;
    this.partIndexSelected = partIndex;
    this.sortValues(partIndex, index, this.sortAscending);
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

  getSpecialValueStyle(width) {
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
    style['borderBottom'] = '1px solid ' + FBKColors.primary;
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
  // ******************  SORT VALUES  ******************* //
  // ******************************************************* //

  initialSort(asc = true) {
    return this.sortByKey('rank', asc);
  }

  sortByKey(key, asc = true) {
    return this.teamsObj.sort((a, b) => {
      const result = (a[key] - b[key]);
      return (asc ? 1 : (-1)) * result;
    });
  }

  sortValues(partIndex, columnIndex, asc = true) {
    const key = this.templates[partIndex].columns[columnIndex].key;
    const inverseSort = this.templates[partIndex].columns[columnIndex].defaultSortInverse;
    asc = inverseSort ? !asc : asc;
    this.initialSort(asc);
    if (key) {
      if (key == 'team') {
        this.teamsObj.sort((a, b) => {
          const result = a.name.localeCompare(b.name);
          return (asc ? 1 : (-1)) * result;
        });
      } else if (key == 'DBgoals') {
        this.teamsObj.sort((a, b) => {
          const result = (a.goal - a.tgoal) - (b.goal - b.tgoal);
          return (asc ? 1 : (-1)) * result;
        });
      } else if (key == 'DBscoringSetsGames') {
        this.teamsObj.sort((a, b) => {
          const result = (a.scoringSetsGames - a.scoringSetsTGames) - (b.scoringSetsGames - b.scoringSetsTGames);
          return (asc ? 1 : (-1)) * result;
        });
      } else if (key == 'serie') {
        this.teamsObj.sort((a, b) => {
          let result = 0;
          if (a.lastresults.length > 0 && b.lastresults.length > 0) {
            let sumA = 0;
            let sumB = 0;
            for (const v of a.lastresults) {
              sumA += v ? v : 0;
            }
            for (const v of b.lastresults) {
              sumB += v ? v : 0;
            }
            result = (sumA - sumB);
          } else if (a.lastresults.length > 0) {
            result = -1;
          } else if (b.lastresults.length > 0) {
            result = 1;
          }
          return (asc ? 1 : (-1)) * result;
        });
      } else {
        this.sortByKey(key, asc);
      }
    }
  }

  // ******************************************************* //
  // ******************  GET VALUES  ******************* //
  // ******************************************************* //

  getValue(stats, key) {
    let result = stats[key];
    if (key == 'DBgoals') {
      result = stats['goal'] - stats['tgoal'];
    }
    if (key == 'DBscoringSetsGames') {
      result = stats['scoringSetsGames'] - stats['scoringSetsTGames'];
    }
    return result;
  }

  // ******************************************************* //
  // ******************  ACTIONS ******************* //
  // ******************************************************* //

  onScroll(event) {
    let scrollMax = false;
    if (event) {
      if (event.target) {
        const width = event.target.offsetWidth;
        const offsetLeft = event.target.scrollLeft;
        if (offsetLeft >= width - 5) {
          scrollMax = true;
        }
      }
    }
    this.scrollingMaximum = scrollMax;
  }

  teamClicked(team) {
    this.clickOnTeam.emit(team);
  }
}
