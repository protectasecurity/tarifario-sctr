import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-fee-masive',
	templateUrl: './fee-masive.html',
	styleUrls: ['./fee-masive.scss']
})
export class FeeMasiveComponent {
	feeValue;


	constructor(public dialogRef: MatDialogRef<FeeMasiveComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onlyDecimalNumberKey(event) {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode !== 46 && charCode > 31
			&& (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

}

