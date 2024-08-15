import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerNotificationPopupComponent} from './manager-notification-popup.component';

describe('ManagerNotificationPopupComponent', () => {
  let component: ManagerNotificationPopupComponent;
  let fixture: ComponentFixture<ManagerNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerNotificationPopupComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
