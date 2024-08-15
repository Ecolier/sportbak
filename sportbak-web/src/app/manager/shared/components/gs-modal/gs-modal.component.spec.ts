import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsModalComponent} from './gs-modal.component';


describe('GsModalComponent', () => {
  let component: GsModalComponent;
  let fixture: ComponentFixture<GsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsModalComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
