import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DaysBookingDistributionComponent} from './days-booking-distribution.component';


describe('DaysReservationRepartitionComponent', () => {
  let component: DaysBookingDistributionComponent;
  let fixture: ComponentFixture<DaysBookingDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DaysBookingDistributionComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysBookingDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
