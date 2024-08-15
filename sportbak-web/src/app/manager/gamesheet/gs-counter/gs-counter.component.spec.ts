import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsCounterComponent} from './gs-counter.component';


describe('GsCounterComponent', () => {
  let component: GsCounterComponent;
  let fixture: ComponentFixture<GsCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsCounterComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
