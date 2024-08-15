import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {getTeam} from '../tournaments.helper';

@Component({
  selector: 'manager-tournament-ranking',
  templateUrl: './manager-tournament-ranking.component.html',
  styleUrls: ['./manager-tournament-ranking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerTournamentRankingComponent extends FBKComponent {
  teams: LeagueTeam[] = [];
  matchs4: GameModel[][][] = [];
  dategame: string[][][] = [];
  colSelectedIndex: number = 0;
  isFromManager: boolean = false;
  poolsWidthSet:boolean;
  selectedPool: number = -1;
  pools: any;
  displayRow: boolean = false;
  @Input() tournament: TournamentModel;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
  ) {
    super(_refElement, translate, 'ManagerTournamentRankingComponent');
  }

  fbkOnInit() {
    this.initIsFromManager();
    this.initializeTeamValues();
    this.updateRankTeam();
    this.getAllDate();
    this.initPoolsWidth();
    this.pools = this.tournament.pool
  }

  initPoolsWidth() {
    const navbar = document.getElementById('tournament-details');
    this.poolsWidthSet = true;
    document.getElementById('pools').style.maxWidth = (navbar.clientWidth - 15).toString()+'px';
  }

  initIsFromManager() {
    this.isFromManager = this.router.url.includes('manager');
  }

  private initializeTeamValues() {
    for (let i = 0; i < this.tournament.teams.length; i++) {
      this.tournament.teams[i].updateMatch();
      this.tournament.teams[i].updateScore(this.tournament.wpoint, this.tournament.dpoint, this.tournament.lpoint);
      this.tournament.teams[i].updateLastResult();
    }
    for (let i = 0; i < this.tournament.pool.length; i++) {
      for (let h = 0; h < this.tournament.pool[i].teams.length; h++) {
        this.tournament.pool[i].teams[h].updateMatch();
        this.tournament.pool[i].teams[h].updateScore(this.tournament.wpoint, this.tournament.dpoint, this.tournament.lpoint);
        this.tournament.pool[i].teams[h].updateLastResult();
      }
    }
    for (let i = 0; i < this.tournament.pool.length; i++) {
      for (let j = 0; j < this.tournament.pool[i].game.length; j++) {
        for (let h = 0; h < this.tournament.pool[i].game[j].length; h++) {
          for (let g = 0; g < this.tournament.pool[i].game[j][h].length; g++) {
            this.tournament.pool[i].game[j][h].sort(function(a, b) {
              return (b.status.localeCompare(a.status));
            });
          }
        }
      }
    }
    for (let j = 0; j < this.tournament.pool[0].game.length; j++) {
      this.matchs4[j] = this.tournament.pool[0].game[j];
    }
  }

  updateRankTeam() {
    let rank: number;
    let j = 0;
    let rankJump = 0;
    rank = 0;

    for (let h = 0; h < this.tournament.pool.length; h++) {
      this.tournament.pool[h].teams.sort(function(a, b) {
        return ((b.goal - b.tgoal) - (a.goal - a.tgoal));
      });
      this.tournament.pool[h].teams.sort(function(a, b) {
        return (b.points - a.points);
      });
      for (let i = 0; i < this.tournament.pool[h].teams.length; i += 1) {
        j = i - 1;
        if (j >= 0 && this.tournament.pool[h].teams[i].points == this.tournament.pool[h].teams[j].points &&
          this.tournament.pool[h].teams[i].goal - this.tournament.pool[h].teams[i].tgoal ==
          this.tournament.pool[h].teams[j].goal - this.tournament.pool[h].teams[j].tgoal) {
          rankJump += 1;
        } else if ((j >= 0 && (this.tournament.pool[h].teams[i].points != this.tournament.pool[h].teams[j].points ||
          (this.tournament.pool[h].teams[i].goal - this.tournament.pool[h].teams[i].tgoal !=
            this.tournament.pool[h].teams[j].goal - this.tournament.pool[h].teams[j].tgoal &&
            this.tournament.pool[h].teams[i].points == this.tournament.pool[h].teams[j].points))) || (j < 0)) {
          rank += 1 + rankJump;
          rankJump = 0;
        }
        this.tournament.pool[h].teams[i].rank = rank;
      }
      rank = 0;
      rankJump = 0;
    }
  }

  getAllDate() {
    for (let i = 0; i < this.matchs4.length; i++) {
      this.dategame[i] = [];
      for (let j = 0; j < this.matchs4[i].length; j++) {
        this.dategame[i][j] = [];
        for (let h = 0; h < this.matchs4[i][j].length; h++) {
          if (this.matchs4[i][j][h].startedAt) {
            const newdate = new Date(this.matchs4[i][j][h].startedAt);
            this.dategame[i][j][h] = newdate.toString();
          } else {
            this.dategame[i][j][h] = null;
          }
        }
      }
    }
  }

  setColSelectedIndex(value:number) {
    this.colSelectedIndex = value;
  }

  onGameClick(game: GameModel): void {
    const game2 = new GameModel(game);
    game2.teams[0].from = getTeam('0', game, this.tournament);
    game2.teams[1].from = getTeam('1', game, this.tournament);
    if (this.isFromManager) {
      this.router.navigate(['/manager/game-sheet'], {queryParams: {game_id: game2._id, tournament_id: this.tournament._id}});
    }
  }

  selectPools(indexPool){
    this.pools = []
    if (indexPool == -1) {
      this.pools = this.tournament.pool
    }else{
      this.pools.push(this.tournament.pool[indexPool]); 
    }
  }

  chooseDisplay(){
    this.displayRow = !this.displayRow
  }
}
