import { animate, animateChild, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Event, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NGXLogger, NgxLoggerLevel, NGXLoggerMonitor, NGXLogInterface } from 'ngx-logger';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { WebRTCError } from './shared/components/webRTCPlayer/webRTCPlayer.component';
import { bufferDebounce } from './shared/operators/buffer-debounce';
import { ConfigService } from './shared/services/config.service';
import { Action, GamepadService } from './shared/services/gamepad.service';
import { OnboardingService } from './shared/services/onboarding.service';
import { ConnectionStatus, SocketService } from './shared/services/socket.service';

class LoggerMonitor extends NGXLoggerMonitor {
  constructor(private socketService: SocketService) {
    super();
  }
  onLog(logObject: NGXLogInterface): void {
    const logLevels = {
      0: 'TRACE',
      1: 'DEBUG',
      2: 'INFO',
      3: 'LOG',
      4: 'WARN',
      5: 'ERROR',
      6: 'FATAL',
      7: 'OFF',
    };
    this.socketService.send('log', `${logObject.timestamp} ${logLevels[logObject.level]} [${logObject.fileName}] ${logObject.message}`);
  }
}

export const slideInAnimation =
trigger('routerTransition', [
  transition('OnboardingLoginForm => OnboardingFieldForm', [
    query(':leave', style({ transform: 'translateX(0)', opacity: 1 })),
    query(':enter', style({ position: 'absolute', left: '100%', width: '100%', opacity: 0 })),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ left: 0, opacity: 1 }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
  transition('OnboardingFieldForm => OnboardingLoginForm', [
    query(':leave', style({ transform: 'translateX(0)', opacity: 1 })),
    query(':enter', style({ position: 'absolute', right: '100%', width: '100%', opacity: 0 })),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ right: 0, opacity: 1 }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
  transition('OnboardingFieldForm => Welcome', [
    query(':leave', style({ opacity: 1 })),
    query(':enter', style({ position: 'absolute', top: '100%', width: '100%', opacity: 0 })),
    query(':leave', animateChild()),
    sequence([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
      animate('500ms'),
      query(':enter', [
        animate('300ms ease-out', style({ top: 0, opacity: 1 }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Welcome => Scorer', [
    query(':leave', style({ opacity: 1 })),
    query(':enter', style({ position: 'absolute', top: '100%', width: '100%', opacity: 0 })),
    query(':leave', animateChild()),
    sequence([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
      animate('500ms'),
      query(':enter', [
        animate('300ms ease-out', style({ top: 0, opacity: 1 }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
]);

@Component({
  selector: 'sbk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent {
  
  ngOnDestroy$ = new Subject<void>();
  backendConnectionStatus$ = new BehaviorSubject<ConnectionStatus>('close');
  layout: 'initializing' | 'onboarding' | 'scorer' | 'none' = 'onboarding';

  gamepadButtonBuffer = new Map<Action, boolean>();
  navigateToStatusInterval?: number;

  
  private _isLiveFeedbackVisible = false;
  get isLiveFeedbackVisible() {
    return this._isLiveFeedbackVisible;
  }
  webRTCToken : string | null= null;
  
  constructor(
    private router: Router,
    private gamepadService: GamepadService,
    private onboardingService: OnboardingService,
    private socketService: SocketService,
    private loggerService: NGXLogger,
    private http: HttpClient,
    public configService : ConfigService) {
    this.loggerService.registerMonitor(new LoggerMonitor(this.socketService));
    this.socketService.status.pipe(takeUntil(this.ngOnDestroy$)).subscribe(this.backendConnectionStatus$)
    this.onboardingService.needsOnboarding.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => this.router.navigate(['/onboarding']));
    document.addEventListener('keydown', event => {
      if (event.key.toLocaleLowerCase() == 'x') {
        //this.goStatus();
      }
    });
    this.gamepadService.buttonDown$.pipe(bufferDebounce(100), takeUntil(this.ngOnDestroy$)).subscribe(actions => {
      actions.forEach(action => this.gamepadButtonBuffer.set(action, true));
      if (this.gamepadButtonBuffer.get('down') && 
          this.gamepadButtonBuffer.get('up')) {
            if (this.layout == 'onboarding') {
              this.goStatus();
            } else {
              this.navigateToStatusInterval = window.setTimeout(() => {
                this.goStatus();
              }, 2000);
            }
      }
      if (this.gamepadButtonBuffer.get('goalTeam1') && 
          this.gamepadButtonBuffer.get('goalTeam2')) {
            if (this.layout == 'onboarding') {
              this.showStreaming();
            }
      }

      if (this.gamepadButtonBuffer.get('return')) {
        if (this.isLiveFeedbackVisible) {
          this.stopStreaming();
        }
      }
    });
    this.gamepadService.buttonUp$.pipe(bufferDebounce(100), takeUntil(this.ngOnDestroy$)).subscribe(actions => {
      actions.forEach(action => this.gamepadButtonBuffer.set(action, false));
      if (this.navigateToStatusInterval) window.clearTimeout(this.navigateToStatusInterval);
    });
    this.configService.videoServiceHost = window.location.hostname;
    router.events.pipe(
      filter((e: Event): e is NavigationStart => e instanceof NavigationStart))
      .subscribe(routerEvent => {
        if (routerEvent.url === '/') this.layout = 'initializing';
        else if (routerEvent.url.search(`^/onboarding`) !== -1) this.layout = 'onboarding';
        else if (routerEvent.url.search(`^/scorer`) !== -1) this.layout = 'scorer';
        else this.layout = 'none';

        
      });

    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const paramUrl = parameters.get('_url');
    if (paramUrl) {
      this.configService.videoServiceHost = paramUrl;
    }
  }
    
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  
  showStreaming() {
    console.log("Show streaming ...");
    // get token
    this.http.get('http://' + this.configService.videoServiceEndpoint + '/webrtc/scorerfrontend/token').subscribe((data : any) => {
      if (data) {
        this.webRTCToken = data.token;
        this._isLiveFeedbackVisible = true;
      }
    }, error => {});
  }
  
  stopStreaming() {
    this._isLiveFeedbackVisible = false;
  }

  webRTCError(error : WebRTCError) {
    console.log("WebRTC error : " + error.message);
    this._isLiveFeedbackVisible = false;
  }

  goStatus() {
    this.router.navigate(['/status']);
  }
}
