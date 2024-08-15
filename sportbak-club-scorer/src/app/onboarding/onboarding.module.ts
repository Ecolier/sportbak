import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { OnboardingFieldFormComponent } from './field-form/onboarding-field-form.component';
import { OnboardingLoginFormComponent } from './login-form/onboarding-login-form.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    SharedModule,
    OnboardingRoutingModule,
  ],
  declarations: [
    OnboardingLoginFormComponent,
    OnboardingFieldFormComponent,
    WelcomeComponent,
  ],
  exports: [
    SharedModule,
  ]
})
export class OnboardingModule {}