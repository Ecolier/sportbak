import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTeamAdderComponent} from './manager-team-adder.component';


describe('ManagerTeamAdderComponent', () => {
  let component: ManagerTeamAdderComponent;
  let fixture: ComponentFixture<ManagerTeamAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTeamAdderComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTeamAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
