import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarTournamentComponent} from './calendar-tournament.component';


describe('CalendarTournamentComponent', () => {
  let component: CalendarTournamentComponent;
  let fixture: ComponentFixture<CalendarTournamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarTournamentComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
