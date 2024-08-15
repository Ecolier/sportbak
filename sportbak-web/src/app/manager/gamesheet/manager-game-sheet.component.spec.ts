import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ManagerGameSheetComponent} from './manager-game-sheet.component';


describe('ManagerGameSheetComponent', () => {
  let component: ManagerGameSheetComponent;
  let fixture: ComponentFixture<ManagerGameSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerGameSheetComponent],
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGameSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
