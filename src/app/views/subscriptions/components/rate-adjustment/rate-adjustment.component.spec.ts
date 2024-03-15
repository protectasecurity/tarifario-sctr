import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateAdjustmentComponent } from './rate-adjustment.component';

describe('RateAdjustmentComponent', () => {
  let component: RateAdjustmentComponent;
  let fixture: ComponentFixture<RateAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
