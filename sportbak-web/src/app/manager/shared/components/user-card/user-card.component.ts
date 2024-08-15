import {Component, ElementRef, Input} from '@angular/core';
import {FBKComponent} from '../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../shared/services/translate/translate.service';
import {UserModel} from '../../../../shared/models/user/user.model';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent extends FBKComponent {
  @Input() user: UserModel;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'UserCardComponent');
  }

  fbkOnInit(): void {
  }

  getPicture() {
    return this.user.picture ? 'https://api.futbak.com/static/images/users/' + this.user.picture : 'https://api.futbak.com/static/images/users/logoGuestFull.png';
  }
}
