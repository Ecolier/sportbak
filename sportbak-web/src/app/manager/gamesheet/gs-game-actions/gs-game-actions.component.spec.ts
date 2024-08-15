import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsGameActionsComponent} from './gs-game-actions.component';


describe('GsGameActionsComponent', () => {
  let component: GsGameActionsComponent;
  let fixture: ComponentFixture<GsGameActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsGameActionsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsGameActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
