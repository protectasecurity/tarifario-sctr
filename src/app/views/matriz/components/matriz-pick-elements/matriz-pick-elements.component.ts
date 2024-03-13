import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from "@angular/material";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { sortArray } from "../../../../shared/helpers/utils";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { Actividades } from "../../../actividades/models/Actividades";
import { Zone } from "../../../zones/models/zone.model";
import { IMatrizActividades, IMatrizZone } from "../../models/matriz.model";
import * as fromReducer from "../../state/reducers";


@Component({
	selector: "app-matriz-pick-elements",
	templateUrl: "./matriz-pick-elements.component.html",
	styleUrls: ["./matriz-pick-elements.component.scss"]
})
export class MatrizPickElementsComponent {

	// DATA PARA ZONAS
	filterZonas: string;
	filterActualZonas: string;

	dataSourceZonasGlobal: MatTableDataSource<Zone>;
	selectionZonasGlobal = new SelectionModel<Zone>(true, []);
	displayedZonasColumnsGlobal: string[] = ["select", "colDescription"];

	dataSourceZonasActual: MatTableDataSource<IMatrizZone>;
	selectionZonasActual = new SelectionModel<IMatrizZone>(true, []);
	dataZonasActual: IMatrizZone[];
	dataZonasService: Zone[];
	dataZonasTemp: Zone[];
	displayedZonasColumnsActual: string[] = ["select", "description"];

	originIsNew: boolean = false;
	zones$: Observable<Zone[]>;

	// DATA PARA ACTIVIDADEs
	filterActividades: string;
	filterActualActividades: string;

	dataSourceActividadesGlobal: MatTableDataSource<Actividades>;
	selectionActividadesGlobal = new SelectionModel<Actividades>(true, []);
	displayedActividadesColumnsGlobal: string[] = ["select", "colDescription"];

	dataSourceActividadesActual: MatTableDataSource<IMatrizActividades>;
	selectionActividadesActual = new SelectionModel<IMatrizActividades>(true, []);
	dataActividadesActual: IMatrizActividades[];
	dataActividadesService: Actividades[];
	displayedActividadesColumnsActual: string[] = ["select", "description"];

