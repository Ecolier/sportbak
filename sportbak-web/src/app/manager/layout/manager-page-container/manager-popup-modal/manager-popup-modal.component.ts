import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {ModalDataModel} from '../../../shared/models/modal-data.model';
import {Router} from '@angular/router';
import {SBKEventsProvider} from '../../../../shared/services/events.provider';
import {SBKEventsIds} from '../../../../shared/values/events-ids';

@Component({
  selector: 'manager-popup-modal',
  templateUrl: './manager-popup-modal.component.html',
  styleUrls: ['./manager-popup-modal.component.scss'],
})
export class ManagerPopupModalComponent extends FBKComponent {
  currentUrl: string;
  @Input() data: ModalDataModel;

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private router: Router,
    private eventsProvider: SBKEventsProvider,
  ) {
    super(_refElement, translate, 'ManagerPageContainerComponent');
    this.currentUrl = this.router.url.replace(new RegExp('\\?.*'), '');
    console.log(this.currentUrl);
  }

  fbkOnInit(): void {
  }

  fbkInputChanged() {
  }

  close(event: Event) {
    event.stopPropagation();
    this.onClose.emit();
  }

  fbkOnDestroy() {
  }

  gotoBooking($event: Event) {
    this.close($event);
    if (this.data.booking) {
      if (this.router.url.replace(new RegExp('\\?.*'), '') === '/manager/day') {
        this.eventsProvider.publish(SBKEventsIds.gotoBooking, this.data.booking);
        return;
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.navigate(['/manager/day'], {
        queryParams: {
          date: this.data.booking.startAt,
        },
        state: {
          booking: this.data.booking,
        },
      });
    }
  }
}
