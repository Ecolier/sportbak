import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerContactComponent} from './manager-contact.component';


describe('ManagerContactComponent', () => {
  let component: ManagerContactComponent;
  let fixture: ComponentFixture<ManagerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerContactComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
