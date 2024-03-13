import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatTable, MatTableDataSource } from "@angular/material";
import { sortArray } from "app/shared/helpers/utils";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { FileExportService } from "../../../../shared/services/file.export.service";
import { Zone } from "../../models/zone.model";
import { MainProductServices } from './../../../../shared/services/main.product.service';

@Component({
	selector: "app-zones-list",
	templateUrl: "./zones-list.component.html",
	styleUrls: ["./zones-list.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ZonesListComponent implements OnInit, OnChanges {
	@Input()
	items: Zone[];
	@Output()
	onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onEdit: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onUpdateStatus: EventEmitter<Zone> = new EventEmitter<Zone>();
	@Output()
	onDrop: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild("table") table: MatTable<Zone>;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	dataSource: MatTableDataSource<Zone>;
	displayedColumns: string[] = ["description", "groupdescription", "active", "actions"];

	descriptionFilter = new FormControl();
	enusoFilter = new FormControl();
	stateFilter = new FormControl();
	filteredValues = {
		descripcion: "",
		enuso: "",
		estado: null
	};


	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;
	canSort: boolean;

	constructor(
		private confirmService: AppConfirmService,
		private permits: AccessMaping,
		private exportService: FileExportService,
		private typeService: MainProductServices) {
	}

	excelExport(e: Event) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.excelExport("Zonas",
				["Descripción", "Localizaciones", "Activo", "En Uso"], ["description", "locations", "active", "used"], this.dataSource.data);
		} else {
			this.confirmService.confirm({
				title: "Error",
				message: "No existen datos para exportar.",
				showcancel: false
			});
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.items && changes.items.currentValue) {
			this.FillData(changes.items.currentValue);
		}
	}

	private FillData(records: Zone[]) {
		let rRecords;
		if (this.typeService.getMainProduct() === 'SCTR') {
			rRecords = records;
		} else {
			rRecords = records.filter(x => x.description !== 'Nacional');
		}
		const zonasActivasGlobal = rRecords.sort(function (a, b) {
			return a.description.localeCompare(b.description);
		});

		this.dataSource = new MatTableDataSource(zonasActivasGlobal);
		this.dataSource.filterPredicate = this.feeFilterPredicate();
	}

	ubigeosDescript(z) {
		return z.locations
			.map(zZone => {
				return zZone.description;
			})
			.join("-");
	}

	ngOnInit(): void {
		this.shCreate = this.permits.ShouldDo(AppModules.zone, EActions.create);
		this.canDelete = !this.permits.ShouldDo(AppModules.zone, EActions.delete);
		this.canChange = !this.permits.ShouldDo(AppModules.zone, EActions.changestate);
		this.canSort = this.permits.ShouldDo(AppModules.zone, EActions.sort);

		this.setFilters();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["descripcion"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.enusoFilter.valueChanges.subscribe(enusoFilterValue => {
			this.filteredValues["enuso"] = enusoFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues["estado"] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: Zone, filter: string): boolean {
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

			// enuso
			const findEnUso = searchString.enuso ? searchString.enuso.toString().trim() : "";
			const resultEnUso = findEnUso === "true" ? true : false;
			const enUsoFilter = findEnUso === "" ? true : data.used === resultEnUso;

			// estado
			const findEstado = searchString.estado ? searchString.estado.toString().trim() : "";
			const resultEstado = findEstado === "true" ? true : false;
			const estadoFilter = findEstado === "" ? true : data.active === resultEstado;
			return descriptionFilter && estadoFilter && enUsoFilter;
		};
		return myFilterPredicate;
	}

	dropTable(event: CdkDragDrop<Zone[]>) {
		const zone = event.item.data;
		zone.indice = event.currentIndex;
		this.onDrop.emit(zone);
	}

	updateFilter(val: string) {
		val = val.trim(); // Remove whitespace
		val = val.toLowerCase(); // Datasource defaults to lowercase matches
		this.dataSource.filter = val;
	}

	delete(zone: any) {
		if (zone.used) {
			this.confirmService.confirm({
				title: "Error",
				message: "Esta zona se encuentra en uso, no es posible eliminarla",
				showcancel: false
			});
		} else {
			this.onDelete.emit(zone.id);
		}
	}

	edit(zone: any) {
		if (this.isDefaultNacional(zone)) {
			this.confirmService.confirm({
				title: "Error",
				message: "Esta zona no se puede editar",
				showcancel: false
			});
		} else {
			this.onEdit.emit(zone.id);
		}
	}

	enableOrDisable(zone: Zone) {
		if (!zone.active === true) {
			let exists = false;
			for (let index = 0; index < this.items.length; index++) {
				const element = this.items[index];

				for (let idx = 0; idx < zone.locations.length; idx++) {
					const ubi = zone.locations[idx];
					const find = element.locations.find(x => x.id === ubi.id);
					if (element.active) {
						if (find !== undefined) {
							exists = true;
							this.confirmService.confirm({
								title: "Error",
								message: "La (las) localización(es) seleccionada(s) ya se encuentra en uso dentro de una zona activa.",
								showcancel: false
							});
							return false;
						}
					}
				}
			}
		}
		this.onUpdateStatus.emit(zone);
	}

	saveZone(zones: Zone[]): void {
		this.onEdit.emit(zones);
	}

	isDefaultNacional(zone: Zone) {
		return zone.locations !== null && zone.locations.find(x => x.id === '999900') && zone.description === 'Nacional';
	}

}
