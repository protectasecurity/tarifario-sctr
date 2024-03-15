import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelimitationComponent } from './delimitation.component';

describe('DelimitationComponent', () => {
  let component: DelimitationComponent;
  let fixture: ComponentFixture<DelimitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelimitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
