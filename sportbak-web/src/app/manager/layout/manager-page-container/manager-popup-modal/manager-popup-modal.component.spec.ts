import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerPopupModalComponent} from './manager-popup-modal.component';

describe('ManagerModalComponent', () => {
  let component: ManagerPopupModalComponent;
  let fixture: ComponentFixture<ManagerPopupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerPopupModalComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
