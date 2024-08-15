import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarUpcomingBookingComponent} from './calendar-upcoming-booking.component';


describe('CalendarUpcomingBookingComponent', () => {
  let component: CalendarUpcomingBookingComponent;
  let fixture: ComponentFixture<CalendarUpcomingBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarUpcomingBookingComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarUpcomingBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
