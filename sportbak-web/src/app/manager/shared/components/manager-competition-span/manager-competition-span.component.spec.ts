import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerCompetitionSpanComponent} from './manager-competition-span.component';


describe('ManagerCompetitionSpanComponent', () => {
  let component: ManagerCompetitionSpanComponent;
  let fixture: ComponentFixture<ManagerCompetitionSpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerCompetitionSpanComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCompetitionSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
