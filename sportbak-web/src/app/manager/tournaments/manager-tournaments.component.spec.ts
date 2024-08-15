import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerTournamentsComponent} from './manager-tournaments.component';


describe('ManagerTournamentsComponent', () => {
  let component: ManagerTournamentsComponent;
  let fixture: ComponentFixture<ManagerTournamentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerTournamentsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
