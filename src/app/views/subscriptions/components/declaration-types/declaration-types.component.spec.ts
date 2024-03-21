import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationTypesComponent } from './declaration-types.component';

describe('DeclarationTypesComponent', () => {
  let component: DeclarationTypesComponent;
  let fixture: ComponentFixture<DeclarationTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarationTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
