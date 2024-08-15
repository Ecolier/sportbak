import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DayFieldsComponent} from './day-fields.component';


describe('DayFieldsComponent', () => {
  let component: DayFieldsComponent;
  let fixture: ComponentFixture<DayFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayFieldsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
