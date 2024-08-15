import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Conf} from 'src/app/conf';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {LeagueTeam} from 'src/app/shared/models/league/league-team.model';
import {PoolModel} from 'src/app/shared/models/league/pool.model';
import {TournamentModel} from 'src/app/shared/models/league/tournament.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'pool-table',
  templateUrl: './pool-table.component.html',
  styleUrls: ['./pool-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PoolTableComponent extends FBKComponent {
  TEAMS_SHIRTS_URL: string = '/teams/shirts/';
  sortOrder: number = 0;
  @Input() colSelectedIndex: number = 0;
  @Input() pool: PoolModel;
  @Input() tournament:TournamentModel;
  @Output() setColSelectedIndex = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerTournamentRankingComponent');
  }

  fbkOnInit() { }

  sortResume(order: number, colIndex: number) {
    this.setColSelectedIndex.emit(colIndex);
    if (order == 1 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.rank - a.rank);
        });
      }
    } else if (order == 1 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.rank - b.rank);
        });
      }
    } else if (order == 1) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.rank - b.rank);
        });
      }
    }
    if (order == 2 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.name.localeCompare(a.name));
        });
      }
    } else if (order == 2 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.name.localeCompare(b.name));
        });
      }
    } else if (order == 2) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.name.localeCompare(b.name));
        });
      }
    }

    if (order == 3 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.matchsplayed - b.matchsplayed);
        });
      }
    } else if (order == 3 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.matchsplayed - a.matchsplayed);
        });
      }
    } else if (order == 3) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.matchsplayed - a.matchsplayed);
        });
      }
    }

    if (order == 4 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.wmatch - b.wmatch);
        });
      }
    } else if (order == 4 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.wmatch - a.wmatch);
        });
      }
    } else if (order == 4) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.wmatch - a.wmatch);
        });
      }
    }

    if (order == 5 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.dmatch - b.dmatch);
        });
      }
    } else if (order == 5 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.dmatch - a.dmatch);
        });
      }
    } else if (order == 5) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.dmatch - a.dmatch);
        });
      }
    }

    if (order == 6 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.lmatch - b.lmatch);
        });
      }
    } else if (order == 6 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.lmatch - a.lmatch);
        });
      }
    } else if (order == 6) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.lmatch - a.lmatch);
        });
      }
    }
    if (order == 7 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.goal - b.goal);
        });
      }
    } else if (order == 7 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.goal - a.goal);
        });
      }
    } else if (order == 7) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.goal - a.goal);
        });
      }
    }

    if (order == 8 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.tgoal - b.tgoal);
        });
      }
    } else if (order == 8 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.tgoal - a.tgoal);
        });
      }
    } else if (order == 8) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.tgoal - a.tgoal);
        });
      }
    }

    if (order == 9 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return ((a.goal - a.tgoal) - (b.goal - b.tgoal));
        });
      }
    } else if (order == 9 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return ((b.goal - b.tgoal) - (a.goal - a.tgoal));
        });
      }
    } else if (order == 9) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return ((b.goal - b.tgoal) - (a.goal - a.tgoal));
        });
      }
    }

    if (order == 10 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (a.points - b.points);
        });
      }
    } else if (order == 10 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.points - a.points);
        });
      }
    } else if (order == 10) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          return (b.points - a.points);
        });
      }
    }

    if (order == 11 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.stats.globalrating - b.stats.globalrating);
      });
    } else if (order == 11 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.globalrating - a.stats.globalrating);
      });
    } else if (order == 11) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.globalrating - a.stats.globalrating);
      });
    }
    if (order == 12 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.stats.attackrating - b.stats.attackrating);
      });
    } else if (order == 12 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.attackrating - a.stats.attackrating);
      });
    } else if (order == 12) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.attackrating - a.stats.attackrating);
      });
    }
    if (order == 13 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.stats.defenserating - b.stats.defenserating);
      });
    } else if (order == 13 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.defenserating - a.stats.defenserating);
      });
    } else if (order == 13) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.defenserating - a.stats.defenserating);
      });
    }
    if (order == 14 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.stats.collectiverating - b.stats.collectiverating);
      });
    } else if (order == 14 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.collectiverating - a.stats.collectiverating);
      });
    } else if (order == 14) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.collectiverating - a.stats.collectiverating);
      });
    }
    if (order == 15 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.stats.physicalrating - b.stats.physicalrating);
      });
    } else if (order == 15 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.physicalrating - a.stats.physicalrating);
      });
    } else if (order == 15) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.stats.physicalrating - a.stats.physicalrating);
      });
    }

    // if (order == 16 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.globalrating - b.globalrating);
    //   });
    // }
    // else if (order == 16 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.globalrating - a.globalrating);
    //   });
    // }
    // else if (order == 16) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.globalrating - a.globalrating);
    //   });
    // }

    // if (order == 17 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.user.nickname.localeCompare(a.user.nickname));
    //   });
    // }
    // else if (order == 17 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.user.nickname.localeCompare(b.user.nickname));
    //   });
    // }
    // else if (order == 17) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (a.user.nickname.localeCompare(b.user.nickname));
    //   });
    // }

    // if (order == 18 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.goals - b.goals);
    //   });
    // }
    // else if (order == 18 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.goals - a.goals);
    //   });
    // }
    // else if (order == 18) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.goals - a.goals);
    //   });
    // }

    // if (order == 19 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.attackrating - b.attackrating);
    //   });
    // }
    // else if (order == 19 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.attackrating - a.attackrating);
    //   });
    // }
    // else if (order == 19) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.attackrating - a.attackrating);
    //   });
    // }
    // if (order == 20 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.defenserating - b.defenserating);
    //   });
    // }
    // else if (order == 20 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.defenserating - a.defenserating);
    //   });
    // }
    // else if (order == 20) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.defenserating - a.defenserating);
    //   });
    // }
    // if (order == 21 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.collectiverating - b.collectiverating);
    //   });
    // }
    // else if (order == 21 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.collectiverating - a.collectiverating);
    //   });
    // }
    // else if (order == 21) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.collectiverating - a.collectiverating);
    //   });
    // }
    // if (order == 22 && order == this.sortOrder) {
    //   this.sortOrder = order * -1;
    //   this.player.sort(function (a, b) {
    //     return (a.physicalrating - b.physicalrating);
    //   });
    // }
    // else if (order == 22 && order * -1 == this.sortOrder) {
    //   this.sortOrder = this.sortOrder * -1;
    //   this.player.sort(function (a, b) {
    //     return (b.physicalrating - a.physicalrating);
    //   });
    // }
    // else if (order == 22) {
    //   this.sortOrder = order;
    //   this.player.sort(function (a, b) {
    //     return (b.physicalrating - a.physicalrating);
    //   });
    // }

    if (order == 23 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.name.localeCompare(a.name));
      });
    } else if (order == 23 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.name.localeCompare(b.name));
      });
    } else if (order == 23) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (a.name.localeCompare(b.name));
      });
    }

    if (order == 24 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      this.tournament.teams.sort(function(a, b) {
        return (a.goal - b.goal);
      });
    } else if (order == 24 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      this.tournament.teams.sort(function(a, b) {
        return (b.goal - a.goal);
      });
    } else if (order == 24) {
      this.sortOrder = order;
      this.tournament.teams.sort(function(a, b) {
        return (b.goal - a.goal);
      });
    }

    if (order == 25 && order == this.sortOrder) {
      this.sortOrder = order * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          let sum1: number = 0;
          let sum2: number = 0;
          if (a.lastresults.length == 0) {
            sum1 = -4;
          }
          if (b.lastresults.length == 0) {
            sum2 = -4;
          }
          for (let i = 0; i < a.lastresults.length; i++) {
            sum1 = sum1 + a.lastresults[i];
          }
          for (let i = 0; i < b.lastresults.length; i++) {
            sum2 = sum2 + b.lastresults[i];
          }
          return (sum1 - sum2);
        });
      }
    } else if (order == 25 && order * -1 == this.sortOrder) {
      this.sortOrder = this.sortOrder * -1;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          let sum1: number = 0;
          let sum2: number = 0;
          if (a.lastresults.length == 0) {
            sum2 = -4;
          }
          if (b.lastresults.length == 0) {
            sum1 = -4;
          }
          for (let i = 0; i < b.lastresults.length; i++) {
            sum1 = sum1 + b.lastresults[i];
          }
          for (let i = 0; i < a.lastresults.length; i++) {
            sum2 = sum2 + a.lastresults[i];
          }
          return (sum1 - sum2);
        });
      }
    } else if (order == 25) {
      this.sortOrder = order;
      for (let i = 0; i < this.tournament.pool.length; i++) {
        this.tournament.pool[i].teams.sort(function(a, b) {
          let sum1: number = 0;
          let sum2: number = 0;
          if (a.lastresults.length == 0) {
            sum2 = -4;
          }
          if (b.lastresults.length == 0) {
            sum1 = -4;
          }
          for (let i = 0; i < b.lastresults.length; i++) {
            sum1 = sum1 + b.lastresults[i];
          }
          for (let i = 0; i < a.lastresults.length; i++) {
            sum2 = sum2 + a.lastresults[i];
          }
          return (sum1 - sum2);
        });
      }
    }
  }


  getShirt(team: LeagueTeam): string {
    const shirtUrl = Conf.staticBaseUrl + this.TEAMS_SHIRTS_URL;
    return (shirtUrl + team.shirt);
  }
}
