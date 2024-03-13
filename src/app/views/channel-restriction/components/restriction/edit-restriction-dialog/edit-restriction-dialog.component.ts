import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef } from '@angular/material';

@Component({
	selector: 'channel-restriction-edit-restriction-dialog',
	templateUrl: './edit-restriction-dialog.component.html',
	styleUrls: ['./edit-restriction-dialog.component.scss']
})
export class EditRestrictionDialogComponent implements OnInit {
	title: string = '';
	endDate: Date = null;
	initialDate: Date = null;
	minDate: Date = new Date();
	validForm: boolean = false;
	disableInitialDate: boolean = false;

	constructor(public dialogRef: MatDialogRef<EditRestrictionDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.title = `${this.data.item.use.description} - ${this.data.item.clazz.description}`;
		this.initialDate = new Date(this.data.item.initialDate);
		this.endDate = new Date(this.data.item.endDate);
		if (this.initialDate <= this.minDate) {
			this.disableInitialDate = true;
		}
	}

	editInitialDate(event: MatDatepickerInputEvent<Date>) {
		this.isValid();
		if (this.validForm) {
			this.initialDate = event.value;
		}
	}

	editFinalDate(event: MatDatepickerInputEvent<Date>) {
		this.isValid();
		if (this.validForm) {
			this.endDate = event.value;
		}
	}

	isValid() {
		if (this.initialDate != null
			&& this.endDate != null) {
			this.validForm = true;
		} else {
			this.validForm = false;
		}
	}

	editConstraint() {
		if (this.validForm) {
			this.data.item.initialDate = this.initialDate;
			this.data.item.endDate = this.endDate;
			this.dialogRef.close(this.data.item);
		}
	}
}
