import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormatInputComponent} from './format-input.component';


describe('FormatInputComponent', () => {
  let component: FormatInputComponent;
  let fixture: ComponentFixture<FormatInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormatInputComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
