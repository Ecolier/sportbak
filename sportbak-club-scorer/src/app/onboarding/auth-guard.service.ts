import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Field } from '../shared/models/field.model';
import { OnboardingService } from '../shared/services/onboarding.service';

@Injectable({
  providedIn: 'root'
})
export class FieldResolver implements Resolve<Field[]> {
  
  constructor(private onboardingService: OnboardingService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<Field[]> {
    return this.onboardingService.fields.pipe(
      take(1)
    );
  }
}