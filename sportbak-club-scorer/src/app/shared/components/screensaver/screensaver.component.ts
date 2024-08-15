import { Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { ScreensaverService } from '../../services/screensaver.service';

const stepCount = 1;

@Component({
    selector: 'sbk-screensaver',
    templateUrl: './screensaver.component.html',
    styleUrls: ['./screensaver.component.scss']
})
export class ScreensaverComponent implements OnDestroy {
    @ViewChild('anim', { static: false }) public divAnimation!: ElementRef;

    @Input() randomNextStep : boolean = true;
    step : number = 0;
    timeoutStep : number | null = null;
    timeoutAnimation : number | null = null;
    manualStartSessionEnabled : boolean = false;
    ngOnDestroy$ = new Subject<void>();

    _visible : boolean = false;
    get visible() : boolean { return this._visible};
    set visible(v : boolean) { 
        this._visible = v;
        this.updateCSSVariable('--visible', v ? 'visible' : 'hidden');
    }


    constructor(
        private elementRef: ElementRef,
        private screensaverService : ScreensaverService,
        private dataService : DataService
    ) {
        this.dataService.dataInit$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(init => {
            this.manualStartSessionEnabled = init.launchSessionFromFrontend;
        });
        this.hide();
        this.screensaverService.hide$.subscribe(() => {
            this.hide();
        })
        this.screensaverService.show$.subscribe(() => {
            this.show();
        })
    }

    ngOnInit() {
    }

    private updateCSSVariable(key : string, value : string, el = this.elementRef?.nativeElement) : boolean {
        let success = false;
        if (el) {
            try {
                el.style.setProperty(key, value);
                success = true;
            } catch(err) {};
        }
        return success;
    }

    hide() {
        this.visible = false;
        this.clean();
    }

    show() {
        if (!this.visible) {
            this.visible = true;
            this.clean();
            this.nextStep();
            this.animate(0,0);
        }
    }

    private clean() {
        this.step = 0;
        if (this.timeoutStep)
            clearTimeout(this.timeoutStep!);
        if (this.timeoutAnimation) 
            clearInterval(this.timeoutAnimation);
    }

    private run() {
        if (this.step == 0) {
            this.updateCSSVariable('--background-color', 'black');
            //this.nextStep(1000);
        }    
    }

    private nextStep(timeout : number = 0) {
        let actionNext = () => {
            if (this.randomNextStep) {
                this.step = Math.floor(Math.random() * stepCount);
            } else {
                this.step ++;
            }
            if (this.step >= stepCount)
                this.step = 0;
            this.run();
        }

        if (this.timeoutStep)
            clearTimeout(this.timeoutStep!);
        if (timeout > 0) {
            this.timeoutStep = window.setTimeout(() => {
                actionNext();
            }, timeout);
        } else {
            actionNext();
        }
    }
    
    animate(fromX : number, fromY : number) {
        let parent = this.elementRef.nativeElement as HTMLElement;
        let el = this.divAnimation?.nativeElement as HTMLElement;
        if (!parent || !el) 
            return;
        const speed = 100; 
        let border = Math.floor(Math.random() * 4);
        let xMax = parent.clientWidth - el.clientWidth - 50;
        let yMax = parent.clientHeight - el.clientHeight - 50;
        let x = Math.floor(Math.random() * xMax);
        let y = Math.floor(Math.random() * yMax);

        // translate
        el.style.left = x + 'px';
        el.style.top = y + 'px';

        this.timeoutAnimation = window.setTimeout(() => {
            this.animate(x, y);
        }, 5000);


        // Animation css lag
        /*if( border == 0) {
            x = 0;
        } else if( border == 1) {
            y = 0;
        } else if( border == 2) {
            x = xMax;
        } else if( border == 3) {
            y = yMax;
        }
        let distance = Math.sqrt((fromX - x)*(fromX - x) + (fromY - y)*(fromY - y));
        let time = 1000 * distance / speed;
        el.animate([
            // keyframes
            { top: fromY + 'px', left : fromX + 'px'},
            { top: y + 'px', left : x + 'px'}
          ], {
            // timing options
            duration: time
        });
        this.timeoutAnimation = window.setTimeout(() => {
            this.animate(x, y);
        }, time);*/
    }

    setPosition(x : number, y : number) {

    }

    ngOnDestroy() {
        this.clean();
        this.ngOnDestroy$.next();
        this.ngOnDestroy$.unsubscribe();
    }
}