import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComplexLeagueComponent} from './complex-league.component';


describe('ComplexLeagueComponent', () => {
  let component: ComplexLeagueComponent;
  let fixture: ComponentFixture<ComplexLeagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplexLeagueComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
