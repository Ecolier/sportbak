import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {GameModel} from '../../models/league/game.model';
import {TranslateAppProvider} from '../../services/translate/translate.service';
import {FBKComponent} from '../base.component';

@Component({
  selector: 'game-date',
  templateUrl: 'game-date.component.html',
  styleUrls: ['game-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameDateComponent extends FBKComponent {
  public date: string;
  isDateSet: boolean;
  @Input() public game: GameModel;
  @Input() public fontSize: number;
  constructor(protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
  ) {
    super(_refElement, translate, 'GameDateComponent');
  }

  fbkOnInit() {
    this.initDate();
  }

  fbkInputChanged?(inputName: string, currentValue: any, lastValue: any) {
    this.initDate();
  }

  getHourFromDate(date) {
    const lang = this.translateProvider.getLanguage();
    let result: string = date.toLocaleTimeString(lang);
    const index = result.lastIndexOf(':');
    result = result.substring(0, index) + result.substring(index + 3);
    return result;
  }

  initDate() {
    if (this.game.booking && this.game.booking.startAt) {
      this.initVariables(this.game.booking.startAt, this.game.booking.endAt);
    } else if (this.game && this.game.startedAt) {
      this.initVariables(this.game.startedAt, this.game.endedAt);
    } else {
      this.date = this.getTranslation('no_date');
      this.isDateSet = false;
    }
  }

  initVariables(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    let end = endDate ? new Date(endDate) : null;
    const lang = this.translateProvider.getLanguage();
    this.date = start.toLocaleDateString(lang, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    if (end) {
      end = new Date(end);
      this.date += ' - ' + this.getHourFromDate(start) + ' ' + this.getTranslation('to') + ' ' + this.getHourFromDate(end);
    } else {
      this.date += ' ' + this.getTranslation('to') + ' ' + this.getHourFromDate(start);
    }
    this.date = this.date.charAt(0).toUpperCase() + this.date.substring(1);
    this.isDateSet = true;
  }
}
