import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComplexVideoComponent} from './complex-video.component';


describe('ComplexVideoComponent', () => {
  let component: ComplexVideoComponent;
  let fixture: ComponentFixture<ComplexVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplexVideoComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
