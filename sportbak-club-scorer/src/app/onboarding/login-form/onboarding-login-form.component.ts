import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { OnboardingService } from 'src/app/shared/services/onboarding.service';

@Component({
  selector: 'sbk-onboarding-login-form',
  templateUrl: './onboarding-login-form.component.html',
  styleUrls: ['./onboarding-login-form.component.scss']
})
export class OnboardingLoginFormComponent implements OnDestroy {

  ngOnDestroy$ = new Subject<void>();
  loginLoading = false;
  username = sessionStorage.getItem('username') ?? '';
  password = sessionStorage.getItem('password') ?? '';

  keybordListener : (event : KeyboardEvent) => void;

  constructor(
    private onboardingService: OnboardingService,
    private toastService: ToastService,
    private router: Router) {
    this.onboardingService.error.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.toastService.open('Connexion impossible, veuillez vérifier vos identifiants.', { class: 'error' });
      this.loginLoading = false;
    });

    
    this.keybordListener = (event) => {
      if (event.key == 'Enter') {
        if (!this.loginLoading)
          this.login()
      } else if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        let usernameHtmlElement = document.getElementById("username");
        let passwordHtmlElement = document.getElementById("password");
        if (document.activeElement == usernameHtmlElement) {
          passwordHtmlElement?.focus();
        } else {
          usernameHtmlElement?.focus();
        }
      } 
    };
    document.addEventListener('keydown', this.keybordListener);
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
    if (this.keybordListener)
      document.removeEventListener('keydown', this.keybordListener);
  }

  login() {
    this.loginLoading = true;
    this.onboardingService.credentials = { username: this.username, password: this.password }
    this.onboardingService.login(this.username, this.password);
    this.router.navigate(['/onboarding/field']);
  }
}
