import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerAnnouncementWidgetComponent} from './manager-announcement-widget.component';


describe('ManagerNotificationWidgetComponent', () => {
  let component: ManagerAnnouncementWidgetComponent;
  let fixture: ComponentFixture<ManagerAnnouncementWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerAnnouncementWidgetComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAnnouncementWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
