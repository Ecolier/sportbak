import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarLeagueComponent} from './calendar-league.component';


describe('CalendarLeagueComponent', () => {
  let component: CalendarLeagueComponent;
  let fixture: ComponentFixture<CalendarLeagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarLeagueComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
