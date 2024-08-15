import {Component, ElementRef} from '@angular/core';
import * as AOS from 'aos';
import {ManagerMenuProvider} from 'src/app/manager/shared/services/menu.provider';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {CheckDevice} from 'src/app/shared/services/check-device.service';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent extends FBKComponent {
  isMobile:boolean

  constructor(
    private checkDevice: CheckDevice,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    public menu: ManagerMenuProvider,
  ) {
    super(_refElement, translate, 'HomePage');
  }

  fbkOnInit() {
    AOS.init();
    this.menu.hide();
    this.isMobile = this.checkDevice.isMobile();
  }
}
