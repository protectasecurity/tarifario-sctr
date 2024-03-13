import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDrawer, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { arrayMove, sortArray } from 'app/shared/helpers/utils';
import { Use } from 'app/shared/models/use.model';
import { Observable } from 'rxjs';
import * as feeActions from '../../_state/actions/fee.actions';
import * as fromReducer from '../../_state/reducers';
import { RiskGroup } from './../../../../shared/models/risk-group.model';

@Component({
	selector: 'app-riskgroup-picker-dialog',
	templateUrl: './riskgroup-picker-dialog.html',
	styleUrls: ['./riskgroup-picker-dialog.scss']
})
export class RiskGroupPickerDialogComponent implements OnInit {
	showFiller = false;
	filterGlobal: string;
	filterActual: string;
	my_Class = false;
	useSelected: Use;
	//// GLOBAL ////
	dataSourceGlobal: MatTableDataSource<RiskGroup>;
	dataUsesGlobal: Use[] = [];
	dataService: RiskGroup[];
	selectionGlobal = new SelectionModel<RiskGroup>(true, []);
	displayedColumnsGlobal: string[] = ['select', 'colDescription'];

	//// ACTUAL ////
	dataSourceActual: MatTableDataSource<RiskGroup>;
	selectionActual = new SelectionModel<RiskGroup>(true, []);
	dataActual: RiskGroup[];
	displayedColumnsActual: string[] = ['select', 'description'];

	// disableBtnSideBar: boolean = false;
	originIsNew: boolean = false;
	premiumbase: boolean = false;
	dataUsesActual: Use[] = [];
	dataRiskGroup: RiskGroup[] = [];
	dataRiskGroupbase: RiskGroup[] = [];

