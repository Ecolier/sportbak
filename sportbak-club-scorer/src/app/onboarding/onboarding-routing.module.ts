import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldResolver } from './auth-guard.service';
import { OnboardingFieldFormComponent } from './field-form/onboarding-field-form.component';
import { OnboardingLoginFormComponent } from './login-form/onboarding-login-form.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: OnboardingLoginFormComponent, data: { animation: 'OnboardingLoginForm' }},
  { path: 'field', component: OnboardingFieldFormComponent, data: { animation: 'OnboardingFieldForm' }, resolve: { fields: FieldResolver } },
  { path: 'welcome', component: WelcomeComponent, data: { animation: 'Welcome' }}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}