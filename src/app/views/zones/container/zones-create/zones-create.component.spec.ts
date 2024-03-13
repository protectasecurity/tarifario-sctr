import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesCreateComponent } from './zones-create.component';

describe('ZonesCreateComponent', () => {
  let component: ZonesCreateComponent;
  let fixture: ComponentFixture<ZonesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
