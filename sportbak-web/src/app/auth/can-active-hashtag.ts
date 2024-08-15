import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ManagerProvider, ManagerTokenService} from '../manager/shared/services/manager.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateHashtag implements CanActivate {
  constructor(
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.fragment) {
      let fragment = route.fragment.trim();
      if (fragment.startsWith('/')) {
        fragment = fragment.replace('/', '');
        this.router.navigate([route.fragment]);
        return false;
      }
    }
    return true;
  }
}
