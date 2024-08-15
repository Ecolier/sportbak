import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeSocialComponent} from './home-social.component';


describe('HomeSocialComponent', () => {
  let component: HomeSocialComponent;
  let fixture: ComponentFixture<HomeSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeSocialComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
