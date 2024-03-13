import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Class } from '../../../../../shared/models/class.model';
import { Use } from '../../../../../shared/models/use.model';
import { Channel } from '../../../../manage-channel/models/Channels';
import { Restriction } from '../../../models/Restriction';
import * as fromAction from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';
import { ChannelAgent } from '../../../models/ChannelAgent';

@Component({
	selector: 'channel-restriction-create-restriction-dialog',
	templateUrl: './create-restriction-dialog.component.html',
	styleUrls: ['./create-restriction-dialog.component.scss']
})
export class CreateRestrictionDialogComponent implements OnInit {
	endDate: Date = null;
	active: boolean = true;
	useSelected: Use = null;
	initialDate: Date = null;
	minDate: Date = new Date();
	disableForm: boolean = true;
	selectedChannel: ChannelAgent;
	classesSelected: Class[] = [];
	restrictions: Restriction[] = [];
	selectedChannel$: Observable<ChannelAgent> = this.store.select(fromReducer.getSelectedChannel);

	constructor(
		private store: Store<fromReducer.ChannelRestrictionState>,
		public dialogRef: MatDialogRef<CreateRestrictionDialogComponent>
	) { }

	ngOnInit() {
		this.selectedChannel$.subscribe(channel => this.selectedChannel = channel);
	}

	changeMode(e) {
		this.active = !this.active;
	}

	addRestriction() {
		this.generateRestriction();
		this.dialogRef.close(this.restrictions);
	}

	onClassesSelected(classes: Class[]) {
		this.classesSelected = classes;
		this.isValid();
	}

	onUseSelected(use: Use) {
		this.useSelected = use;
		this.isValid();
	}

	generateRestriction() {
		this.restrictions = [];
		this.classesSelected.forEach(classes => {
			this.restrictions.push(Restriction.CreateInstance(this.useSelected, classes, this.initialDate,
				this.endDate, (this.active) ? 'ACTIVE' : 'INACTIVE', this.selectedChannel));
		});
	}

	addInitialDate(event: MatDatepickerInputEvent<Date>) {
		this.initialDate = event.value;
		this.isValid();
	}

	addEndDate(event: MatDatepickerInputEvent<Date>) {
		this.endDate = event.value;
		this.isValid();
	}

	isValid() {
		if (this.useSelected != null
			&& this.classesSelected.length > 0
			&& this.initialDate != null
			&& this.endDate != null
			&& this.initialDate < this.endDate) {
			this.disableForm = false;
		} else {
			this.disableForm = true;
		}
	}
}
