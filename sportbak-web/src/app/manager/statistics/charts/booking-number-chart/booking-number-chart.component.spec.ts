import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BookingNumberChartComponent} from './booking-number-chart.component';


describe('NbReservationChartComponent', () => {
  let component: BookingNumberChartComponent;
  let fixture: ComponentFixture<BookingNumberChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingNumberChartComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingNumberChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
