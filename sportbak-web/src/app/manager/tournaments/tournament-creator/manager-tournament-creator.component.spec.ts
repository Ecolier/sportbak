import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentCreatorComponent} from './manager-tournament-creator.component';


describe('ManagerTournamentCreatorComponent', () => {
  let component: ManagerTournamentCreatorComponent;
  let fixture: ComponentFixture<ManagerTournamentCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentCreatorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
