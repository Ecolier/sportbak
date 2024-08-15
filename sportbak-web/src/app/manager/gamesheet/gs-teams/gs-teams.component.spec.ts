import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsTeamsComponent} from './gs-teams.component';


describe('GsTeamsComponent', () => {
  let component: GsTeamsComponent;
  let fixture: ComponentFixture<GsTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsTeamsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
