import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerAlertComponent} from './manager-alert.component';


describe('ManagerAlertComponent', () => {
  let component: ManagerAlertComponent;
  let fixture: ComponentFixture<ManagerAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerAlertComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
