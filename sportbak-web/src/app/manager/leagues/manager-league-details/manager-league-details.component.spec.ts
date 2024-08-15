import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerLeagueDetailsComponent} from './manager-league-details.component';


describe('ManagerLeagueDetailsComponent', () => {
  let component: ManagerLeagueDetailsComponent;
  let fixture: ComponentFixture<ManagerLeagueDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLeagueDetailsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerLeagueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
