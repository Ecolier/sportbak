import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {ComplexModel} from 'src/app/shared/models/complex/complex.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../layout/manager-menu/manager-menu.service';
import {ManagerData} from '../shared/models/manager-data.model';

@Component({
  selector: 'manager-contact',
  templateUrl: './manager-contact.component.html',
  styleUrls: ['./manager-contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerContactComponent extends FBKComponent {
  complex: ComplexModel;
  subject: string = '';
  message: string = '';
  hasSubmitted: boolean = false;
  hasSuccedeedSending: boolean;
  hasFailedSending: boolean;
  failureCounts: number = 0;
  isLoading: boolean = false;
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private activatedRoute: ActivatedRoute,
    protected managerMenuService: ManagerMenuService,
    private _router: Router,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
    this.managerMenuService.setActiveMenuItemKey('contact');
  }

  fbkOnInit() {
    this.complex = this.managerProvider.getComplex();
  }

  setSubject(newValue) {
    this.subject = newValue;
  }

  setMessage(newValue) {
    this.message = newValue;
  }

  resetInputs() {
    this.subject = '';
    this.message = '';
  }
  submitMessage() {
    this.isLoading = true;
    this.managerProvider.sendContactMessage({
      subject: this.subject,
      message: this.message,
    }).subscribe((response) => {
      this.isLoading = false;
      this.hasSubmitted = true;
      this.hasSuccedeedSending = true;
      this.resetInputs();
    }, (error) => {
      this.isLoading = false;
      this.hasSubmitted = true;
      this.hasFailedSending = true;
      this.failureCounts++;
      this.resetInputs();
    });
  }
}
