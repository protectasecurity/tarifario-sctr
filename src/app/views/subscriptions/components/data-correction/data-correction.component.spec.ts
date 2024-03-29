import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCorrectionComponent } from './data-correction.component';

describe('DataCorrectionComponent', () => {
  let component: DataCorrectionComponent;
  let fixture: ComponentFixture<DataCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
