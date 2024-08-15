import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsPreviousActionComponent} from './gs-previous-action.component';


describe('GsPreviousActionComponent', () => {
  let component: GsPreviousActionComponent;
  let fixture: ComponentFixture<GsPreviousActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsPreviousActionComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsPreviousActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
