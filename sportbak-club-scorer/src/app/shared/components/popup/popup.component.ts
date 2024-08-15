import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StatusService } from '../../../status/status.service';
import { bufferDebounce } from '../../operators/buffer-debounce';
import { Action, GamepadService } from '../../services/gamepad.service';

export type CloseType = 'close-backdrop' | 'green-button' | 'red-button' | 'blue-button' | 'white-button';

@Component({
  selector: 'sbk-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnDestroy {
  @Input() title : string | undefined = undefined;
  @Input() message : string | undefined = undefined;
  @Input() buttonGreen : string | undefined = undefined;
  @Input() buttonRed : string | undefined = undefined;
  @Input() buttonBlue : string | undefined = undefined;
  @Input() buttonWhite : string | undefined = undefined;
  @Input() backdropDismiss : boolean = true;

  private pressedButtons = new Map<Action, boolean>();

  private subscriptions : Subscription[] = [];

  @Output() onClose = new EventEmitter<CloseType>();

  constructor(private gamepadService : GamepadService) {
      let sub = null;
      sub = this.gamepadService.buttonDown$.pipe(bufferDebounce(100)).subscribe(actions => {
        actions.forEach(action => this.pressedButtons.set(action, true));
        if (this.pressedButtons.get('return')) {
            this.clickRedButton();
        } else if (this.pressedButtons.get('goalTeam1') ||
            this.pressedButtons.get('goalTeam2')) {
            this.clickGreenButton();
        }  else if (this.pressedButtons.get('up') ||
            this.pressedButtons.get('down')) {
            this.clickBlueButton();
        }  else if (this.pressedButtons.get('buzz') ||
            this.pressedButtons.get('var')) {
            this.clickWhiteButton();
        }
      });
      this.subscriptions.push(sub);
  
      sub = this.gamepadService.buttonUp$.pipe(bufferDebounce(100)).subscribe(actions => {
        actions.forEach(action => this.pressedButtons.set(action, false));
      });
      this.subscriptions.push(sub);
  }

  clickOutside(event? : Event) {
      if (this.backdropDismiss)
        this.onClose.emit('close-backdrop');
    event?.stopPropagation();
  }

  clickInside(event? : Event) {
    event?.stopPropagation();
  }

  clickGreenButton(event? : Event) {
    event?.stopPropagation();
    this.onClose.emit('green-button');
  }

  clickRedButton(event? : Event) {
    event?.stopPropagation();
    this.onClose.emit('red-button');
  }

  clickBlueButton(event? : Event) {
    event?.stopPropagation();
    this.onClose.emit('blue-button');
  }

  clickWhiteButton(event? : Event) {
    event?.stopPropagation();
    this.onClose.emit('white-button');
  }

  ngOnDestroy() {
      for (let sub of this.subscriptions) {
          sub.unsubscribe();
      }
  }
}