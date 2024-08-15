import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ScoreSelectorComponent} from './score-selector.component';


describe('ScoreSelectorComponent', () => {
  let component: ScoreSelectorComponent;
  let fixture: ComponentFixture<ScoreSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreSelectorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
