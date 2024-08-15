import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PoolEditorComponent} from './pool-editor.component';


describe('PoolEditorComponent', () => {
  let component: PoolEditorComponent;
  let fixture: ComponentFixture<PoolEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoolEditorComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
