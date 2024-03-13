import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-effectdateconfirm',
	templateUrl: './effectdate-confirm.html',
	styleUrls: ['./effectdate-confirm.scss']
})
export class EffectDateComponent {
	effectDate;
	minDate = null;
	maxDate = null;

	constructor(public dialogRef: MatDialogRef<EffectDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
		if (data) {
			this.effectDate = data.effecdate;
			this.minDate = data.mindate ? data.mindate : null;
			this.maxDate = data.maxdate ? data.maxdate : null;
		}
	}
}
