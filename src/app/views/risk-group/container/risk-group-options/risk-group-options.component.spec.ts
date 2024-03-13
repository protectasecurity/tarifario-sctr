import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskGroupOptionsComponent } from './risk-group-options.component';

describe('RiskGroupOptionsComponent', () => {
  let component: RiskGroupOptionsComponent;
  let fixture: ComponentFixture<RiskGroupOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskGroupOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskGroupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
