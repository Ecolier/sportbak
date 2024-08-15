import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Hls from 'hls.js';
import { BehaviorSubject, combineLatest, interval, Observable, OperatorFunction, Subject, timer } from 'rxjs';
import { buffer, debounceTime, defaultIfEmpty, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ToastService } from '../shared/components/toast/toast.service';
import { Complex } from '../shared/models/complex.model';
import { Field } from '../shared/models/field.model';
import defaultInterface, { formatInterface, FrontendInterface, FrontendInterfaceBackgroundMode, FrontendInterfaceTheme } from '../shared/models/interface.model';
import { Session } from '../shared/models/session.model';
import { Timer } from '../shared/models/timer.model';
import { bufferDebounce } from '../shared/operators/buffer-debounce';
import { ConfigService } from '../shared/services/config.service';
import { DataService } from '../shared/services/data.service';
import { Action, GamepadService } from '../shared/services/gamepad.service';
import { SessionLimitReached, SessionLimitReachedType, SessionService } from '../shared/services/session.service';
import { TimerService } from '../shared/services/timer.service';
import { UserService } from '../shared/services/user.service';
import { scorerAnimations } from './scorer.animations';

const audioVolumeHight = 0.5;
const audioVolumeLow = 0.1;
const audioVolumeStop = 0;

const videoVolumeHight = 1;
const videoVolumeStop = 0;

const defaultLogo = '/assets/sbk-light.png';

export type VideoType = 'goal' | 'buzz' | 'var' | 'replay' | 'none';
export type VideoElementRef = ElementRef<HTMLMediaElement>;

enum SoundTransitionPeriod {
  startPeriod = '/assets/sounds/start.mp3',
  endPeriod = '/assets/sounds/end_game.mp3',
  endPeriodAmbiance = '/assets/sounds/end_game_ambiance.mp3',
  break = '/assets/sounds/break.mp3',
}

export interface StartVideoOptions {
  type: VideoType;
  args?: any;
}

export type ActionMappings = {
  [key in Action]: Function;
}

export type VideoPipe = (...args: any[]) => Promise<HTMLMediaElement>;

@Component({
  selector: 'sbk-scorer',
  templateUrl: './scorer.component.html',
  styleUrls: ['./scorer.component.scss'],
  animations: scorerAnimations
})
export class ScorerComponent implements AfterViewInit, OnDestroy {

  ngOnDestroy$ = new Subject<void>();

  keyMapping: ActionMappings = {
    goalTeam1: () => this.sessionService.addGoalTeam1(),
    var: () => this.sessionService.var(),
    goalTeam2: () => this.sessionService.addGoalTeam2(),
    up: () => {
      if (this.pauseIsEnabled) {
        if (this.session && this.session.isPaused) {
          this.sessionService.restartSession()
        } else {
          this.sessionService.pauseSession()
        } 
      }
    },
    down: () => {},
    buzz: () => this.sessionService.buzz(),
    return : () => {
      // DO NOT PUT ACTION HERE - THIS BUTTON MUST BE ACCEPT LONG CLICK - SEE this.gamepadService.buttonDown$.pipe in constructor
    }
  };


  logo : string = defaultLogo;
  field : Field | null = null;
  complex : Complex | null = null;

  session?: Session;
  timer?: Timer;
  date = interval(1000).pipe(map(() => new Date()))
  switchTimers = false;

  shouldTriggerNewPeriod: boolean = false;
  sessionStartTime = new Date();
  sessionStopTime = new Date();
  totalSessionTime = 0;

  videoPlaying = false;
  videoVolumeProgressiveEffectTime = 1500;
  videoVolume = videoVolumeStop;

  currHls : Hls | null = null;

  running = false;
  lastActiveSession?: Session;
  lastActiveTimer?: Timer;

  startVideo$ = new Subject<StartVideoOptions | void>();
  videoStop$ = new Subject<VideoType>();

  audioVolumeProgressiveEffectTime = 1500;
  audioVolume = audioVolumeHight;
  audioEnabled = false;
  audioDisabling : any = undefined;

