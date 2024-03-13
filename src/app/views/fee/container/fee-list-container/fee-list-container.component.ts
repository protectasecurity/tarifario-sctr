import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { sortArray } from "app/shared/helpers/utils";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import * as moment from "moment";
import { extendMoment } from "moment-range";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { FileExportService } from "../../../../shared/services/file.export.service";
import { FeePickerDialogComponent } from "../../../dashboard/components/fee-picker-dialog/fee-picker-dialog";
import * as feeActions from "../../_state/actions/fee.actions";
import * as fromReducer from "../../_state/reducers";
import { FeeChildDialogComponent } from "../../components/fee-child-dialog/fee-child-dialog";
import { Fee } from "../../models/fee.model";
import { TariffMatrix } from "../../models/tariffmatrix.model";
import { FeeType } from "./../../models/fee.model";

const { range } = extendMoment(moment);

@Component({
	selector: "app-fee-list-container",
	templateUrl: "./fee-list-container.component.html",
	styleUrls: ["./fee-list-container.component.css"]
})
export class FeeListContainerComponent implements OnInit {
	displayedColumns: string[];
	dataSource: MatTableDataSource<Fee>;
	dateFormat = "DD/MM/YYYY";
	items$: Observable<Fee[]> = this.store.select(fromReducer.getItems);

	descriptionFilter = new FormControl();
	iniVigFilter = new FormControl('VIGENTE');
	monedaFilter = new FormControl();
	sectorFilter = new FormControl();
	stateFilter = new FormControl('true');
	filteredValues = {
		description: "",
		iniVig: "VIGENTE",
		/* finVig: "", */
		moneda: "",
		sector: "",
		tipo: "",
		/* fecCamb: "", */
		state: "true"
	};

	locale: string = "es";
	localeLongDateFormat: string = "";
	usDateFormat: string = "DD/MM/YYYY";
	mainpath: string;

	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;
	canClone: boolean;
	createCampaing: boolean;
	viewEdit: string;
	constructor(
		public router: Router,
		private confirmService: AppConfirmService,
		private activatedRoute: ActivatedRoute,
		private store: Store<fromReducer.FeeState>,
		private permits: AccessMaping,
		private _spinner: NgxSpinnerService,
		public dialog: MatDialog,
		private exportService: FileExportService
	) {
		this.displayedColumns = ["description", "startDate", "endDate", "currency", "target", "changeDate", "effectDate", "state", "asociated", "actions"];
		this.items$.subscribe(arr => {
			const tmp = sortArray(
				arr.filter(x => x.type === "BASE"),
				"updatedAt",
				-1
			);
			this.dataSource = new MatTableDataSource(tmp);
			this.dataSource.filterPredicate = this.feeFilterPredicate();
			this.loadInitData();
		});
		this.setFilters();
	}

	ngOnInit() {
		moment.locale("es");
		this.store.dispatch(new feeActions.Load());
		this._spinner.hide();
		this.shCreate = this.permits.ShouldDo(AppModules.fee, EActions.create);
		this.viewEdit = this.shCreate ? "Modificar" : "Ver";
		this.canChange = this.permits.ShouldDo(AppModules.fee, EActions.changestate);
		this.canDelete = this.permits.ShouldDo(AppModules.fee, EActions.delete);
		this.canClone = this.permits.ShouldDo(AppModules.fee, EActions.clone);
		this.createCampaing = this.permits.ShouldDo(AppModules.fee, EActions.createcampaing);
	}

	loadInitData() {
		this.filteredValues["state"] = 'true';
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}

