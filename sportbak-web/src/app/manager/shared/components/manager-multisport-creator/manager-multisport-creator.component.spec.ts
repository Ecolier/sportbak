import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerMultisportCreatorComponent} from './manager-multisport-creator.component';


describe('ManagerMultisportCreatorComponent', () => {
  let component: ManagerMultisportCreatorComponent;
  let fixture: ComponentFixture<ManagerMultisportCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerMultisportCreatorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMultisportCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
