import { SelectionModel } from '@angular/cdk/collections';
import { Inject } from '@angular/core';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { sortArray } from 'app/shared/helpers/utils';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { Channel } from '../../../manage-channel/models/Channels';
import * as feeActions from '../../_state/actions/fee.actions';
import * as fromReducer from '../../_state/reducers';
import { IMatrixChannelGroup } from './../../models/tariffmatrix.model';

@Component({
	selector: 'app-channel-list-dialog',
	templateUrl: './channel-list-dialog.html',
	styleUrls: ['./channel-list-dialog.scss']
})
export class ChannelListDialogComponent implements OnInit, OnChanges {
	channels$: Observable<IMatrixChannelGroup[]> = this.store.select(fromReducer.getChannelGroup);
	displayedColumns: string[] = ['select', 'description'];
	dataSource = new MatTableDataSource<IMatrixChannelGroup>();
	selection = new SelectionModel<IMatrixChannelGroup>(true, []);
	effectDate = moment();
	minDate = moment();
	maxDate = null;


	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<fromReducer.FeeState>,
		private confirmService: AppConfirmService,
		private dialogRef: MatDialogRef<ChannelListDialogComponent>
	) {
		this.minDate = data.feeStart;
		this.maxDate = data.feeEnd ? data.FeeEnd : null;
		this.channels$.subscribe(channels => {
			let arr = sortArray(channels, "description", 1);
			if (arr.length > 0) {
				arr = arr.filter(x => x.isActive === true);
			}
			this.dataSource = new MatTableDataSource(arr);
		});
	}

	ngOnInit() {
		this.store.dispatch(new feeActions.LoadChannelGroup());
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.items && changes.items.currentValue) {
		}
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: IMatrixChannelGroup): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
	}

	save() {
		const md = { data: this.selection.selected, date: this.effectDate };
		this.dialogRef.close(md);
	}

	close() {
		this.dialogRef.close();
	}
}
