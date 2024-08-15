import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LeagueEditorComponent} from './league-editor.component';


describe('LeagueEditorComponent', () => {
  let component: LeagueEditorComponent;
  let fixture: ComponentFixture<LeagueEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueEditorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
