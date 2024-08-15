import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerMultisportChoiceComponent} from './manager-multisport-choice.component';


describe('ManagerMultisportChoiceComponent', () => {
  let component: ManagerMultisportChoiceComponent;
  let fixture: ComponentFixture<ManagerMultisportChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerMultisportChoiceComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMultisportChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
