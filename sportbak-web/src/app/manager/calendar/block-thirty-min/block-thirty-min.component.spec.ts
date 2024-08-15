import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BlockThirtyMinComponent} from './block-thirty-min.component';


describe('BlockThirtyMinComponent', () => {
  let component: BlockThirtyMinComponent;
  let fixture: ComponentFixture<BlockThirtyMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockThirtyMinComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockThirtyMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
