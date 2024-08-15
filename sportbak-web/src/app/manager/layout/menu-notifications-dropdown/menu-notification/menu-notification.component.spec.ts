import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuNotificationComponent} from './menu-notification.component';

describe('MenuNotificationComponent', () => {
  let component: MenuNotificationComponent;
  let fixture: ComponentFixture<MenuNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuNotificationComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
