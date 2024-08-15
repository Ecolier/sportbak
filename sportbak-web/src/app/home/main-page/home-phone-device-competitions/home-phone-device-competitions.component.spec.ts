import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HomePhoneDeviceCompetitionsComponent} from './home-phone-device-competitions.component';


describe('HomePhoneDeviceCompetitionsComponent', () => {
  let component: HomePhoneDeviceCompetitionsComponent;
  let fixture: ComponentFixture<HomePhoneDeviceCompetitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePhoneDeviceCompetitionsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePhoneDeviceCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
