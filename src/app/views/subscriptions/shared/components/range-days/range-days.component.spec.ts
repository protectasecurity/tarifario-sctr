import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeDaysComponent } from './range-days.component';

describe('RangeDaysComponent', () => {
  let component: RangeDaysComponent;
  let fixture: ComponentFixture<RangeDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
