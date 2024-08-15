import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GsFoulsComponent} from './gs-fouls.component';


describe('GsFoulsComponent', () => {
  let component: GsFoulsComponent;
  let fixture: ComponentFixture<GsFoulsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GsFoulsComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsFoulsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
