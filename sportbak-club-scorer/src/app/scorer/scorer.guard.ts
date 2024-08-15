import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { race } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { OnboardingService } from '../shared/services/onboarding.service';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateScorer implements CanActivate {

  constructor(
    private onboardingService: OnboardingService,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router) {}

  canActivate() {
    return this.userService.user$.pipe(mapTo(true));
  }
}