	changeStatus(item: Fee) {
		item.state = !item.state;
		const tariffMatrix: TariffMatrix = new TariffMatrix(null);
		tariffMatrix.isActive = item.state;
		tariffMatrix.id = item.idTarifa;
		this.store.dispatch(new feeActions.UpdateFee(tariffMatrix));
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["description"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.iniVigFilter.valueChanges.subscribe(iniVigFilterValue => {
			this.filteredValues["iniVig"] = iniVigFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.monedaFilter.valueChanges.subscribe(monedaFilterValue => {
			this.filteredValues["moneda"] = monedaFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.sectorFilter.valueChanges.subscribe(sectorFilterValue => {
			this.filteredValues["sector"] = sectorFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues["state"] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: Fee, filter: string): boolean {
			const searchString = JSON.parse(filter);
			const findDescript = searchString.description
				? searchString.description
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

			// Vigencia
			let iniVigFilter = true;
			if (searchString.iniVig === 'VIGENTE') {
				iniVigFilter = range(moment(data.startDate, 'DD-MM-YYYY'),
					moment(data.endDate ? data.endDate : '01-01-2050', 'DD-MM-YYYY'))
					.contains(moment(moment(new Date()).format('MM/DD/YYYY')));
			} else if (searchString.iniVig === 'NOVIGENTE') {
				iniVigFilter = !range(moment(data.startDate, 'DD-MM-YYYY'),
					moment(data.endDate ? data.endDate : '01-01-2050', 'DD-MM-YYYY'))
					.contains(moment(moment(new Date()).format('MM/DD/YYYY')));
			}

			// moneda
			const findMoneda = searchString.moneda ? searchString.moneda.toString().trim() : "";
			const currencyFilter = findMoneda === "" ? true : data.currency.toString().trim() === findMoneda;

			// sector
			const findSector = searchString.sector ? searchString.sector.toString().trim() : "";
			const sectorFilter = findSector === "" ? true : data.target.toString().trim() === findSector;

			// estado
			const findEstado = searchString.state ? searchString.state.toString().trim() : "";
			const resultEstado = findEstado === "true" ? true : false;
			const estadoFilter = findEstado === "" ? true : data.state === resultEstado;

			return descriptionFilter && iniVigFilter && currencyFilter && sectorFilter && estadoFilter;
		};
		return myFilterPredicate;
	}

	formReset() {
		this.descriptionFilter.reset();
		this.iniVigFilter.reset();
		this.monedaFilter.reset();
		this.sectorFilter.reset();
		this.stateFilter.reset();
	}

	getType(type: any) {
		return FeeType[type];
	}

	viewFee(fee: Fee) {
		this._spinner.show();
		this.router.navigate([`/fee/details/${fee.idTarifa}`], { skipLocationChange: true });
	}

	clone(fee: Fee) {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de clonar el tarifario seleccionado?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/fee/clone/${fee.idTarifa}`], { skipLocationChange: true });
				}
			});
	}

	createchild(fee: Fee) {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de crear una campaña en base al tarifario seleccionado?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/fee/campaign/${fee.idTarifa}`], { skipLocationChange: true });
				}
			});
	}

	createspecial(fee: Fee) {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de crear un tarifario de canal?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/fee/campaign/${fee.idTarifa}`]);
				}
			});
	}

	deletefee(fee: Fee) {
		const n = fee.derivedChilds === undefined ? 0 : fee.derivedChilds.length;
		if (n > 0) {
			this.confirmService.confirm({ title: "Error", message: "El tarifario cuenta con tarifarios hijos asociados.", showcancel: false });
			return;
		} else {
			this.confirmService
				.confirm({
					title: "Confirmación",
					message: "¿Está seguro de eliminar la tarifa seleccionada?",
					showcancel: true
				})
				.subscribe(x => {
					if (x === true) {
						this.store.dispatch(new feeActions.DeleteFee(fee.idTarifa));
					}
				});
		}
	}

	getRouteParams(fee: Fee): object {
		return {
			queryParams: { key: fee.idTarifa },
			queryParamsHandling: "merge"
		};
	}

	excelExport(e: Event) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.excelExport(
				"TarifarioBase",
				["Descripción", "Inicio Vigencia", "Fin Vigencia", "Moneda", "Sector", "Tipo de Tarfa", "Fecha Cambio", "Activo", "Asociado"],
				["description", "startDate", "endDate", "currency", "target", "type", "updatedAt", "state", "premiumbase"],
				this.dataSource.data
			);
		} else {
			this.confirmService.confirm({
				message: "No existen datos para exportar.",
				title: "Error",
				showcancel: false
			});
		}
	}

	openFeePicker(fee: Fee) {
		const dialogRef = this.dialog.open(FeeChildDialogComponent, {
			width: "1000px",
			disableClose: false,
			autoFocus: false,
			data: { feeList: fee.derivedChilds, isbase: false }
		});
	}
}
