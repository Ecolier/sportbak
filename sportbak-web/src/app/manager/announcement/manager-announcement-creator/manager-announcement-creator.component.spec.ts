import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerAnnouncementCreatorComponent} from './manager-announcement-creator.component';

describe('ManagerAnnouncementCreatorComponent', () => {
  let component: ManagerAnnouncementCreatorComponent;
  let fixture: ComponentFixture<ManagerAnnouncementCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerAnnouncementCreatorComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAnnouncementCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
