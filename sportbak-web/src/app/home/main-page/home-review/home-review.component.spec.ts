import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeReviewComponent} from './home-review.component';


describe('HomeReviewComponent', () => {
  let component: HomeReviewComponent;
  let fixture: ComponentFixture<HomeReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeReviewComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
