import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Params, Router, RouterStateSnapshot} from '@angular/router';
import {ManagerProvider, ManagerTokenService} from '../manager/shared/services/manager.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateManager implements CanActivate {
  constructor(
    private managerProvider: ManagerProvider,
    private tokenService: ManagerTokenService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loginUrl = '/manager-login';
    const getHomeUrl = '/manager/get-home';
    const passwordChangeUrl = '/manager/password-change';
    const params = this.filterQueryParams(route.queryParams);

    this.emulateUserFromAdmin(route, state);

    if (!this.tokenService.getToken()) {
      this.router.navigate([loginUrl]);
      return false;
    } else if (!this.managerProvider.ready()) {
      if (!state.url.startsWith(getHomeUrl)) {
        const queryParams = {redirection: state.url.replace(new RegExp(/\?.*/), ''), params: JSON.stringify(params)};
        this.router.navigate([getHomeUrl], {queryParams});
        return false;
      }
    } else {
      if (!this.tokenService.isAdminMode() && this.managerProvider.newPasswordIsNeeded() && !state.url.startsWith(passwordChangeUrl)) {
        this.router.navigate([passwordChangeUrl], {queryParams: {options: 'necessary'}});
        return false;
      }
    }
    return true;
  }

  emulateUserFromAdmin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    const params = route.queryParamMap;
    let result = false;
    if (params) {
      const token = params.get('tokenAdmin');
      const emulateUserId = params.get('emulateUserId');
      if (params.get('fromAdmin') == 'true' && token && emulateUserId) {
        this.tokenService.clear();
        this.tokenService.setAdminMode(token, 'superadmin', emulateUserId);
        result = true;
      }
    }
    return result;
  }

  filterQueryParams(params : Params) : any {
    const keys = ['fromAdmin', 'tokenAdmin', 'emulateUserId'];
    let result = params ? {... params} : {};
    for (let key of keys) {
      delete result[key];
    }
    return result;
  }
}
