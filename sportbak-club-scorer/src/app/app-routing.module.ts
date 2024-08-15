import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateScorer } from './scorer/scorer.guard';

const routes: Routes =  [
  { path: '', redirectTo: 'scorer', pathMatch: 'full' },
  { path: 'scorer', loadChildren: () => import('src/app/scorer/scorer.module').then(m => m.ScorerModule), data: { animation: 'Scorer' }, canActivate: [CanActivateScorer]},
  { path: 'onboarding', loadChildren: () => import('src/app/onboarding/onboarding.module').then(m => m.OnboardingModule) },
  { path: 'status', loadChildren: () => import('src/app/status/status.module').then(m => m.StatusModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
