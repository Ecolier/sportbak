import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ShirtSelectorComponent} from './shirt-selector.component';


describe('ShirtSelectorComponent', () => {
  let component: ShirtSelectorComponent;
  let fixture: ComponentFixture<ShirtSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShirtSelectorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShirtSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
