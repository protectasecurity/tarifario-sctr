import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivationRulesComponent } from './derivation-rules.component';

describe('DerivationRulesComponent', () => {
  let component: DerivationRulesComponent;
  let fixture: ComponentFixture<DerivationRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DerivationRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
