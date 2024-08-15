import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PoolGamesComponent} from './pool-games.component';

describe('PoolGamesComponent', () => {
  let component: PoolGamesComponent;
  let fixture: ComponentFixture<PoolGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoolGamesComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
