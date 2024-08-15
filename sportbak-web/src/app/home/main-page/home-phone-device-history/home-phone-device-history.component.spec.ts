import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HomePhoneDeviceHistoryComponent} from './home-phone-device-history.component';


describe('HomePhoneDeviceHistoryComponent', () => {
  let component: HomePhoneDeviceHistoryComponent;
  let fixture: ComponentFixture<HomePhoneDeviceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePhoneDeviceHistoryComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePhoneDeviceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
