import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerInputComponent} from './manager-input.component';


describe('ManagerInputComponent', () => {
  let component: ManagerInputComponent;
  let fixture: ComponentFixture<ManagerInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerInputComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
