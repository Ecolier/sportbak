import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerDualChoiceComponent} from './manager-dual-choice.component';


describe('ManagerDualChoiceComponent', () => {
  let component: ManagerDualChoiceComponent;
  let fixture: ComponentFixture<ManagerDualChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerDualChoiceComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDualChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
