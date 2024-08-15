import {Component, ElementRef} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {FBKRequestProvider} from 'src/app/shared/services/requests/requests.service';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
@Component({
  selector: 'home-contact-us',
  templateUrl: './home-contact-us.component.html',
  styleUrls: ['./home-contact-us.component.scss'],
})
export class HomeContactUsComponent extends FBKComponent {
  name: string ;
  message: string ;
  subject: string ;
  email: string ;
  messageSuccess: boolean ;
  messageResponse: any ;
  errorName: boolean;
  errorEmail: boolean;
  errorMessage: boolean;
  constructor(
    private requestProvider: FBKRequestProvider,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'HomePageComponent');
  }

  fbkOnInit() {}

  sendMessage() {
    this.messageResponse = [];

    this.errorMessage = false;
    this.errorEmail = false;
    this.errorName = false;
    if (!this.name || !this.email || !this.message || this.email.indexOf('@') < 0) {
      this.messageSuccess = false;
      if (!this.name) {
        this.messageResponse.push(this.getTranslation('error_name'));
        this.errorName = true;
      }
      if (!this.email || this.email.indexOf('@') < 0) {
        this.messageResponse.push(this.getTranslation('error_mail'));
        this.errorEmail = true;
      }
      if (!this.message) {
        this.messageResponse.push(this.getTranslation('error_message'));
        this.errorMessage = true;
      }
    } else {
      let messageData;
      this.requestProvider.contactMessage({
        name: this.name,
        email: this.email,
        subject: 'Nouveau message - Website',
        message: this.message,
      }).subscribe((data) => {
        messageData = data;
        this.messageSuccess = messageData.success;
        if (this.messageSuccess == true) {
          this.messageResponse.push(this.getTranslation('success_message'));
          this.messageSuccess = true;
          this.message= '';
          this.name= '';
          this.email= '';
        } else {
          this.messageResponse = [this.getTranslation('error_send_message')];
        }
      });
    }
  }
}
