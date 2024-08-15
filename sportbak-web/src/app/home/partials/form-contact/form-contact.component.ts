import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent extends FBKComponent {
  subject = '';
  mail: string;
  messageSuccess: boolean;
  messageResponse: any;
  errorMessage:boolean;
  constructor(
    private requestProvider: FBKRequestProvider,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() { }

  sendContact() {
    this.messageResponse = '';
    this.errorMessage = false;

    if (!this.mail || this.mail.indexOf('@') < 0) {
      this.messageSuccess = true;
      this.messageResponse = this.getTranslation('error_mail');
      this.errorMessage = true;
      setTimeout(() => {
        this.messageSuccess = false;
      }, 3000);
    } else {
      let messageData;
      this.requestProvider.contactMessage({
        email: this.mail,
        subject: this.subject,
      }).subscribe((data) => {
        this.messageSuccess = messageData.success;
        if (this.messageSuccess == true) {
          this.messageSuccess = true;
          this.messageResponse = this.getTranslation('success_contact');
          setTimeout(() => {
            this.messageSuccess = false;
          }, 3000);
          this.mail = '';
        } else {
          this.messageSuccess = true;
          this.messageResponse = this.getTranslation('error_send_message');
          setTimeout(() => {
            this.messageSuccess = false;
          }, 3000);
        }
      });
    }
  }
}
