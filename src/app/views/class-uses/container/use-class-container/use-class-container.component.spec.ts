import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UseClassContainerComponent } from "./use-class-container.component";

describe('UseClassContainerComponent', () => {
  let component: UseClassContainerComponent;
  let fixture: ComponentFixture<UseClassContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseClassContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseClassContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
