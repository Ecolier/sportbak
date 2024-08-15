import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../shared/components/base.component';

const ANIMATED_TEXT_CLASS = 'animated-text';
const SHORT_TIMESTAMP = 20;
const LONG_TIMESTAMP = 60;

@Component({
  selector: 'gs-futbuzz',
  templateUrl: './gs-futbuzz.component.html',
  styleUrls: ['./gs-futbuzz.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GsFutbuzzComponent extends FBKComponent {
  counter: number = 0;
  numberOfClicks: number = 0;
  recordedTime: number = 0;
  animatedTextClass: string = '';
  @Input() game: GameModel;
  @Output() onClick = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'GsFutbuzzComponent');
  }

  fbkOnInit() {}

  onBuzzerClick() {
    this.animatedTextClass = '';
    this.numberOfClicks = this.numberOfClicks + 1;
    if (this.numberOfClicks >= 3) {
      this.numberOfClicks = 0;
      this.recordedTime = LONG_TIMESTAMP;
      this.animatedTextClass = ANIMATED_TEXT_CLASS;
      this.counter = this.counter + 1;
      this.addTimeStamp(LONG_TIMESTAMP);
    }
    setTimeout(() => {
      if (this.numberOfClicks === 1) {
        this.counter = this.counter + 1;
        this.numberOfClicks = 0;
        this.recordedTime = SHORT_TIMESTAMP;
        this.animatedTextClass = ANIMATED_TEXT_CLASS;
        this.addTimeStamp(SHORT_TIMESTAMP);
      } else {
        this.numberOfClicks = 0;
      }
    }, 500);
  }

  addTimeStamp(timeStampDuration : number) {
    this.game.saveTimeStamp(timeStampDuration);
  }
}
