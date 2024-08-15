import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Field } from 'src/app/shared/models/field.model';
import { OnboardingService } from 'src/app/shared/services/onboarding.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'sbk-onboarding-field-form',
  templateUrl: './onboarding-field-form.component.html',
  styleUrls: ['./onboarding-field-form.component.scss']
})
export class OnboardingFieldFormComponent implements OnDestroy {

  ngOnDestroy$ = new Subject<void>();
  fields: Field[];
  selectedField?: Field;

  keybordListener : (event : KeyboardEvent) => void;


  constructor(
    private onboardingService: OnboardingService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router) {
    this.fields = this.activatedRoute.snapshot.data.fields;
    this.fields = this.fields.sort((a, b) => a.position - b.position);
    this.onboardingService.error.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.toastService.open('Une erreur est survenue ...\nContactez le support SportBak.', { class: 'error' });
    });
    this.onboardingService.success.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.router.navigate(['/onboarding/welcome']);
    });

    this.keybordListener = (event) => {
      if (event.key == 'Enter') {
        if (this.selectedField)
          this.submit()
      }
    };
    document.addEventListener('keydown', this.keybordListener);
  }

  selectField(field: Field) {
    this.selectedField = field;
    //localStorage.setItem('field', JSON.stringify(this.selectedField));
  }

  submit() {
    if (!this.selectedField) this.selectedField = this.fields[0];
    this.onboardingService.selectField(this.selectedField!.complex, this.selectedField!.id);
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.unsubscribe();
    if (this.keybordListener)
      document.removeEventListener('keydown', this.keybordListener);
  }
}