import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerProvider, ManagerTokenService} from '../shared/services/manager.service';
import {SSEProvider} from '../shared/services/sse.provider';
import {SBKEventsProvider} from '../../shared/services/events.provider';
import {ApplicationErrorsIds, showError} from '../shared/helpers/manager-errors.helper';

@Component({
  selector: 'get-home',
  templateUrl: './get-home.component.html',
  styleUrls: ['./get-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GetHomeComponent extends FBKComponent {
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerProvider: ManagerProvider,
    private router: Router,
    private sse: SSEProvider,
    private eventProvider: SBKEventsProvider,
    private route: ActivatedRoute,
    private tokenService: ManagerTokenService,
  ) {
    super(_refElement, translate, 'ManagerPageComponent');
  }

  fbkOnInit() {
    this.managerProvider.getHome().subscribe({
      next: (response) => {
        this.managerProvider.initData(response);
        this.sse.connect();
        this.router.navigate(
            [this.route.snapshot.queryParams.redirection],
            {queryParams: JSON.parse(this.route.snapshot.queryParams.params)},
        ).catch(() => this.router.navigate(['/manager/space']));
      }, error: (error) => {
        showError(error, ApplicationErrorsIds.error_with_server);
        this.tokenService.clear();
        this.managerProvider.hasLoaded = false;
        this.router.navigate(['/manager-login']);
      },
    });
  }
}
