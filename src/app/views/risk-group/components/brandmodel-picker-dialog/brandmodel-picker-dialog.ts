import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { sortArray } from 'app/shared/helpers/utils';
import { Class } from 'app/shared/models/class.model';
import { Model } from 'app/shared/models/model.model';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as riskGroupActions from '../../_state/actions/risk.actions';
import * as fromReducer from '../../_state/reducers';
import { Brand, Filters, VehicleGroup } from './../../../../shared/models/brand.model';

@Component({
	selector: 'app-brandmodel-picker-dialog',
	templateUrl: './brandmodel-picker-dialog.html',
	styleUrls: ['./brandmodel-picker-dialog.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BrandModelPickerDialogComponent implements OnInit, OnDestroy {
	filterGlobal: string;
	filterActual: string;

	dataSource: MatTableDataSource<any>;
	displayedColumns: string[] = ['description', 'actions'];
	//// GLOBAL ////
	dataSourceGlobal: MatTableDataSource<Model>;
	selectionGlobal = new SelectionModel<Model>(true, []);
	displayedColumnsGlobal: string[] = ['select', 'colDescription'];

	//// ACTUAL ////
	dataSourceActual: MatTableDataSource<Model>;
	selectionActual = new SelectionModel<Model>(true, []);
	dataActual: Model[] = [];
	displayedColumnsActual: string[] = ['select', 'description'];

	// Data from service
	models$: Observable<Model[]> = this.store.select(fromReducer.getModelsByBrandsByClass);

	brands: Brand[];
	mainClass: Class;
	filters: Filters[] = [];

	public marcaCtrl: FormControl = new FormControl();
	public marcaFiltroCtrl: FormControl = new FormControl();
	public marcaSeleccionada: ReplaySubject<Brand[]> = new ReplaySubject<Brand[]>(1);
	private _onDestroy = new Subject<void>();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<BrandModelPickerDialogComponent>,
		private store: Store<fromReducer.RiskState>
	) {
		this.dataSourceActual = new MatTableDataSource<Model>();
		this.mainClass = data.class;

		// data.brands.subscribe(brandsColl => {

		// });
		if (data.brands) {
			this.brands = sortArray(data.brands, 'description', 1);
			this.dataSource = new MatTableDataSource(this.brands);
			setTimeout(() => {
				this.marcaSeleccionada.next(this.brands.slice());
				this.marcaFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
					this.filtrarMarcas();
				});
			}, 0);
		}
	}


	ngOnInit(): void {
		// this.marcaCtrl.setValue(this.marcas[10]);
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	private filtrarMarcas() {
		if (!this.brands) {
			return;
		}
		let search = this.marcaFiltroCtrl.value;
		if (!search) {
			this.marcaSeleccionada.next(this.brands.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.marcaSeleccionada.next(this.brands.filter(brand => brand.description.toLowerCase().indexOf(search) > -1));
	}

	/// GLOBAL ///
	isAllSelectedGlobal() {
		const numSelected = this.selectionGlobal.selected.length;
		const numRows = this.dataSourceGlobal.data === undefined ? 0 : this.dataSourceGlobal.data.length;
		return numSelected === numRows;
	}

	masterToggleGlobal() {
		this.isAllSelectedGlobal() ? this.selectionGlobal.clear() : this.dataSourceGlobal.data.forEach(row => this.selectionGlobal.select(row));
	}

	applyFilterGlobal(filterValue: string) {
		this.dataSourceGlobal.filter = filterValue.trim().toLowerCase();
	}

	disabledAddGlobal() {
		return this.dataSourceGlobal === undefined ? true : this.dataSourceGlobal.data.length === 0 || this.selectionGlobal.selected.length === 0;
	}

	disabledAddActual() {
		return this.dataSourceActual === undefined ? true : this.dataSourceActual.data.length === 0 || this.selectionActual.selected.length === 0;
	}

	/// FIN DE GLOBAL ///

	/// LOCAL  ////
	isAllSelectedActual() {
		const numSelected = this.selectionActual.selected.length;
		const numRows = this.dataSourceActual === undefined ? 0 : this.dataSourceActual.data.length;
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
			const imodel = this.selectionActual.selected[idx];
			this.dataActual.forEach((item, index) => {
				if (item === imodel) {
					this.dataActual.splice(index, 1);
				}
			});
		}
		this.cleanCheckBoxes();
		this.updatesourceActual();
	}

	updatesourceActual() {
		this.dataSourceActual = new MatTableDataSource(sortArray(this.dataActual, 'description', 1));
	}

	save() {
		for (let index = 0; index < this.filters.length; index++) {
			const elementBR = this.filters[index];
			for (let idx = 0; idx < elementBR.segmentedModels.length; idx++) {
				const elementMO = elementBR.segmentedModels[idx];
				elementMO.id = elementMO.id.toString();
			}
		}

		this.dialogRef.close(VehicleGroup.CreateInstance(this.filters));
	}

	close() {
		this.dialogRef.close();
	}

	add() {
		const currentSelection: Model[] = [];

		for (let idx = 0; idx < this.selectionGlobal.selected.length; idx++) {
			const iRiskGroup = this.selectionGlobal.selected[idx];
			const fndRiskGroup = this.dataActual.find(x => x.id === iRiskGroup.id);
			if (fndRiskGroup == null) {
				iRiskGroup.brand = this.marcaCtrl.value;
				this.dataActual.push(iRiskGroup);
				currentSelection.push(iRiskGroup);
			}
		}

		const filter = Filters.CreateInstance(this.marcaCtrl.value.id, this.marcaCtrl.value.description, currentSelection);
		this.filters = this.filters.concat(filter);

		this.cleanCheckBoxes();
		this.updatesourceActual();
	}

	cleanCheckBoxes() {
		this.selectionGlobal = new SelectionModel<Model>(true, []);
		this.selectionActual = new SelectionModel<Model>(true, []);
	}

	changeBrand() {
		this.store.dispatch(new riskGroupActions.LoadModelByBrandsByClass(this.mainClass.id, this.marcaCtrl.value.id));
		this.selectionGlobal = new SelectionModel<Model>(true, []);
		this.models$.subscribe(modelsColl => {
			this.dataSourceGlobal = new MatTableDataSource(sortArray(modelsColl, 'description', 1));
		});
		this.filterGlobal = '';
	}
}
