import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentPlayoffsGameComponent} from './manager-tournament-playoffs-game.component';


describe('ManagerTournamentPlayoffsGameComponent', () => {
  let component: ManagerTournamentPlayoffsGameComponent;
  let fixture: ComponentFixture<ManagerTournamentPlayoffsGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentPlayoffsGameComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentPlayoffsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