  soundTransition : SoundTransitionPeriod | null = null;

  private currentPlayingVideo: VideoType = 'none';

  private _videoElementRef?: VideoElementRef;
  @ViewChild('video') set videoElementRef(videoElementRef: VideoElementRef) {
    this._videoElementRef = videoElementRef;
  }

  @HostBinding('@newPeriodTransition') get newPeriodTransition(): string {
    return this.shouldTriggerNewPeriod ? 'active' : 'inactive';
  }

  @HostListener('@newPeriodTransition.done')
  triggerAnimation() {
    this.shouldTriggerNewPeriod = false;
  }

  delayedActionInterval?: number;

  willStopSession = false;
  willStopSessionConfirmationDuration = 1;
  willStopSessionCountdown = 3;

  willStartSession = false;
  willStartSessionCountdown = 3;

  isManualSessionStartEnabled = false;
  isManualSessionWarmupEnabled = false;
  isManualSessionStopEnabled = false;
  pauseIsEnabled = false;

  private pressedButtons = new Map<Action, boolean>();

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private gamepadService: GamepadService,
    private configService: ConfigService,
    private dataService : DataService,
    private userService: UserService,
    private timerService: TimerService,
    private elementRef: ElementRef,
    private toastService: ToastService,
    ) {

    this.updateInterface();
    this.userService.user$.subscribe((u) => {
      this.updateInterface();
      this.logo = defaultLogo;
      this.field = u?.field;
      this.complex = u?.complex;
      if (this.field?.picture) {
        this.logo = this.field?.picture;
      } else if (this.complex?.logo) {
        this.logo = this.configService.staticUrl + '/images/complexes/logos/' + this.complex?.logo;
      }
    })

    this.gamepadService.buttonDown$.pipe(
      filter(action => action === 'return'),
      switchMap(action => {
        const a = timer(1000).pipe(takeUntil(this.gamepadService.buttonUp$.pipe(
          tap(() => {
            this.return();
          })
        )));
        return a;
      }),
      takeUntil(this.ngOnDestroy$)).subscribe(() => {
        if (this.running &&
          this.isManualSessionStopEnabled &&
          this.delayedActionInterval === undefined) {
          this.clearTimerButtonLockDown();
          this.willStopSession = true;
          this.delayedActionInterval = window.setInterval(() => {
            if (this.willStopSessionCountdown === 1) {
              this.willStopSession = false;
              this.stopSession();
              this.clearTimerButtonLockDown();
            }
            else this.willStopSessionCountdown -= 1;
          }, 1000);
        }
      })

    this.gamepadService.buttonDown$.pipe(bufferDebounce(100), takeUntil(this.ngOnDestroy$)).subscribe(actions => {
      actions.forEach(action => this.pressedButtons.set(action, true));

      // If NO session is running, this combination will start the session with a delay.
      if (!this.running &&
        this.isManualSessionStartEnabled  &&
        this.delayedActionInterval === undefined &&
        this.pressedButtons.get('goalTeam1') &&
        this.pressedButtons.get('goalTeam2')) {
        
        this.clearTimerButtonLockDown();
        this.willStartSession = true;
        this.delayedActionInterval = window.setInterval(() => {
          if (this.willStartSessionCountdown === 1) {
            this.willStartSession = false;
            this.startSession();
            this.clearTimerButtonLockDown();
          }
          else this.willStartSessionCountdown -= 1;
        }, 1000);
      }

      // Perform a single action.
      else { this.keyMapping[actions[0]]() }
    });

    this.gamepadService.buttonUp$.pipe(bufferDebounce(100), takeUntil(this.ngOnDestroy$)).subscribe(actions => {
      actions.forEach(action => this.pressedButtons.set(action, false));
      this.clearTimerButtonLockDown();
    });

    this.dataService.dataInit$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(init => {
      this.isManualSessionStartEnabled = init.launchSessionFromFrontend;
      this.isManualSessionWarmupEnabled = init.launchSessionFromFrontendWithWarmup;
      this.isManualSessionStopEnabled = init.stopSessionFromFrontend;
      this.pauseIsEnabled = init.pauseSessionFromFrontend;
      this.updateInterface(init.frontendInterface);
    });

    this.sessionService.buzz$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.playVideoPipeline(this._videoElementRef!.nativeElement, [
        () => this.playStaticMedia(this._videoElementRef!.nativeElement, '/assets/buzz.mp4', false)
      ])
    });

    this.sessionService.goal$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.playVideoPipeline(this._videoElementRef!.nativeElement, [
        () => this.playStaticMedia(this._videoElementRef!.nativeElement, '/assets/goal.mp4')
      ])
    });

    this.sessionService.replay$.pipe(takeUntil(this.ngOnDestroy$)).subscribe((replay) => {
      this.playVideoPipeline(this._videoElementRef!.nativeElement, this.session?.ambiance ? [
        () => this.playStaticMedia(this._videoElementRef!.nativeElement, '/assets/var.mp4'),
        () => this.playHLSStream(this._videoElementRef!.nativeElement, replay.path)
      ] : [
        () => this.playHLSStream(this._videoElementRef!.nativeElement, replay.path)
      ])
    });

    this.sessionService.limitReached$.pipe(takeUntil(this.ngOnDestroy$)).subscribe((data : SessionLimitReached) => {
      let toastOptions = {class : 'error big-center', delay : 5000};
      console.log("Limit reached  - " + data.type + " : " + data.limit);
      if (data.type == SessionLimitReachedType.BUZZ) {
        this.toastService.open('Vous avez atteint la limite de "Buzzs" autorisée pour une session...', toastOptions);
      } else if (data.type == SessionLimitReachedType.VAR) {
        this.toastService.open('Vous avez atteint la limite de "Var" autorisée pour une session...', toastOptions);
      } else if (data.type == SessionLimitReachedType.SESSION_TIME) {
        toastOptions.delay = 15000;
        this.toastService.open('Vous avez atteint la limite de temps autorisée pour une session...\nLa session va s\'arrêter ...', toastOptions);
      } else if (data.type == SessionLimitReachedType.GOAL) {
        this.toastService.open('Vous avez atteint la limite de "Buts" autorisée pour une session...', toastOptions);
      } else if (data.type == SessionLimitReachedType.GOAL_TEAM_1) {
        this.toastService.open('L\'équipe 1 a atteint la limite de "Buts" autorisée pour une session...', toastOptions);
      } else if (data.type == SessionLimitReachedType.GOAL_TEAM_2) {
        this.toastService.open('L\'équipe 2 a atteint la limite de "Buts" autorisée pour une session...', toastOptions);
      }
    });

    this.timerService.onUpdateTimer.pipe(takeUntil(this.ngOnDestroy$)).subscribe(timer => {
      if (this.session?.isPaused === true) {
        this.sessionStopTime = new Date(this.sessionStopTime.setSeconds(this.sessionStopTime.getSeconds() + 1));
      }
      this.timer = timer;
      if (this.audioDisabling)
        clearTimeout(this.audioDisabling);
      if (timer && !this.audioEnabled) {
        this.audioVolume = audioVolumeHight;
        this.audioEnabled = true;
      } else if (!timer && this.audioEnabled) {
        this.audioVolume = audioVolumeStop;
        this.audioDisabling = setTimeout(() => {
          this.audioEnabled = false;
        }, this.audioVolumeProgressiveEffectTime);
      }
    });

    this.timerService.onNewPeriod.pipe(takeUntil(this.ngOnDestroy$)).subscribe(timer => {
      if (this.timerService.isPlayingPeriod(timer?.currentPeriod)) {
        this.playSoundTransition(SoundTransitionPeriod.startPeriod);
      } else if (this.timerService.isTimeBreak(timer?.currentPeriod)) {
        this.playSoundTransition(SoundTransitionPeriod.break);
      }
      this.triggerNewPeriod();
    });

    this.timerService.onEnded.pipe(takeUntil(this.ngOnDestroy$)).subscribe(timer => {
      this.playSoundTransition(this.session?.ambiance ? SoundTransitionPeriod.endPeriodAmbiance : SoundTransitionPeriod.endPeriod)
    });


    this.sessionService.session$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(session => {
      if (this.running === false && session) {
        this.running = true;
        this.session = session;
        this.timerService.start();
        this.lastActiveSession = session;
        this.totalSessionTime = session.duration;
        this.sessionStartTime = new Date();
        this.sessionStopTime = new Date();
        this.sessionStopTime.setSeconds(this.sessionStopTime.getSeconds() + session.duration);
      }
      if (this.running === true && session) {
        this.session = session;
        this.lastActiveSession = session;
      }
      else if (this.running === true && !session) {
        this.session = this.lastActiveSession;
        this.running = false;
        this.timerService.stop();
      };
    });
  }

  ngAfterViewInit() {
    this._videoElementRef!.nativeElement.hidden = true;
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
    this.timerService.stop();
    window.clearInterval(this.delayedActionInterval);
  }

  clearTimerButtonLockDown() {
    if (this.delayedActionInterval) window.clearInterval(this.delayedActionInterval);
    this.willStartSession = false;
    this.willStartSessionCountdown = 3;
    this.willStopSession = false;
    this.willStopSessionCountdown = 3;
    this.delayedActionInterval = undefined;
  }

  async playVideoPipeline(element: HTMLMediaElement, pipeline: VideoPipe[]) {
    if (this.isVideoPlaying(element)) return;
    this.videoPlaying = true;
    element.hidden = false;
    for (const [index, pipe] of pipeline.entries()) {
      await pipe();
      const next = pipeline[index + 1];
      next ? next() : element.hidden = true;
    };
  }

  isVideoPlaying(element: HTMLMediaElement) {
    return element ? !!(element.currentTime > 0 && !element.paused && !element.ended && element.readyState > 2) : false;
  }

  private async playStaticMedia(element: HTMLMediaElement, url: string, onlyIfAmbiance : boolean = true): Promise<HTMLMediaElement> {
    if (onlyIfAmbiance && !this.session?.ambiance)
      return element;
    this.audioVolume = audioVolumeLow;
    if (this.session?.ambiance) {
      this.videoVolume = videoVolumeHight;
    }
    element.hidden = false;
    element.src = url;
    element.load();
    element.play();
    return new Promise<HTMLMediaElement>(resolve => {
      element.onended = () => {
        this.audioVolume = audioVolumeHight;
        this.videoVolume = videoVolumeStop;
        resolve(element);
        this.clearMediaElement(element);
      };
    });
  }

  private async playHLSStream(element: HTMLMediaElement, url: string): Promise<HTMLMediaElement> {
    return new Promise<HTMLMediaElement>(resolve => {
      if (Hls.isSupported()) {
        this.audioVolume = audioVolumeLow;
        this.destroyCurrentHls();
        var hls = new Hls();
        hls.attachMedia(element);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(`http://${this.configService.videoServiceEndpoint}${url}`);
          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            element.play();
            element.onended = () => {
              this.audioVolume = audioVolumeHight;
              resolve(element);
              this.destroyCurrentHls();
            };
          });
        });
        this.currHls = hls;
      }
    });
  }

  private clearMediaElement(element: HTMLMediaElement) {
    if (element) {
      element.src = "";
      element.load();
    }
  }

  private destroyCurrentHls() {
    if (this.currHls) {
      this.currHls.detachMedia();
      this.currHls.destroy();
      this.currHls = null;
    }
  }

  private stopVideo() {
    this.destroyCurrentHls();
    this._videoElementRef!.nativeElement.hidden = true;
    this._videoElementRef!.nativeElement.src = '';
    this._videoElementRef!.nativeElement.load();
    if (this.running) {
      this.videoVolume = videoVolumeStop;
      this.audioVolume = audioVolumeHight;
    }
  }

  triggerNewPeriod() {
    this.shouldTriggerNewPeriod = true;
  }

  getCurrentPeriodTitle() {
    let result = "";
    const period = this.timer?.currentPeriod;
    if (period != undefined) {
      if (this.timerService.isWarmup(period)) { // warmup
        result = "Échauffement";
      } else if (this.timerService.isTimeBreak(period)) { // pause
        result = "Mi-temps";
      } else if (this.timerService.isPlayingPeriod(period)) { // play
        const currentPlayingPeriod = this.timerService.getPlayingPeriodNumber(period);
        if(currentPlayingPeriod == 1) {
          result = "1re période"
        } else {
          result = currentPlayingPeriod + "e période";
        }
      }
    }
    return result;
  }

  return() {
    if (!this.isVideoPlaying(this._videoElementRef!.nativeElement)) {
      this.sessionService.undo()
    }
    this.stopVideo(); // security
  }

  stopSession() {
    this.sessionService.stopSession();
  }

  startSession() {
    console.log("Click start session");
    if (this.isManualSessionWarmupEnabled === true) this.sessionService.startSession();
    else this.sessionService.startSession({ warmup: 0 });
  }

  addGoal(team : 1 | 2) {
    if (!this.running)
      return;
    if (team == 1) {
      this.keyMapping.goalTeam1();
    } else {
      this.keyMapping.goalTeam2();
    }
  }

  showVar() {
    if (!this.running)
      return;
    this.keyMapping.var();
  }

  addBuzz() {
    if (!this.running)
      return;
    this.keyMapping.buzz();
  }

  setPause() {
    if (!this.running)
      return;
    this.keyMapping.up();
  }

  goStatus() {
    this.router.navigate(['/status']);
  }

  playSoundTransition(sound : SoundTransitionPeriod) {
    this.soundTransition = sound;
  }

  stopPlaySoundTransition() {
    this.soundTransition = null;
  }

  updateInterface(frontendInterface : FrontendInterface | null = null) {
    let el = this.elementRef.nativeElement;
    if (!el) return;
    if(!frontendInterface) frontendInterface = defaultInterface;
    frontendInterface = formatInterface(frontendInterface);
  
    this.switchTimers = frontendInterface.switchTimers;
    el.style.setProperty('--score-color', frontendInterface.scoreColor);
    el.style.setProperty('--team-color', frontendInterface.teamColor);
    el.style.setProperty('--primary-timer-color', frontendInterface.primaryTimerColor);
    el.style.setProperty('--secondary-timer-color', frontendInterface.secondaryTimerColor);
    el.style.setProperty('--secondary-color', frontendInterface.secondaryColor);
    el.style.setProperty('--period-color', frontendInterface.periodColor);
    el.style.setProperty('--field-color', frontendInterface.fieldColor);
    el.style.setProperty('--base-color', frontendInterface.baseColor);
    el.style.setProperty('--background-color', frontendInterface.backgroundColor);
    el.style.setProperty('--background-overlay-color', frontendInterface.backgroundOverlayColor);

    const defaultBackground = 'url(/assets/background.jpg)';
    if (frontendInterface.backgroundMode == FrontendInterfaceBackgroundMode.default) {
      el.style.setProperty('--background-image', defaultBackground);
    } else if (frontendInterface.backgroundMode == FrontendInterfaceBackgroundMode.color) {
      el.style.setProperty('--background-image', 'url(null)');
    } else if (frontendInterface.backgroundMode == FrontendInterfaceBackgroundMode.complex) {
      el.style.setProperty('--background-image', defaultBackground);
      if (this.complex?.image) {
        const url = this.configService.staticUrl + "/images/complexes/images/" + this.complex.image;
        el.style.setProperty('--background-image', 'url(' + url + ')');
      }
    } else if (frontendInterface.backgroundMode == FrontendInterfaceBackgroundMode.custom) {
      el.style.setProperty('--background-image', 'url(' + frontendInterface.backgroundCustom + ')');
    }
  }
}
