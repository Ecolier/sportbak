import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentDetailsComponent} from './manager-tournament-details.component';


describe('ManagerTournamentDetailsComponent', () => {
  let component: ManagerTournamentDetailsComponent;
  let fixture: ComponentFixture<ManagerTournamentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentDetailsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
