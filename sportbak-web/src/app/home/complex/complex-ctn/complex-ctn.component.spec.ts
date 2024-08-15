import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComplexCtnComponent} from './complex-ctn.component';


describe('ComplexCtnComponent', () => {
  let component: ComplexCtnComponent;
  let fixture: ComponentFixture<ComplexCtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplexCtnComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexCtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
