import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarDayComponent} from './calendar-day.component';

describe('CalendarDayComponent', () => {
  let component: CalendarDayComponent;
  let fixture: ComponentFixture<CalendarDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarDayComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
