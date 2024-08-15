import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsFutbuzzComponent} from './gs-futbuzz.component';


describe('GsFutbuzzComponent', () => {
  let component: GsFutbuzzComponent;
  let fixture: ComponentFixture<GsFutbuzzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsFutbuzzComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsFutbuzzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
