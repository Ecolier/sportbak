import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsScoreEditorComponent} from './gs-score-editor.component';


describe('GsScoreEditorComponent', () => {
  let component: GsScoreEditorComponent;
  let fixture: ComponentFixture<GsScoreEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsScoreEditorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsScoreEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
