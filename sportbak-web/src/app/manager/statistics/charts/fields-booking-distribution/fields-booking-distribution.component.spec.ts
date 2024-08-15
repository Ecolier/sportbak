import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FieldsBookingDistributionComponent} from './fields-booking-distribution.component';


describe('ReservationRepartitionComponent', () => {
  let component: FieldsBookingDistributionComponent;
  let fixture: ComponentFixture<FieldsBookingDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FieldsBookingDistributionComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsBookingDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
