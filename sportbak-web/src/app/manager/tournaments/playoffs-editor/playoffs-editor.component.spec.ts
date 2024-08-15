import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PlayoffsEditorComponent} from './playoffs-editor.component';


describe('PlayoffsEditorComponent', () => {
  let component: PlayoffsEditorComponent;
  let fixture: ComponentFixture<PlayoffsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayoffsEditorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayoffsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
