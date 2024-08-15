import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsActionStackComponent} from './gs-action-stack.component';


describe('GsActionStackComponent', () => {
  let component: GsActionStackComponent;
  let fixture: ComponentFixture<GsActionStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsActionStackComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsActionStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
