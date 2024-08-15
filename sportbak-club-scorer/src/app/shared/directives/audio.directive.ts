import {Directive, ElementRef, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

const msStepChangingVolume = 50;

@Directive({
  selector: 'audio, video',
  host: {}
})
export class AudioDirective implements OnInit, OnDestroy  {
    @Input() volume = 1;
    @Input() progressiveOnChangeVolume = true;
    @Input() progressiveVolumeTime = 1500;

    private audioIntervalVolumeOnChange : any = undefined;
    private lastVolumeValue = 0;

    constructor(
        protected _refElement: ElementRef,
    ) {
        this._refElement.nativeElement.volume = this.lastVolumeValue;
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes)
            return;
        if (changes['volume']) {
            if (changes['volume'].currentValue != changes['volume'].previousValue)
                this.setVolume();
        }
        
    }

    clearProgressiveChangingVolume() {
        if(this.audioIntervalVolumeOnChange) {
            clearInterval(this.audioIntervalVolumeOnChange);
        }
    }


    setVolume() {
        //console.log("Seting volume from " + this.lastVolumeValue + " to " + this.volume);
        this.clearProgressiveChangingVolume();
        let currentStep = 0;
        let step = Math.floor(this.progressiveVolumeTime / msStepChangingVolume);
        let lastVolume = this.lastVolumeValue;
        let newVolume = this.volume;
        this.lastVolumeValue = this.volume;
        this.audioIntervalVolumeOnChange = setInterval(() => {
            currentStep++;
            let currentVolume = (newVolume - lastVolume) * (currentStep / step) + lastVolume;
            //console.log("Set volume : " + currentVolume);
            this._refElement.nativeElement.volume = currentVolume;
            if (currentStep >= step) {
                this._refElement.nativeElement.volume = newVolume;
                this.clearProgressiveChangingVolume();
            }
        }, msStepChangingVolume); 
    }

    ngOnDestroy() {
        this.clearProgressiveChangingVolume();
    }
}
