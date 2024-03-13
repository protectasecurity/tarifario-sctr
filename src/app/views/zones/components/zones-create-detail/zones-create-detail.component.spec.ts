import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesCreateDetailComponent } from './zones-create-detail.component';

describe('ZonesCreateDetailComponent', () => {
  let component: ZonesCreateDetailComponent;
  let fixture: ComponentFixture<ZonesCreateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesCreateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesCreateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
