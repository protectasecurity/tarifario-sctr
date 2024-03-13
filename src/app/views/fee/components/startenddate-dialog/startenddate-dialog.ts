import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Moment } from "moment";
import * as moment from 'moment';

@Component({
	selector: 'app-startenddate-dialog',
	templateUrl: './startenddate-dialog.html',
	styleUrls: ['./startenddate-dialog.scss']
})
export class StartEndDateDialogComponent {
	minDate = null; // = moment();
	maxDate = null;

	effectDate = null;
	endDate = null;

	feeStart: string = '';
	feeEnd: string = '';


	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<StartEndDateDialogComponent>) {
		this.effectDate = data.start;
		// this.minDate = data.feeStart; // data.start ? data.start : moment();
		this.endDate = data.end;
		this.feeStart = data.feeStart;
		this.feeEnd = data.feeEnd;
		// this.maxDate = data.feeEnd ? (data.feeEnd as Moment).format('YYYY-MM-DD') : null;

		this.minDate = data.feeStart ? moment(data.feeStart, "DD/MM/YYYY") : null;
		this.maxDate = data.feeEnd ? moment(data.feeEnd, "DD/MM/YYYY") : null;

	}

	save() {
		const dd = { start: this.effectDate, end: this.endDate };
		this.dialogRef.close(dd);
	}

	close() {
		this.dialogRef.close();
	}
}
