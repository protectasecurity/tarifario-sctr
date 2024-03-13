import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatRadioChange, MatTableDataSource } from "@angular/material";

import { SelectionModel } from "@angular/cdk/collections";
import { sortArray } from "app/shared/helpers/utils";
import { Ubigeo } from "../../models/ubigeo.model";

@Component({
	selector: "app-zone-modal",
	templateUrl: "./zone-modal.html",
	styleUrls: ["./zone-modal.scss"],
	encapsulation: ViewEncapsulation.None
})
export class ZoneModalComponent implements OnInit {
	selectedtype: string;
	collDepartments = [];
	collProvinces = [];
	departments = [];

	dataSourceActual: MatTableDataSource<Ubigeo>;
	displayedColumns: string[] = ["description", "select"];
	selectionActual: SelectionModel<Ubigeo> = new SelectionModel<Ubigeo>(false, []);
	initialSelection: any;

	titleTable: string;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ZoneModalComponent>) {
	}

	ngOnInit(): void {
		this.selectedtype = "1";
		this.titleTable = "Departamentos";
		const usedActive = this.data.inUseActive;
		const ubicaciones = [];
		for (let index = 0; index < this.data.ubicaciones.length; index++) {
			const element = this.data.ubicaciones[index];
			if (element.id.substring(0, 2) !== '99') {
				ubicaciones.push(element);
			}
		}
		const ubicacionesColl = ubicaciones;
		let initialUbi;
		this.selectUbicationsNotUsed(ubicacionesColl, usedActive, this.data.displayUbigeo);

		if (!this.data.isNew) {
			initialUbi = this.data.displayUbigeo;
			for (let idx = 0; idx < initialUbi.length; idx++) {
				const element = initialUbi[idx];
				this.ubicationType(element);
			}
		}
		this.setDataSourceActual(this.collDepartments, "description");

		if (!this.data.isNew) {
			this.initialSelection = this.dataSourceActual.data.filter((element, e) => {
				return initialUbi.some((val, i) => {
					if (element.id === val.id) {
						return true;
					}
					return;
				});
			});
			this.selectionActual = new SelectionModel<Ubigeo>(true, this.initialSelection);
		} else {
			this.selectionActual = new SelectionModel<Ubigeo>(true, this.data.displayUbigeo);
		}
	}

	save() {
		this.selectionActual.selected
			.map(ubi => {
				return ubi.isUsed = true;
			});
		this.dialogRef.close(this.selectionActual.selected);
	}

	selectDepartmentChange(item: any) {
		const collProvinces = this.collProvinces.filter(x => x.parent === item);
		this.setDataSourceActual(collProvinces, "description");
	}

	setDataSourceActual(data: any, property: string, direction: number = 1) {
		this.dataSourceActual = new MatTableDataSource(sortArray(data, property, direction));

	}

	selectUbicationsNotUsed(locations: any, usedLocations: any, displayUbigeo: any) {
		for (let idx = 0; idx < locations.length; idx++) {
			const ubi = locations[idx];
			const fndUbi = usedLocations.find(x => x.id === ubi.id || x.id.substring(0, 2) + '0000' === ubi.id);
			const fndUbiDisplay = displayUbigeo.find(x => x.id === ubi.id || x.id.substring(0, 2) + '0000' === ubi.id);
			if (fndUbi === undefined && fndUbiDisplay === undefined) {
				this.ubicationType(ubi);
			}
		}
	}

	ubicationType(ubi: any) {
		if (ubi.type === "DEPARTMENT") {
			this.collDepartments.push(ubi);
		} else if (ubi.type === "PROVINCE") {
			this.collProvinces.push(ubi);
		}
	}


	typechange(event: MatRadioChange) {
		if (event.value === "1") {
			this.titleTable = "Departamentos";
			this.setDataSourceActual(this.collDepartments, "description");
		} else {
			this.titleTable = "Provincias";
			this.setDataSourceActual([], "description");
		}
	}

	close() {
		this.dialogRef.close();
	}

	isAllSelectedActual() {
		const numSelected = this.selectionActual.selected.length;
		const numRows = this.dataSourceActual === undefined ? 0 : this.dataSourceActual.data.length;
		return numSelected === numRows;
	}

	masterToggleActual() {
		this.isAllSelectedActual() ? this.selectionActual.clear() : this.dataSourceActual.data.forEach(row => this.selectionActual.select(row));
	}

	isProvince() {
		return this.selectedtype === "2";
	}

}
