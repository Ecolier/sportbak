import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentPlayoffsComponent} from './manager-tournament-playoffs.component';


describe('ManagerTournamentPlayoffsComponent', () => {
  let component: ManagerTournamentPlayoffsComponent;
  let fixture: ComponentFixture<ManagerTournamentPlayoffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentPlayoffsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentPlayoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
