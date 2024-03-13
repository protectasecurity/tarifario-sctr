import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskGroupDetailComponent } from './risk-group-detail.component';

describe('RiskGroupDetailComponent', () => {
	let component: RiskGroupDetailComponent;
	let fixture: ComponentFixture<RiskGroupDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RiskGroupDetailComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskGroupDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
