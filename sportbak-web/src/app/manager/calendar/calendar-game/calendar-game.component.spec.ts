import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarGameComponent} from './calendar-game.component';


describe('CalendarGameComponent', () => {
  let component: CalendarGameComponent;
  let fixture: ComponentFixture<CalendarGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarGameComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
