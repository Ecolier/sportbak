import {Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'manager-alert',
  templateUrl: './manager-alert.component.html',
  styleUrls: ['./manager-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerAlertComponent extends FBKComponent {
  @Input() successMsg: string;
  @Input() failureMsg: string;
  @Input() hasFailed: boolean = false;
  @Input() nbOfFails: number = 0;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ManagerAlertComponent');
  }

  fbkOnInit() {}
}
