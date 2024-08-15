import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionSettingsPresetsComponent } from './session-settings-presets.component';

describe('SessionSettingsPresetsComponent', () => {
  let component: SessionSettingsPresetsComponent;
  let fixture: ComponentFixture<SessionSettingsPresetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionSettingsPresetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionSettingsPresetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