	// Data from service
	uses$: Observable<Use[]>;
	riskgroups$: Observable<RiskGroup[]>;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<RiskGroupPickerDialogComponent>,
		private store: Store<fromReducer.FeeState>,
		private ref: ChangeDetectorRef
	) {
		this.premiumbase = data.premiumbase;
		this.dataRiskGroupbase = data.gruposRiesgoBase;


		for (let index = 0; index < data.riskgroup.length; index++) {
			const element = data.riskgroup[index];
			element.indice = index;
		}

		this.dataActual = data.riskgroup;
		this.originIsNew = data.isnew;

		this.uses$ = this.store.select(fromReducer.getUses);
		this.riskgroups$ = this.store.select(fromReducer.getRiskGroups);

		this.dataSourceGlobal = new MatTableDataSource<RiskGroup>();
		this.dataSourceActual = new MatTableDataSource<RiskGroup>();
		this.loadMaster();
	}

	loadMaster() {
		this.riskgroups$.subscribe(riskgroupColl => {

			this.dataService = this.premiumbase ? this.dataRiskGroupbase : riskgroupColl.filter(d => d.isActive);

			this.uses$.subscribe(usosColl => {
				this.dataUsesGlobal = usosColl;
				setTimeout(() => {
					this.useSelected = usosColl[0];
					this.ref.markForCheck();
					this.updatesourceActual();
					this.updatesourceGlobal();
				}, 0);
			});
		});
	}

	ngOnInit(): void {
		this.store.dispatch(new feeActions.LoadUses());
		this.store.dispatch(new feeActions.LoadRiskgroups());
	}

	/// GLOBAL ///
	isAllSelectedGlobal() {
		const numSelected = this.selectionGlobal.selected.length;
		const numRows = this.dataSourceGlobal.data.length;
		return numSelected === numRows;
	}

	masterToggleGlobal() {
		this.isAllSelectedGlobal() ? this.selectionGlobal.clear() : this.dataSourceGlobal.data.forEach(row => this.selectionGlobal.select(row));
	}

	applyFilterGlobal(filterValue: string) {
		this.dataSourceGlobal.filter = filterValue.trim().toLowerCase();
	}

	disabledAddGlobal() {
		return this.dataSourceGlobal.data.length === 0 || this.selectionGlobal.selected.length === 0;
	}

	disabledAddActual() {
		return this.dataSourceActual.data.length === 0 || this.selectionActual.selected.length === 0;
	}

	updatesourceGlobal() {
		// Data del servicio
		// const tmpRiskGroups = this.dataService.filter(d => d.status);
		const riskGroupsActivesGlobal = sortArray(this.dataService, 'order', 1);
		const dataActual = this.dataActual;
		const arra = [];

		for (let idx = 0; idx < riskGroupsActivesGlobal.length; idx++) {
			const element = riskGroupsActivesGlobal[idx];
			const find = dataActual.find(e => e.id === element.id);
			if (find == null) {
				arra.push(element);
			} else {
				if (find.isActive === false) {
					// find.status = true;
					arra.push(find);
				}
			}
		}

		if (this.useSelected) {
			const groupRiskGlobalbyUse = arra.filter(x => x.vehicleUse.id === this.useSelected.id.toString());
			this.dataSourceGlobal = new MatTableDataSource(sortArray(groupRiskGlobalbyUse, 'description', 1));
			this.filterGlobal = '';
		}
		// this._spinner.hide();
	}
	/// FIN DE GLOBAL ///

	/// LOCAL  ////
	isAllSelectedActual() {
		const numSelected = this.selectionActual.selected.length;
		const numRows = this.dataSourceActual.data.length;
		return numSelected === numRows;
	}

	masterToggleActual() {
		this.isAllSelectedActual() ? this.selectionActual.clear() : this.dataSourceActual.data.forEach(row => this.selectionActual.select(row));
	}

	applyFilterActual(filterValue: string) {
		this.dataSourceActual.filter = filterValue.trim().toLowerCase();
	}

	delete() {
		for (let idx = 0; idx < this.selectionActual.selected.length; idx++) {
			const iriskGroup = this.selectionActual.selected[idx];
			iriskGroup.isActive = false;
			const fndRiskGroup = this.dataActual.find(x => x.id === iriskGroup.id);
			if (fndRiskGroup) {
				fndRiskGroup.isActive = false;
			}
		}
		/* this.dataActual = sortArray(this.dataActual, 'indice', 1);
		for (let index = 0; index < this.dataActual.length; index++) {
			const element = this.dataActual[index];
			element.indice = index;
		} */

		this.cleanCheckBoxes();
		this.updatesourceActual();
		this.updatesourceGlobal();
	}
	updatesourceActual() {
		// this._spinner.show();
		const arrayGroupRiskActual = [];
		const arrayUsesActual = [];
		for (let idx = 0; idx < this.dataActual.length; idx++) {
			const element = this.dataActual[idx];
			if (element.isActive) {
				arrayGroupRiskActual.push(element);
			}
			const elementUse = arrayUsesActual.find(x => x.id === element.vehicleUse.id);
			if (elementUse == null) {
				arrayUsesActual.push(element.vehicleUse);
			}
		}
		if (this.useSelected) {
			const groupRiskActualbyUse = arrayGroupRiskActual.filter(x => x.vehicleUse.id === this.useSelected.id.toString());
			this.dataSourceActual = new MatTableDataSource(sortArray(groupRiskActualbyUse, 'indice', 1));
		}
		this.filterActual = '';
	}

	save() {
		this.dialogRef.close(this.dataActual);
	}

	close() {
		this.dialogRef.close();
	}

	add() {
		for (let idx = 0; idx < this.selectionGlobal.selected.length; idx++) {
			const iRiskGroup = this.selectionGlobal.selected[idx];
			const fndRiskGroup = this.dataActual.find(x => x.id === iRiskGroup.id);
			if (fndRiskGroup == null) {
				iRiskGroup.indice = this.dataActual.filter(x => x.isActive).length + 1;
				this.dataActual.push(iRiskGroup);
			} else {
				const max = Math.max.apply(null, this.dataActual.filter(x => x.vehicleUse.id === fndRiskGroup.vehicleUse.id).map(item => item.indice));
				fndRiskGroup.indice = max + 1;
				fndRiskGroup.isActive = true;
			}
		}

		this.cleanCheckBoxes();
		this.updatesourceActual();
		this.updatesourceGlobal();
	}

	cleanCheckBoxes() {
		this.selectionGlobal = new SelectionModel<RiskGroup>(true, []);
		this.selectionActual = new SelectionModel<RiskGroup>(true, []);
	}

	changeUse() {
		this.cleanCheckBoxes();
		this.updatesourceActual();
		this.updatesourceGlobal();
	}

	drop(event: CdkDragDrop<RiskGroup[]>): void {
		moveItemInArray(this.dataActual, event.previousIndex, event.currentIndex);
		// arrayMove(this.dataActual, event.previousIndex, event.currentIndex);
		for (let index = 0; index < this.dataActual.length; index++) {
			const element = this.dataActual[index];
			element.indice = index;
		}
		this.updatesourceActual();
	}
}
