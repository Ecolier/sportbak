import {Component, ElementRef, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {createImage, isFileAnImage, sortShirts} from './shirt-selector.helper';
import {ApplicationErrorsIds, showError} from '../../helpers/manager-errors.helper';
import {FBKStaticUrls} from '../../../../shared/values/static-urls';

@Component({
  selector: 'shirt-selector',
  templateUrl: './shirt-selector.component.html',
  styleUrls: ['./shirt-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShirtSelectorComponent extends FBKComponent {
  shirtsBaseUrl: string = FBKStaticUrls.shirt.base;
  defaultShirts: string[] = [];
  customShirts: string[] = [];
  @Output() setTeamShirt = new EventEmitter();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  unknownShirt = FBKStaticUrls.shirt.baseAndUnknown;
  loaded = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
  ) {
    super(_refElement, translate, 'ShirtSelectorComponent');
  }

  fbkOnInit() {
    this.managerProvider.getShirts().subscribe({
      next: (response) => {
        const {defaultShirts, customShirts} = sortShirts(response);
        this.defaultShirts = defaultShirts;
        this.customShirts = customShirts;
        this.loaded = true;
      },
      error: (error) => showError(error, ApplicationErrorsIds.shirts.unable_to_get_shirts),
    });
  }

  addShirt(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (!isFileAnImage(file)) {
        showError('format forbidden', ApplicationErrorsIds.format_forbidden);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        createImage(e.target.result.toString()).then((img) => this.sendShirt(img));
      };
      reader.readAsDataURL(file);
    }
  }

  private sendShirt(dataUrl: string) {
    this.managerProvider.sendShirt(dataUrl).subscribe({
      next: (response) => {
        console.log(response);
        this.reloadCustomShirts();
      },
      error: (error) => {
        showError(error, ApplicationErrorsIds.shirts.unable_to_send_shirt);
      },
    });
  }

  private reloadCustomShirts() {
    this.customShirts = [];
    this.managerProvider.getShirts().subscribe({
      next: (response) => {
        for (const shirt of response) {
          if (!shirt.match('default/')) {
            this.customShirts.push(shirt);
          }
        }
      },
      error: (error) => {
        showError(error, ApplicationErrorsIds.shirts.unable_to_get_shirts);
      },
    });
  }

  deleteShirt(shirt: string) {
    this.managerProvider.deleteShirt(shirt).subscribe({
      next: (value) => {
        this.reloadCustomShirts();
      },
      error: (err) => {
        showError(err, ApplicationErrorsIds.shirts.unable_to_delete_shirt);
      },
    });
  }
}
