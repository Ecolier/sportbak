import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerTextareaComponent} from './manager-textarea.component';

describe('ManagerTextareaComponent', () => {
  let component: ManagerTextareaComponent;
  let fixture: ComponentFixture<ManagerTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerTextareaComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
