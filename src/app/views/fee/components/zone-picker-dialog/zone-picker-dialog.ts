import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDrawer, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { arrayMove, sortArray } from 'app/shared/helpers/utils';
import { Observable } from 'rxjs';
import { Zone } from '../../../zones/models/zone.model';
import * as fromReducer from '../../_state/reducers';
import { IFeeZone } from '../../models/fee.model';

@Component({
	selector: 'app-zone-picker-dialog',
	templateUrl: './zone-picker-dialog.html',
	styleUrls: ['./zone-picker-dialog.scss']
})
export class ZonePickerDialogComponent {
	showFiller = false;
	filterGlobal: string;
	filterActual: string;
	my_Class = false;

	//// GLOBAL ////
	dataSourceGlobal: MatTableDataSource<Zone>;
	selectionGlobal = new SelectionModel<Zone>(true, []);
	displayedColumnsGlobal: string[] = ['select', 'colDescription'];

	//// ACTUAL ////
	dataSourceActual: MatTableDataSource<IFeeZone>;
	selectionActual = new SelectionModel<IFeeZone>(true, []);
	dataActual: IFeeZone[];
	dataService: Zone[];
	displayedColumnsActual: string[] = ['select', 'description'];

	premiumbase: boolean = false;
	originIsNew: boolean = false;
	zones$: Observable<Zone[]>;
	zonesBase: Zone[] = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<ZonePickerDialogComponent>,
		private store: Store<fromReducer.FeeState>
	) {
		this.premiumbase = data.premiumbase;
		this.zonesBase = data.zonasBase;

		if (data.zones) {
			for (let index = 0; index < data.zones.length; index++) {
				const element = data.zones[index];
				element.indice = index;
			}
		}
		this.dataActual = data.zones ? data.zones : [];
		this.originIsNew = data.isnew;
		this.zones$ = this.store.select(fromReducer.getZones);

		this.zones$.subscribe(zonasColl => {
			const tmpZone = zonasColl.filter(d => d.active && d.description !== 'Nacional');
			this.dataService = this.premiumbase ? this.zonesBase : tmpZone; // sortArray(tmpZone, 'indice', 1);
		});

		this.updatesourceActual();
		this.updatesourceGlobal();
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
		const tmpZone = this.dataService;
		const zonasActivasGlobal = tmpZone.sort(function (a, b) {
			return a.description.localeCompare(b.description);
		});

		// const zonasActivasGlobal = sortArray(tmpZone, 'description', 1);
		const arra = [];
		for (let idx = 0; idx < zonasActivasGlobal.length; idx++) {
			const element = zonasActivasGlobal[idx];
			const find = this.dataActual.find(e => e.id === element.id);
			if (find == null) {
				arra.push(element);
			} else {
				if (find.status === 0) {
					arra.push(find);
				}
			}
		}
		this.dataSourceGlobal = new MatTableDataSource(arra);
		this.filterGlobal = '';
	}

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
			const mZone = this.selectionActual.selected[idx];
			mZone.status = 0;
		}
		this.selectionActual.clear();
		this.selectionGlobal.clear();
		this.updatesourceActual();
		this.updatesourceGlobal();
	}
	updatesourceActual() {
		const arrayZoneActual = [];
		for (let idx = 0; idx < this.dataActual.length; idx++) {
			const element = this.dataActual[idx];
			if (element.status === 1) {
				// element.indice = arrayZoneActual.length + 1;
				arrayZoneActual.push(element);
			}
		}
		const zonasActivasActual = sortArray(arrayZoneActual, 'indice', 1);
		this.dataSourceActual = new MatTableDataSource(zonasActivasActual);
		this.filterActual = '';
	}

	save() {
		this.dialogRef.close(this.dataActual.filter(x => x.status === 1));
	}

	close() {
		this.dialogRef.close();
	}

	add() {
		for (let idx = 0; idx < this.selectionGlobal.selected.length; idx++) {
			const mZone = this.selectionGlobal.selected[idx];
			const fndZone = this.dataActual.find(x => x.id === mZone.id);
			if (fndZone == null) {
				this.dataActual.push({
					id: mZone.id,
					description: mZone.description,
					active: true,
					used: false,
					locations: mZone.locations,
					indice: this.dataActual.length + 1,
					status: 1
				});
			} else {
				fndZone.status = 1;
				fndZone.indice = this.dataActual.filter(x => x.status === 1).length + 1;
			}
		}
		this.cleanCheckBoxes();
		this.updatesourceActual();
		this.updatesourceGlobal();
	}

	cleanCheckBoxes() {
		this.selectionGlobal = new SelectionModel<Zone>(true, []);
		this.selectionActual = new SelectionModel<IFeeZone>(true, []);
	}

	restore(ifeezone: IFeeZone) {
		const restoreZone = this.dataActual.find(x => x.id === ifeezone.id);
		if (restoreZone.status === 4) {
			restoreZone.status = 1;
		}
		this.updatesourceActual();
	}

	restoreAll() {
		for (let idx = 0; idx < this.dataActual.length; idx++) {
			const element = this.dataActual[idx];
			if (element.status === 4) {
				element.status = 1;
			}
		}
		this.cleanCheckBoxes();
		this.updatesourceActual();
	}
	isAllEliminatedToRestore() {
		const numRows = this.dataSourceActual.data.length;
		const restoreItems = this.dataActual.filter(x => x.status === 4).length;
		return restoreItems === numRows;
	}

	isAllEliminatedToRestoreWithData() {
		return this.isAllEliminatedToRestore() && this.dataSourceActual.data.length > 0;
	}

	drop(event: CdkDragDrop<Zone[]>): void {
		// moveItemInArray(this.dataActual, event.previousIndex, event.currentIndex);
		arrayMove(this.dataActual, event.item.data.indice, event.currentIndex);

		for (let index = 0; index < this.dataActual.length; index++) {
			const element = this.dataActual[index];
			element.indice = index;
		}
		this.updatesourceActual();
	}
}
