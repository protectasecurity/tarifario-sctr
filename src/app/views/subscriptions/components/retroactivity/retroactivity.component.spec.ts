import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetroactivityComponent } from './retroactivity.component';

describe('RetroactivityComponent', () => {
  let component: RetroactivityComponent;
  let fixture: ComponentFixture<RetroactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetroactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetroactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
