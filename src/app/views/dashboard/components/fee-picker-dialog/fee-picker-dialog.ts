import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Fee } from 'app/views/fee/models/fee.model';
import * as fromReducer from '../../_state/reducers';

@Component({
	selector: 'app-fee-picker-dialog',
	templateUrl: './fee-picker-dialog.html',
	styleUrls: ['./fee-picker-dialog.scss']
})
export class FeePickerDialogComponent {
	descriptionFilter = new FormControl();
	dataSource: MatTableDataSource<Fee>;
	isbase: boolean = false;
	displayedColumns: string[] = ['description', 'startDate', 'endDate', 'currency', 'actions'];
	filteredValues = {
		description: ''
	};

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public r: Router, private dialogRef: MatDialogRef<FeePickerDialogComponent>) {
		this.dataSource = new MatTableDataSource(data.feeList);
		this.isbase = data.isbase;
		this.dataSource.filterPredicate = this.feeFilterPredicate();
		this.setFilters();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['description'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function(data: Fee, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.description
				? searchString.description
						.toString()
						.toLocaleLowerCase()
						.trim()
				: '';
			const descriptionFilter =
				data.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	handleContainer(fee: Fee) {
		if (this.isbase) {
			this.r.navigate([`/fee/basechannel/${fee.idTarifa}`]);
		} else {
			this.r.navigate([`/fee/basespecialchannel/${fee.idTarifa}`]);
		}
		this.dialogRef.close();
	}
}
