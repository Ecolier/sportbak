import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerTokenService} from '../../shared/services/manager.service';
import {LiveStream, LiveStreamService} from '../live-stream/live-stream.service';
import {Session} from '../session.model';
import {SessionService} from '../session.service';
import {Timer} from './timer.model';
import {TimerService} from './timer.service';

@Component({
  selector: 'inline-scorer',
  templateUrl: './session-scorer.component.html',
  styleUrls: ['./session-scorer.component.scss'],
})
export class SessionScorerComponent extends FBKComponent implements OnDestroy {
  @Input() fieldId: string;
  private readonly ngOnDestroy$ = new Subject<void>();
  private sessionTimer = new TimerService();
  timer$ = new EventEmitter<Timer>();
  session?: Session;
  timer?: Timer;

  constructor(
    private sessionService: SessionService,
    private tokenService: ManagerTokenService,
    private translateService: TranslateAppProvider,
    private liveStreamService: LiveStreamService,
    private elementRef: ElementRef) {
    super(elementRef, translateService, 'SessionScorerComponent');
    this.sessionTimer.onUpdateTimer.pipe(takeUntil(this.ngOnDestroy$)).subscribe(this.timer$);
    this.timer$.subscribe((timer) => this.timer = timer);
  }

  sendTeamName(forTeam: number, name: string) {
    this.sessionService.teamNames(this.fieldId,
      forTeam === 1 ? name : this.session.teamName1,
      forTeam === 2 ? name : this.session.teamName2);
  }

  sendScore(forTeam: number, score: string) {
    this.sessionService.score(this.fieldId,
      forTeam === 1 ? parseInt(score) : this.session.scoreTeam1,
      forTeam === 2 ? parseInt(score) : this.session.scoreTeam2);
  }

  fbkOnInit() {
    this.sessionService.onSession(this.fieldId).pipe(takeUntil(this.ngOnDestroy$)).subscribe((session) => {
      this.sessionTimer.update(session);
      if (!this.session && session) this.sessionTimer.start();
      else if (this.session && !session) this.sessionTimer.stop();
      this.session = session;
    });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
    this.liveStreamService.destroy(this.fieldId);
  }
}
