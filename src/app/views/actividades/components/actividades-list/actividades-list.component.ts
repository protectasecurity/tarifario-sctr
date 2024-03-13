import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatPaginator, MatTable, MatTableDataSource } from "@angular/material";
import { Observable } from "rxjs";
import { sortArray } from "../../../../shared/helpers/utils";
import { Actividades } from "../../models/Actividades";
import { ActividadesDialogComponent } from "../actividades-modal/actividades-modal.component";
import { Parameter } from './../../../parameters/models/parameter.model';
import { IVariations } from './../../models/Actividades';

@Component({
	selector: "app-actividades-list",
	templateUrl: "./actividades-list.component.html",
	styleUrls: ["./actividades-list.component.scss"]
})


export class ActividadesListComponent implements OnInit, OnChanges {
	@ViewChild("table") table: MatTable<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	displayedColumns: string[] = ["actividad", "descriptions", "estado", "orden", "descuento", "gestionable", "delimiter"];
	dataSource: MatTableDataSource<any>;
	displayNew: Actividades[] = [];
	parametersField: Parameter[] = [];
	displayedBranch: string;

	@Input() items: Actividades[];
	@Input() parameters: Parameter[];
	@Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output() onUpdateStatus: EventEmitter<any> = new EventEmitter<any>();
	@Output() onAddActividades: EventEmitter<any> = new EventEmitter<any>();

	spans = [];
	descriptionFilter = new FormControl();
	stateFilter = new FormControl();
	isEditing: boolean;
	filteredValues = {
		descripcion: "",
		estado: null
	};
	public isLoading$: Observable<boolean>;

	constructor(public dialog: MatDialog) {
	}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.parameters && changes.parameters.currentValue) {
			if (changes.parameters.currentValue.length !== 0) {
				this.parametersField = changes.parameters.currentValue.filter(x => x.type === 'FIELD' && x.isActive === true);
				this.displayedBranch = this.parametersField[0].equivalenceCode;
				this.stateFilter.setValue(this.parametersField[0].equivalenceCode);
			}
		}
		if (changes.items && changes.items.currentValue) {
			this.displayNew = changes.items.currentValue;
			this.dataSource = new MatTableDataSource([]);
			if (changes.items.currentValue.length !== 0) {
				this.items = sortArray(changes.items.currentValue, "groupId", 1);
				this.setDatasource();
			}
			this.dataSource.paginator = this.paginator;
			this.dataSource.filterPredicate = this.feeFilterPredicate();
			this.setFilters();
		}
	}
	setDatasource() {
		this.items = sortArray(this.items, "order", 1);
		this.cacheSpan("Name", d => d.groupId);
		this.dataSource = new MatTableDataSource(this.items);
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["descripcion"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.displayedBranch = stateFilterValue;
			this.setDatasource();
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: Actividades, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.descripcion
				? searchString.descripcion
					.toString()
					.toLocaleLowerCase()
					.trim()
				: "";

			const descriptionFilter =
				data.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			// //CIU
			// const findCiu = searchString.ciu
			// 	? searchString.ciu
			// 		.toString()
			// 		.toLocaleLowerCase()
			// 		.trim()
			// 	: '';
			//
			// const descriptionCiu =
			// 	data.ciu
			// 		.toString()
			// 		.toLocaleLowerCase()
			// 		.trim()
			// 		.indexOf(findDescript) !== -1;

			// estado
			const findEstado = searchString.estado ? searchString.estado.toString().trim() : "";
			const resultEstado = findEstado === "true" ? true : false;
			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	openModalAdd() {
		let dialogRef;
		dialogRef = this.dialog.open(ActividadesDialogComponent, {
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.create(result);
			}
		});
	}

	changeStatus(row: Actividades) {
		row.isActive = !row.isActive;
		this.onUpdateStatus.emit(row);
		this.refreshTable(row);
	}

	getVariationValue(row: Actividades, branch: string) {
		const cboRamo = this.displayedBranch;
		const obj = row.variations.find(x => x.branchCode === cboRamo);
		const result = obj ? obj.value : '';
		return result;
	}

	delete(row: any) {
		this.onDelete.emit(row);
		this.refreshTable(row);
	}

	create(row: Actividades) {
		this.onAddActividades.emit(row);
		this.refreshTable(row);
	}

	dropTable(event: CdkDragDrop<Actividades>) {
		const act = event.item.data;
		act.order = event.currentIndex;
		this.onUpdateStatus.emit(act);
	}

	refreshTable(newParam: Actividades): void {
		if (this.displayNew.filter(x => x.id === newParam.id).length > 0) {
			return;
		}
		this.displayNew.push(newParam);
		this.dataSource = new MatTableDataSource(this.displayNew);
	}

	cacheSpan(key, accessor) {
		for (let i = 0; i < this.items.length;) {
			const currentValue = accessor(this.items[i]);
			let count = 1;

			// Iterate through the remaining rows to see how many match
			// the current value as retrieved through the accessor.
			for (let j = i + 1; j < this.items.length; j++) {
				if (currentValue !== accessor(this.items[j])) {
					break;
				}
				count++;
			}
			if (!this.spans[i]) {
				this.spans[i] = {};
			}
			// Store the number of similar values that were found (the span)
			// and skip i to the next unique row.
			this.spans[i][key] = count;
			i += count;
		}
	}

	getRowSpan(col, index) {
		return this.spans[index] && this.spans[index][col];
	}

}

