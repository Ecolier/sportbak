import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DayPickerComponent} from './day-picker.component';


describe('DayPickerComponent', () => {
  let component: DayPickerComponent;
  let fixture: ComponentFixture<DayPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayPickerComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
