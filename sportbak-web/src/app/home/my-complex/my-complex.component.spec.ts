import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MyComplexComponent} from './my-complex.component';


describe('ComplexComponent', () => {
  let component: MyComplexComponent;
  let fixture: ComponentFixture<MyComplexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyComplexComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
