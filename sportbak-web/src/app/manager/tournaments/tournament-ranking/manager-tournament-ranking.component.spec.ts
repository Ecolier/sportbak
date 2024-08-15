import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentRankingComponent} from './manager-tournament-ranking.component';


describe('ManagerRankingComponent', () => {
  let component: ManagerTournamentRankingComponent;
  let fixture: ComponentFixture<ManagerTournamentRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentRankingComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
