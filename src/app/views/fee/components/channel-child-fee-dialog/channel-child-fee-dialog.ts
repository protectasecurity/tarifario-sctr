import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortArray } from 'app/shared/helpers/utils';
import { Fee } from 'app/views/fee/models/fee.model';
import { FeePickerDialogComponent } from "../../../dashboard/components/fee-picker-dialog/fee-picker-dialog";
import * as fromReducer from '../../_state/reducers';

@Component({
	selector: 'app-channel-child-fee-dialog',
	templateUrl: './channel-child-fee-dialog.html',
	styleUrls: ['./channel-child-fee-dialog.scss']
})
export class ChannelChildFeeDialogComponent {
	descriptionFilter = new FormControl();
	dataSource: MatTableDataSource<any>;
	isbase: boolean = false;
	displayedColumns: string[] = ['broker', 'intermedia', 'client', 'grupo'];
	filteredValues = {
		description: ''
	};

	channelCollection: any[] = [];

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public r: Router) {/* 

		console.log(data); */
		for (let index = 0; index < data.length; index++) {
			const element = data[index].channelGroup;

			for (let idx = 0; idx < element.channels.length; idx++) {
				const channel = element.channels[idx];

				const fndBrokerArr = [];
				const fndBroker = channel.agents.filter(x => x.type === 'BROKER');
				for (let idy = 0; idy < fndBroker.length; idy++) {
					const elementBroker = fndBroker[idy];
					fndBrokerArr.push(elementBroker.description);
				}

				const fndIntemedrArr = [];
				const fndIntemed = channel.agents.filter(x => x.type === 'MIDDLEMAN');
				for (let idy = 0; idy < fndIntemed.length; idy++) {
					const elementIntermed = fndIntemed[idy];
					fndIntemedrArr.push(elementIntermed.description);
				}

				const mItem = {
					corredor: fndBrokerArr.join('-'),
					intermed: fndIntemedrArr.join('-'),
					client: null,
					concat: fndBrokerArr.join('-') + fndIntemedrArr.join('-') + element.description,
					title: element.description
				};
				const fnd = this.channelCollection.find(x =>
					x.corredor === mItem.corredor &&
					x.intermed === mItem.intermed &&
					x.client === mItem.client &&
					x.title === mItem.title);
				if (fnd === undefined) {
					this.channelCollection.push(mItem);
				}
			}
		}
		this.dataSource = new MatTableDataSource(sortArray(this.channelCollection, "concat", 1));
		this.setFilters();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['description'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}


}
