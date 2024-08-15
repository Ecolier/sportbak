import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerErrorPopupComponent} from './manager-error-popup.component';

describe('ManagerErrorPopupComponent', () => {
  let component: ManagerErrorPopupComponent;
  let fixture: ComponentFixture<ManagerErrorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerErrorPopupComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
