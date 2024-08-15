import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {ManagerTokenService} from '../../manager/shared/services/manager.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: ManagerTokenService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.tokenService.getToken()) {
      let headers = req.headers.set('Authorization', 'Bearer ' + this.tokenService.getToken());
      if (this.tokenService.adminMode()) {
        headers = headers.set('sportbak-user', this.tokenService.getUserId());
      }
      const clonedReq = req.clone({
        headers: headers,
      });
      return next.handle(clonedReq);
    } else {
      return next.handle(req);
    }
    /* .pipe(
        catchError((error, caught) => {
          return this.errorHandler(error, caught);
        })
      );*/
  }

   errorHandler(error, caught) {
    if (error.status === 460) {
      this.router.navigate(['/manager'], {queryParams: {forced_login: 'true'}});
    }
    return throwError(() => new Error(error));
  }
}
