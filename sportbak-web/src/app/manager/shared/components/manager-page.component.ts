import {Directive, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Directive()
export abstract class ManagerPageComponent extends FBKComponent {
  hasCheckedSession: boolean = false;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerProvider) {
    super(_refElement, translate, 'ManagerPageComponent');
  }

  fbkOnInit() { }
}
