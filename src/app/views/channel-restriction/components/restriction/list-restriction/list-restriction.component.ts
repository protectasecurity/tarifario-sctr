import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { sortArray } from 'app/shared/helpers/utils';
import { Observable } from 'rxjs';
import { ChannelAgent } from '../../../models/ChannelAgent';
import { Restriction } from '../../../models/Restriction';
import * as fromAction from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';
import { EditRestrictionDialogComponent } from '../edit-restriction-dialog/edit-restriction-dialog.component';

@Component({
	selector: 'channel-restriction-list-restriction',
	templateUrl: './list-restriction.component.html',
	styleUrls: ['./list-restriction.component.scss']
})
export class ListRestrictionComponent implements OnInit {
	selectedChannel: ChannelAgent;
	modificationAllowed: boolean = true;
	dataSource = new MatTableDataSource<Restriction>();
	selectedChannel$: Observable<ChannelAgent> = this.store.select(fromReducer.getSelectedChannel);
	displayedColumns: string[] = ["uso", "clase", "fecha-inicial", "fecha-final", "activa", "acciones"];
	restrictionsOfChannel$: Observable<Restriction[]> = this.store.select(fromReducer.getRestrictionsOfChannel);

	constructor(private store: Store<fromReducer.ChannelRestrictionState>,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.restrictionsOfChannel$.subscribe(restrictions => {
			this.dataSource = new MatTableDataSource(sortArray(restrictions as Restriction[], 'id', 1));
		});
		this.selectedChannel$.subscribe(channel => this.selectedChannel = channel);
	}

	delete(row: Restriction, i: number) {
		this.store.dispatch(new fromAction.DeleteRestriction(row.id));
	}

	edit(row: Restriction, i: number) {
		const dialogRef = this.dialog.open(EditRestrictionDialogComponent, {
			width: "800px",
			height: "250px",
			data: { item: row }
		});
		dialogRef.afterClosed().subscribe((result: Restriction) => {
			if (result) {
				row.initialDate = result.initialDate;
				row.endDate = result.endDate;
				this.store.dispatch(new fromAction.UpdateRestriction(row));
				this.dataSource.data[i] = row;
				this.dataSource = new MatTableDataSource(this.dataSource.data);
			}
		});
	}

	changeStatus(row: Restriction, i: number) {
		row.status = (row.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
		this.store.dispatch(new fromAction.UpdateRestriction(row));
	}
}


