import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerNotificationsWidgetComponent} from './manager-notifications-widget.component';

describe('ManagerNotificationsWidgetComponent', () => {
  let component: ManagerNotificationsWidgetComponent;
  let fixture: ComponentFixture<ManagerNotificationsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerNotificationsWidgetComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerNotificationsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