	// originIsNew: boolean = false;
	actividades$: Observable<Actividades[]>;


	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private confirmService: AppConfirmService,
		private dialogRef: MatDialogRef<MatrizPickElementsComponent>,
		private store: Store<fromReducer.MatrizState>
	) {

		if (data.isnew) {
			this.dataZonasActual = [];
			this.dataActividadesActual = [];
		} else {
			this.dataZonasActual = [];

			data.zones.forEach(val => this.dataZonasActual.push({
				id: val.id,
				description: val.description,
				active: val.isActive,
				used: val.isUsed,
				locations: val.locations,
				indice: val.order,
				status: 1
			}));
			this.dataActividadesActual = data.actividades.map(a => {
				a.status = 1;
				return a;
			});
		}
		this.zones$ = this.store.select(fromReducer.getZones);
		this.actividades$ = this.store.select(fromReducer.getActividades);
		this.originIsNew = data.isnew;

		this.zones$.subscribe(zonasColl => {
			if (zonasColl.length !== 0) {
				const tmpZone = zonasColl.filter(d => d.active);
				this.dataZonasService = sortArray(tmpZone, "indice", 1);
				this.updatesourceZonasGlobal();
				this.updatesourceActual();

			}
		});

		this.actividades$.subscribe(actColl => {
			const tmpAct = actColl.filter(d => d.isActive);
			this.dataActividadesService = sortArray(tmpAct, "id", 1);
			this.updatesourceActividadesGlobal();
		});

		this.updatesourceActividadesActual();
	}

	applyFilterActual(filterValue: string) {

	}

	// METODOS ZONAS
	isAllSelectedGlobal() {
		const numSelected = this.selectionZonasGlobal.selected.length;
		const numRows = this.dataSourceZonasGlobal.data.length;
		return numSelected === numRows;
	}

	masterToggleGlobal() {
		this.isAllSelectedGlobal() ?
			this.selectionZonasGlobal.clear() : this.dataSourceZonasGlobal.data.forEach(row => this.selectionZonasGlobal.select(row));
	}

	applyfilterZonas(filterValue: string) {
		this.dataSourceZonasGlobal.filter = filterValue.trim().toLowerCase();
	}

	disabledAddGlobal() {
		if (this.dataSourceZonasGlobal) {
			return this.dataSourceZonasGlobal.data.length === 0 || this.selectionZonasGlobal.selected.length === 0;
		} else {
			return false;
		}
	}

	actualData() {
		if (this.dataSourceZonasActual) {
			return this.dataSourceZonasActual.data.length === 0 || this.dataSourceActividadesActual.data.length === 0;
		} else {
			return false;
		}
	}

	disabledAddActual() {
		if (this.dataSourceZonasActual) {
			return this.dataSourceZonasActual.data.length === 0 || this.selectionZonasActual.selected.length === 0;
		} else {
			return false;
		}
	}

	updatesourceZonasGlobal() {

		const tmpZone = this.dataZonasService;

		const zonasActivasGlobal = sortArray(tmpZone, "indice", 1);
		const arra = [];
		for (let idx = 0; idx < zonasActivasGlobal.length; idx++) {
			const element = zonasActivasGlobal[idx];
			const find = this.dataZonasActual.find(e => e.id === element.id);
			if (find == null) {
				arra.push(element);
			} else {
				if (find.status === 0) {
					arra.push(find);
				}
			}
		}
		this.dataSourceZonasGlobal = new MatTableDataSource(arra);
		this.filterZonas = "";
	}

	isAllSelectedActual() {
		const numSelected = this.selectionZonasActual.selected.length;
		const numRows = this.dataSourceZonasActual.data.length;
		return numSelected === numRows;
	}

	updatesourceActual() {
		const arrayZoneActual = [];

		for (let idx = 0; idx < this.dataZonasActual.length; idx++) {
			const element = this.dataZonasActual[idx];
			if (element.status === 1) {
				arrayZoneActual.push(element);
			}
		}
		const zonasActivasActual = sortArray(arrayZoneActual, "order", 1);
		this.dataSourceZonasActual = new MatTableDataSource(zonasActivasActual);
		this.filterActualZonas = "";
	}

	masterToggleActual() {
		this.isAllSelectedActual() ?
			this.selectionZonasActual.clear() : this.dataSourceZonasActual.data.forEach(row => this.selectionZonasActual.select(row));
	}

	applyfilterActualZonas(filterValue: string) {
		this.dataSourceZonasActual.filter = filterValue.trim().toLowerCase();
	}

	delete() {
		for (let idx = 0; idx < this.selectionZonasActual.selected.length; idx++) {
			const mZone = this.selectionZonasActual.selected[idx];
			mZone.status = 0;
		}
		this.selectionZonasActual.clear();
		this.selectionZonasGlobal.clear();
		this.updatesourceActual();
		this.updatesourceZonasGlobal();
	}

	save() {

		const data = { zone: this.dataZonasActual.filter(x => x.status === 1), actividades: this.dataActividadesActual.filter(a => a.status === 1) };
		this.dialogRef.close(data);
	}

	close() {
		this.dialogRef.close();
	}

	add() {
		if (this.dataZonasActual.filter(z => z.locations.find(l => l.id === "990000") && z.status === 1).length !== 0) {
			this.confirmService.confirm({ title: "Error", message: "No puede adicionar zonas. Existe una de tipo nacional", showcancel: false });
			return;
		} else {

			for (let idx = 0; idx < this.selectionZonasGlobal.selected.length; idx++) {
				const mZone = this.selectionZonasGlobal.selected[idx];
				if (mZone.locations.filter(z => z.id === "990000").length !== 0) {
					this.dataZonasActual = [];
					this.dataZonasActual.push({
						id: mZone.id,
						description: mZone.description,
						active: true,
						used: false,
						locations: mZone.locations,
						indice: mZone.indice,
						status: 1
					});
					this.disabledAddActual();
					idx = this.selectionZonasGlobal.selected.length;
				} else {
					const fndZone = this.dataZonasActual.find(x => x.id === mZone.id);
					if (fndZone == null) {
						this.dataZonasActual.push({
							id: mZone.id,
							description: mZone.description,
							active: true,
							used: false,
							locations: mZone.locations,
							indice: mZone.indice,
							status: 1
						});
					} else {
						fndZone.status = 1;
					}
				}
			}

			this.cleanCheckBoxes();
			this.updatesourceActual();
			this.updatesourceZonasGlobal();

		}
	}

	cleanCheckBoxes() {
		this.selectionZonasGlobal = new SelectionModel<Zone>(true, []);
		this.selectionZonasActual = new SelectionModel<IMatrizZone>(true, []);
	}

	restore(imatzone: IMatrizZone) {
		const restoreZone = this.dataZonasActual.find(x => x.id === imatzone.id);
		if (restoreZone.status === 4) {
			restoreZone.status = 1;
		}
		this.updatesourceActual();
	}

	restoreAll() {
		for (let idx = 0; idx < this.dataZonasActual.length; idx++) {
			const element = this.dataZonasActual[idx];
			if (element.status === 4) {
				element.status = 1;
			}
		}
		this.cleanCheckBoxes();
		this.updatesourceActual();
	}

	isAllEliminatedToRestore() {
		const numRows = this.dataSourceZonasActual.data.length;
		const restoreItems = this.dataZonasActual.filter(x => x.status === 4).length;
		return restoreItems === numRows;
	}

	isAllEliminatedToRestoreWithData() {
		return this.isAllEliminatedToRestore() && this.dataSourceZonasActual.data.length > 0;
	}


	// METODOS ACTIVIDADES
	isAllSelectedActividadesGlobal() {
		const numSelected = this.selectionActividadesGlobal.selected.length;
		const numRows = this.dataSourceActividadesGlobal.data.length;
		return numSelected === numRows;
	}

	masterToggleActividadesGlobal() {
		this.isAllSelectedActividadesGlobal() ?
			this.selectionActividadesGlobal.clear() : this.dataSourceActividadesGlobal.data.forEach(row => this.selectionActividadesGlobal.select(row));
	}

	applyfilterActividades(filterValue: string) {
		this.dataSourceActividadesGlobal.filter = filterValue.trim().toLowerCase();
	}

	disabledAddActividadesGlobal() {
		return this.dataSourceActividadesGlobal.data.length === 0 || this.selectionActividadesGlobal.selected.length === 0;
	}

	disabledAddActividadesActual() {
		return this.dataSourceActividadesActual.data.length === 0 || this.selectionActividadesActual.selected.length === 0;
	}

	updatesourceActividadesGlobal() {
		const tmpAct = this.dataActividadesService;
		const actActivasGlobal = sortArray(tmpAct, "order", 1);
		const arra = [];

		for (let idx = 0; idx < actActivasGlobal.length; idx++) {
			const element = actActivasGlobal[idx];
			const find = this.dataActividadesActual.find(e => e.id === element.id);
			if (find == null) {
				arra.push(element);
			} else {
				if (find.status === 0) {
					arra.push(find);
				}
			}
		}
		this.dataSourceActividadesGlobal = new MatTableDataSource(arra);
		this.filterActividades = "";
	}

	updatesourceActividadesActual() {
		const arrayActividadesActual = [];

		for (let idx = 0; idx < this.dataActividadesActual.length; idx++) {
			const element = this.dataActividadesActual[idx];
			if (element.status === 1) {
				arrayActividadesActual.push(element);
			}
		}
		const actividadesActivasActual = sortArray(arrayActividadesActual, "id", 1);
		this.dataSourceActividadesActual = new MatTableDataSource(actividadesActivasActual);
		this.filterActualActividades = "";
	}

	isAllSelectedActividadesActual() {
		const numSelected = this.selectionActividadesActual.selected.length;
		const numRows = this.dataSourceActividadesActual.data.length;
		return numSelected === numRows;
	}

	masterToggleActividadesActual() {
		this.isAllSelectedActividadesActual() ?
			this.selectionActividadesActual.clear() : this.dataSourceActividadesActual.data.forEach(row => this.selectionActividadesActual.select(row));
	}

	applyfilterActualActividades(filterValue: string) {
		this.dataSourceActividadesActual.filter = filterValue.trim().toLowerCase();
	}

	deleteA() {
		for (let idx = 0; idx < this.selectionActividadesActual.selected.length; idx++) {
			const mZone = this.selectionActividadesActual.selected[idx];
			mZone.status = 0;
		}
		this.selectionActividadesActual.clear();
		this.selectionActividadesGlobal.clear();
		this.updatesourceActividadesActual();
		this.updatesourceActividadesGlobal();
	}

	saveA() {
		this.dialogRef.close(this.dataActividadesActual.filter(x => x.status === 1));
	}

	closeA() {
		this.dialogRef.close();
	}

	addA() {

		for (let idx = 0; idx < this.selectionActividadesGlobal.selected.length; idx++) {

			const mAct = this.selectionActividadesGlobal.selected[idx];

			const fndAct = this.dataActividadesActual.find(x => x.id === mAct.id);
			if (fndAct == null) {

				this.dataActividadesActual.push({
					id: mAct.id,
					description: mAct.description,
					group: mAct.group,
					groupId: mAct.groupId,
					order: mAct.order,
					isUsed: false,
					isDelimiter: mAct.isDelimiter,
					isSelfManaging: mAct.isSelfManaging,
					isActive: true,
					discount: mAct.discount,
					factor: mAct.factor,
					status: 1,
					variations: mAct.variations
				});
			} else {
				fndAct.status = 1;
			}
		}
		this.cleanCheckBoxesActividades();
		this.updatesourceActividadesActual();
		this.updatesourceActividadesGlobal();
	}

	cleanCheckBoxesActividades() {
		this.selectionActividadesGlobal = new SelectionModel<Actividades>(true, []);
		this.selectionActividadesActual = new SelectionModel<IMatrizActividades>(true, []);
	}

	restoreActividades(imatact: IMatrizActividades) {
		const restoreAct = this.dataActividadesActual.find(x => x.id === imatact.id);
		if (restoreAct.status === 4) {
			restoreAct.status = 1;
		}
		this.updatesourceActividadesActual();
	}

	restoreAllActividades() {
		for (let idx = 0; idx < this.dataActividadesActual.length; idx++) {
			const element = this.dataActividadesActual[idx];
			if (element.status === 4) {
				element.status = 1;
			}
		}
		this.cleanCheckBoxesActividades();
		this.updatesourceActividadesActual();
	}

	isAllEliminatedToRestoreActividades() {
		const numRows = this.dataSourceActividadesActual.data.length;
		const restoreItems = this.dataActividadesActual.filter(x => x.status === 4).length;
		return restoreItems === numRows;
	}

	isAllEliminatedToRestoreWithDataActividades() {
		return this.isAllEliminatedToRestoreActividades() && this.dataSourceActividadesActual.data.length > 0;
	}
}
