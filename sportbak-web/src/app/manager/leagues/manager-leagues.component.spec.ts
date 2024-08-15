import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerLeaguesComponent} from './manager-leagues.component';


describe('ManagerLeaguesComponent', () => {
  let component: ManagerLeaguesComponent;
  let fixture: ComponentFixture<ManagerLeaguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerLeaguesComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerLeaguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
