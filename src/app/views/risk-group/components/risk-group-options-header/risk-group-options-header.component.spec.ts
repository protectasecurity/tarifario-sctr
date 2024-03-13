import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskGroupOptionsHeaderComponent } from './risk-group-options-header.component';

describe('RiskGroupOptionsHeaderComponent', () => {
  let component: RiskGroupOptionsHeaderComponent;
  let fixture: ComponentFixture<RiskGroupOptionsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskGroupOptionsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskGroupOptionsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
