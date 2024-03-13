import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RiskGroup } from '../../../shared/models/risk-group.model';
import { Use } from '../../../shared/models/use.model';
import * as riskActions from '../_state/actions/risk.actions';
import * as fromReducer from '../_state/reducers';
@Component({
	selector: 'app-risk-group-modal',
	templateUrl: './risk-group-modal.html',
	styleUrls: ['./risk-group-modal.scss']
})
export class RiskGroupModalComponent {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	uses$: Observable<Use[]> = this.store.select(fromReducer.getUses);
	riskGroups: RiskGroup[];
	riskGroupsUse: RiskGroup[];
	displayedColumns: string[] = ['description'];
	useSelected: string;

	constructor(
		public dialogRef: MatDialogRef<RiskGroupModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private actionsSubject$: ActionsSubject,
		private spinner: NgxSpinnerService,
		private store: Store<fromReducer.RiskState>
	) {
		this.store.dispatch(new riskActions.LoadUses());
		this.triggers();
		this.uses$.subscribe(x => {
			if (x.length > 0) {
				this.riskGroups = data.riskgroups.sort(function (a, b) {
					const nameA = Number(a.vehicleUse.order) * 1000, //  + '-' + Number(a.order),
						nameB = Number(b.vehicleUse.order) * 1000; // + '-' + Number(b.order);
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});
				this.useSelected = x[0].id;
				this.listRiskByUse(x[0].id);
			}
		});
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(riskActions.RiskActionTypes.ReorderRiskGroupCompleted))
			.subscribe(() => {
				this.spinner.hide();
			});
	}

	filterGroupRiskByUse(event: any): void {
		const useSelectId = event.value;
		this.listRiskByUse(useSelectId);
	}

	listRiskByUse(useId) {
		this.riskGroupsUse = [];
		this.riskGroupsUse = this.riskGroups.filter(x => x.vehicleUse.id === useId.toString());
	}

	close(): void {
		this.dialogRef.close(false);
	}

	drop(event: CdkDragDrop<RiskGroup[]>): void {
		moveItemInArray(this.riskGroupsUse, event.previousIndex, event.currentIndex);
		if (event !== undefined && event.previousIndex !== event.currentIndex) {
			const rg = event.item.data;
			rg.order = event.currentIndex;
			this.spinner.show();
			this.store.dispatch(new riskActions.ReorderRiskGroup(rg));
		}
	}
	save(): void {
		this.dialogRef.close(true);
	}
}
