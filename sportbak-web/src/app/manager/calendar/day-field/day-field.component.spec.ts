import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DayFieldComponent} from './day-field.component';


describe('DayFieldComponent', () => {
  let component: DayFieldComponent;
  let fixture: ComponentFixture<DayFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayFieldComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
