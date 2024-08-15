import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerLeagueCreatorComponent} from './manager-league-creator.component';


describe('ManagerLeagueCreatorComponent', () => {
  let component: ManagerLeagueCreatorComponent;
  let fixture: ComponentFixture<ManagerLeagueCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLeagueCreatorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerLeagueCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
