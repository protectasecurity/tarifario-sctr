import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UseClassDetailComponent } from "./use-class-detail.component";

describe('UseClassDetailComponent', () => {
  let component: UseClassDetailComponent;
  let fixture: ComponentFixture<UseClassDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseClassDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseClassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
