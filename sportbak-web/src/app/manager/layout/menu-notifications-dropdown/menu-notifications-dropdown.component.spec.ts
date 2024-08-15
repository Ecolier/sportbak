import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuNotificationsDropdownComponent} from './menu-notifications-dropdown.component';

describe('MenuNotificationsDropdownComponent', () => {
  let component: MenuNotificationsDropdownComponent;
  let fixture: ComponentFixture<MenuNotificationsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuNotificationsDropdownComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNotificationsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
