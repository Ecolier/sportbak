import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from './data.service';
import { GamepadService } from './gamepad.service';
import { SocketService } from './socket.service';
import { TimerService } from './timer.service';

const seconde = 1000;
const minute = 60 * seconde;

const defaultDelayScreensaver = 5 * minute;

@Injectable({
  providedIn: 'root'
})
export class ScreensaverService {
    _enabled : boolean = true;
    get enabled() : boolean {return this._enabled}
    set enabled(v : boolean) {
        if (v) {
            if (!this.enabled) {
                this.clean(true);
            }
        }
        else {
            this.clean(true, false);
        }
        this._enabled = v;
    }

    _delay : number = defaultDelayScreensaver;
    get delay() : number {return this._delay}
    set delay(v : number) {
        if (!this.showing)
            this.clean();
        this._delay = v;
    }

    timeout : number| null = null;
    showing : boolean = false;

    private _show$ = new Subject<void>();
    get show$() {
        return this._show$.asObservable();
    }

    private _hide$ = new Subject<void>();
    get hide$() {
        return this._hide$.asObservable();
    }

  
    constructor(
        private socketService: SocketService,
        private gamepadService: GamepadService,
        private timerService : TimerService,
        private dataService : DataService) {
        
        this.dataService.dataInit$.subscribe(data => {
            const screensaver = data?.screensaver;
            if (screensaver) {
                if (screensaver.enabled !== undefined) 
                    this.enabled = screensaver.enabled;
                if (screensaver.timeout !== undefined)
                    this.delay = screensaver.timeout * 1000; // convert to ms
            }
            console.log("SCREENSAVER - config received - enabled : " + this.enabled + " - delay : " + this.delay)
        });

        this.clean(true);

        document.addEventListener('mousemove',(e) => {
            this.clean();
        })
        document.addEventListener('mousedown',(e) => {
            this.clean();
        })
        document.addEventListener('keydown',(e) => {
            this.clean();
        });

        this.socketService.message$.subscribe(() => {
            this.clean();
        });

        this.gamepadService.buttonDown$.subscribe(() => {
            this.clean();
        })
    }

    private clean(force = false, restart = true) {
        //console.log("SCREENSAVER - clean ...");
        if (this.timeout)
            clearTimeout(this.timeout!);
        if (restart)
            this.restartTimeout();
        if (!force && !this.showing)
            return;
        this.showing = false;
        this._hide$.next();
    }

    
    private restartTimeout() {
        this.timeout = window.setTimeout(() => {
            if (!this.timerService.running()) {
                this.run();
            } else {
                //console.log("SCREENSAVER - Don't show because game is running ...");
                this.clean();
            }
        }, this.delay)
    }

    private run() {
        if (!this.enabled) 
            return;
        if (this.showing)
            return;
        this.showing = true;
        console.log("SCREENSAVER - show ...");
        this._show$.next();
    }  
}