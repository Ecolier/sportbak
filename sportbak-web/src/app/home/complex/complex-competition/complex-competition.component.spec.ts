import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComplexCompetitionComponent} from './complex-competition.component';


describe('ComplexCompetitionComponent', () => {
  let component: ComplexCompetitionComponent;
  let fixture: ComponentFixture<ComplexCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplexCompetitionComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
