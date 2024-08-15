import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {GameModel} from 'src/app/shared/models/league/game.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {Block30Min} from '../day-fields/block-30-min';

@Component({
  selector: 'block-thirty-min',
  templateUrl: './block-thirty-min.component.html',
  styleUrls: ['./block-thirty-min.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlockThirtyMinComponent extends FBKComponent {
  isHovered = false;
  bookerPicture: string;
  divId: string;
  @Input() block: Block30Min;
  @Input() hourMark: boolean;
  @Input() name: string;
  @Input() contact: string;
  @Input() borderRight = false;
  @Input() time: string;
  @Input() displayStatus: string;
  @Input() competition: any;
  @Input() selectedGame: GameModel;
  @Input() isMobile = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Calendar');
  }

  fbkOnInit() {
    this.divId = this?.block.booking?._id + (this.isMobile ? 'mobile' : '');
  }

  fbkInputChanged() {
    this.getPicture();
  }

  onMouseEnter() {
    if (!this.selectedGame) {
      this.isHovered = true;
    }
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  getPicture() {
    if (this.block.booking && typeof this.block.booking.booker !== 'string') {
      this.bookerPicture = this.block.booking.booker.picture;
    } else {
      this.bookerPicture = undefined;
    }
  }
}
