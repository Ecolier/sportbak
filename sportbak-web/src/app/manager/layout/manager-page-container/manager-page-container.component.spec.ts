import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerPageContainerComponent} from './manager-page-container.component';


describe('ManagerPageContainerComponent', () => {
  let component: ManagerPageContainerComponent;
  let fixture: ComponentFixture<ManagerPageContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerPageContainerComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
