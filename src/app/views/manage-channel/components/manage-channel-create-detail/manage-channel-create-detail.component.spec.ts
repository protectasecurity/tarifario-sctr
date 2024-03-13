import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChannelCreateDetailComponent } from './manage-channel-create-detail.component';

describe('ManageChannelCreateDetailComponent', () => {
	let component: ManageChannelCreateDetailComponent;
	let fixture: ComponentFixture<ManageChannelCreateDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ManageChannelCreateDetailComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageChannelCreateDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
