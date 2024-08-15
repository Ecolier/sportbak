import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerAnnouncementComponent} from './manager-announcement.component';


describe('ManagerNotificationsComponent', () => {
  let component: ManagerAnnouncementComponent;
  let fixture: ComponentFixture<ManagerAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerAnnouncementComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
