import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BookingDecisionMakerComponent} from './booking-decision-maker.component';


describe('BookingDecisionMakerComponent', () => {
  let component: BookingDecisionMakerComponent;
  let fixture: ComponentFixture<BookingDecisionMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingDecisionMakerComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDecisionMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
