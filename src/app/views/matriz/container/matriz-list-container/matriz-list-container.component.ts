import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material";
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
import { FeeType } from "../../../fee/models/fee.model";
import { MatrizRiesgo } from "../../models/matriz.model";
import * as matrizActions from "../../state/actions/matriz.actions";
import * as fromReducer from "../../state/reducers";

const { range } = extendMoment(moment);

@Component({
	selector: "app-matriz-list-container",
	templateUrl: "./matriz-list-container.component.html",
	styleUrls: ["./matriz-list-container.component.scss"]
})
export class MatrizListContainerComponent implements OnInit {

	displayedColumns: string[];
	dataSource: MatTableDataSource<MatrizRiesgo>;
	dateFormat = "DD/MM/YYYY";
	items$: Observable<MatrizRiesgo[]>;

	descriptionFilter = new FormControl();
	iniVigFilter = new FormControl();
	monedaFilter = new FormControl();
	tipoFilter = new FormControl();
	stateFilter = new FormControl();
	filteredValues = {
		description: "",
		iniVig: "",
		moneda: "",
		tipo: "",
		state: ""
	};
	locale: string = "es";
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
		private store: Store<fromReducer.MatrizState>,
		private permits: AccessMaping,
		private _spinner: NgxSpinnerService,
		private exportService: FileExportService
	) {
		this.items$ = this.store.select(fromReducer.getItems);
	}

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.matriz, EActions.create);
		this.viewEdit = this.shCreate ? "Modificar" : "Ver";
		this.canChange = this.permits.ShouldDo(AppModules.matriz, EActions.changestate);
		this.canDelete = this.permits.ShouldDo(AppModules.matriz, EActions.delete);
		this.canClone = this.permits.ShouldDo(AppModules.matriz, EActions.clone);
		this.createCampaing = this.permits.ShouldDo(AppModules.matriz, EActions.createcampaing);
		moment.locale("es");
		this.displayedColumns = ["description", "startDate", "endDate", "currency", "type", "changeDate", "state", "asociated", "actions"];
		this.store.dispatch(new matrizActions.LoadM());
		this.items$.subscribe(arr => {
			const mainpath = this.activatedRoute.snapshot.url[0].path;
			let matrices;
			if (mainpath === "list") {
				matrices = arr.filter(x => x.type === "BASE");
			} else {
				matrices = arr.filter(x => x.type !== "BASE");
			}
			const tmp = sortArray(matrices, "updatedAt", -1);
			this.dataSource = new MatTableDataSource(tmp);
			this.dataSource.filterPredicate = this.feeFilterPredicate();
		});

		this.setFilters();
	}

	changeStatus(item: MatrizRiesgo) {
		item.isActive = !item.isActive;
		this.store.dispatch(new matrizActions.LoadMatrizUpdates(item));
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

		this.tipoFilter.valueChanges.subscribe(tipoFilterValue => {
			this.filteredValues["tipo"] = tipoFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues["state"] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: MatrizRiesgo, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
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

			// inicio Vigencia
			let iniVigFilter = true;
			if (moment(searchString.iniVig).isValid()) {
				iniVigFilter = range(moment(data.startDate, "DD-MM-YYYY"), moment(data.endDate ? data.endDate : "01-01-2050", "DD-MM-YYYY")).contains(
					moment(moment(searchString.iniVig).format("MM/DD/YYYY"))
				);
			}

			// moneda
			const findMoneda = searchString.moneda ? searchString.moneda.toString().trim() : "";
			const currencyFilter = findMoneda === "" ? true : data.currency.toString().trim() === findMoneda;

			// tipo
			const findTipo = searchString.tipo ? searchString.tipo.toString().trim() : "";
			const tipoFilter = findTipo === "" ? true : data.type.toString().trim() === findTipo;

			// estado
			const findEstado = searchString.state ? searchString.state.toString().trim() : "";
			const resultEstado = findEstado === "true";
			const estadoFilter = findEstado === "" ? true : data.isActive === resultEstado;

			return descriptionFilter && iniVigFilter && currencyFilter && estadoFilter && tipoFilter;
		};
		return myFilterPredicate;
	}

	formReset() {
		this.descriptionFilter.reset();
		this.iniVigFilter.reset();
		this.monedaFilter.reset();
		this.tipoFilter.reset();
		this.stateFilter.reset();
	}

	getType(type: any) {
		return FeeType[type];
	}

	viewFee(matriz: MatrizRiesgo) {
		this._spinner.show();
		this.router.navigate([`/matriz/details/${matriz.id}`]);
	}

	clone(matriz: MatrizRiesgo) {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de clonar el tarifario seleccionado?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/matriz/clone/${matriz.id}`]);
				}
			});
	}

	createchild(matriz: MatrizRiesgo) {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de crear una campaña en base al tarifario seleccionado?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/matriz/campaign/${matriz.id}`]);
				}
			});
	}

	deletefee(matriz: MatrizRiesgo) {
		const n = matriz.derivedTariffMatrices === undefined ? 0 : matriz.derivedTariffMatrices.length;
		if (n > 0) {
			this.confirmService.confirm({ title: "Error", message: "El tarifario cuenta taconrifarios hijos asociados.", showcancel: false });
			return;
		}

		if (matriz.isActive) {
			this.confirmService.confirm({ title: "Error", message: "El tarifario se encuentra activo", showcancel: false });
			return;
		}
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de eliminar la tarifa seleccionada?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new matrizActions.DeleteMatriz(matriz.id));
				}
			});
	}

	excelExport(e) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.excelExport("Lista de Tarifas",
				["Descripción", "Inicio Vigencia", "Fin Vigencia", "Moneda", "Tipo de Tarifa", "Fecha Cambio", "Estado"],
				["description", "startDate", "endDate", "currency", "type", "effectDate", "isActive"], this.dataSource.data);
		} else {
			this.confirmService.confirm({
				title: "Error",
				message: "No existen datos para exportar.",
				showcancel: false
			});
		}
	}
}
