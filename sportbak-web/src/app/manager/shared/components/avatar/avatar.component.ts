import {Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {FBKStaticUrls} from '../../../../shared/values/static-urls';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent extends FBKComponent {
  @Input() picture: string;
  @Input() size: number;

  @HostBinding('style') style: { width: string, height: string };

  pictureURL: string;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'AvatarComponent');
  }

  fbkOnInit(): void {
  }

  fbkInputChanged() {
    this.pictureURL = this.picture ? FBKStaticUrls.user.picture.base + this.picture : FBKStaticUrls.user.picture.guest;
    this.style = {width: this.size + 'px', height: this.size + 'px'};
  }
}
