import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { ofType } from "@ngrx/effects";
import { ActionsSubject, Store } from "@ngrx/store";
import { sortArray } from "app/shared/helpers/utils";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { Brand } from "../../../../shared/models/brand.model";
import { Class } from "../../../../shared/models/class.model";
import { Model } from "../../../../shared/models/model.model";
import { IPersonType } from "../../../../shared/models/person-type.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from "../../../../shared/models/use.model";
import { ManageChannelCreatePopupComponent } from "../../../manage-channel/container/manage-channel-create-popup/manage-channel-create-popup.component";
import { NewAgent } from "../../../manage-channel/models/NewAgent";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import * as feeActions from "../../_state/actions/fee.actions";
import * as fromReducer from "../../_state/reducers";
import { IFeeSearch } from "../../models/fee.model";
import { IPlateSearch } from "./../../models/fee.model";

@Component({
	selector: "app-fee-search",
	templateUrl: "./fee-search.component.html",
	styleUrls: ["./fee-search.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class FeeSearchComponent implements OnInit, OnDestroy {
	didSearch: boolean;
	dataSource: MatTableDataSource<IFeeSearch>;
	displayedColumnsChannel: string[] = ['id', 'description', 'acciones'];
	showRenovations: boolean;
	displayedColumnsNotReno: string[] = ["id", "tariff", "tipo", "sector",
		"fisicoP", "digitalP", "fisicoCB", "digitalCB",
		"fisicoCI", "digitalCI", "fisicoCPV", "digitalCPV",
		"fisicoGrossUpCB", "digitalGrossUpCB", "fisicoGrossUpCI", "digitalGrossUpCI"];
	displayedColumnsReno: string [] = ["id", "tariff", "tipo", "sector",
		"fisicoRenovaP", "digitalRenovaP", "fisicoRenovaCB", "digitalRenovaCB",
		"fisicoRenovaCI", "digitalRenovaCI", "fisicoRenovaCPV", "digitalRenovaCPV"];
	headersTableNotGrossUp: string [] = [
		'header-row-zero-group',
		'header-row-one-group',
		'header-row-two-group',
		'header-row-three-group',
		'header-row-four-group',
		'header-row-five-group',
		'header-row-six-group',
		'header-row-seven-group'

	];
	headersTable: string [] = [
		...this.headersTableNotGrossUp,
		'header-row-eight-group',
		'header-row-nine-group'

	];
	displayedHeaders: string [] = this.headersTable;
	displayedColumns: string[] = this.displayedColumnsNotReno;
	cantColSpan: number;

	mydata: any[] = [];
	dataSourceChannel = new MatTableDataSource<any>();

	fee$: Observable<any[]> = this.store.select(fromReducer.getFeeSearch);
	plate$: Observable<IPlateSearch> = this.store.select(fromReducer.getPlateSearch);

	uses$: Observable<Use[]> = this.store.select(fromReducer.getUses);
	personTypes$: Observable<IPersonType[]> = this.store.select(fromReducer.getPersonTypes);
	classes$: Observable<UseClass[]> = this.store.select(fromReducer.getClassesByUse);

	locations$: Observable<Ubigeo[]> = this.store.select(fromReducer.getDepartments);
	departments$: Ubigeo[] = [];
	provinceRaw: Ubigeo[] = [];
	optionsDepartament: Ubigeo[] = [];
	optionsProvince: Ubigeo[] = [];
	province$: Ubigeo[] = [];

	private _onDestroy = new Subject<void>();

	brands$: Observable<Brand[]> = this.store.select(fromReducer.getBrandsByClass);
	brands: Brand[] = [];
	public marcaFiltroCtrl: FormControl = new FormControl();
	public marcaFind: Number;
	public modeloFind: Number;

	public marcaSeleccionada: ReplaySubject<Brand[]> = new ReplaySubject<Brand[]>(1);

	models$: Observable<Model[]> = this.store.select(fromReducer.getModelsByBrandsByClass);
	models: Model[] = [];
	public modeloFiltroCtrl: FormControl = new FormControl();
	public modeloSeleccionada: ReplaySubject<Brand[]> = new ReplaySubject<Brand[]>(1);
	classes: Class[] = [];

	protected ngUnsubscribe: Subject<any> = new Subject<any>();

	registerForm: FormGroup;

	constructor(
		public dialog: MatDialog,
		private confirmService: AppConfirmService,
		private actionsSubject$: ActionsSubject,
		private _spinner: NgxSpinnerService,
		private store: Store<fromReducer.FeeState>,
		private formBuilder: FormBuilder,
		public cd: ChangeDetectorRef
	) {
		this.didSearch = false;
		this.showRenovations = false;
		this.cantColSpan = 2;
		this.registerForm = this.formBuilder.group({
			txtIniVig: ['', Validators.required],
			ddlCurrency: ['', Validators.required],
			txtRegist: ['', [Validators.minLength(6)]],
			ddlUse: ['', [Validators.required]],
			ddlClass: ['', [Validators.required]],
			ddlMarca: ['', [Validators.required]],
			ddlModelo: ['', [Validators.required]],
			txtSeats: ['', Validators.required],
			ddlPersonType: ['', Validators.required],
			ddlDepartment: ['', Validators.required],
			ddlProvince: ['', Validators.required],
			renovaciones: ['']
		});

		this.registerForm.get('txtIniVig').setValue(moment());
		this.registerForm.get('ddlCurrency').setValue('PEN');
		this.registerForm.get('ddlPersonType').setValue(1);

		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(feeActions.FeeActionTypes.LoadFeeSearchComplete))
			.subscribe(() => {
				this._spinner.hide();
			});

		this.fee$.subscribe(e => {
			const arr = [];
			if (e.length > 0) {
				for (let index = 0; index < e.length; index++) {
					const element = e[index];
					for (let idx = 0; idx < element.length; idx++) {
						const childElement = JSON.parse(JSON.stringify(element[idx]));
						childElement.idChannel = index + 1;
						if (childElement.type === "SPECIAL") {
							childElement.type = "CANAL";
						} else {
							childElement.type = "CAMPAÑA";
						}
						childElement.target = childElement.target === "PRIVATE" ? "Privado" : "P&uacuteblico";
						arr.push(childElement);
					}
				}
				if (arr.length > 0) {
					this.dataSource = new MatTableDataSource(arr);
				}
			}
			if (arr.length === 0 && this.didSearch) {
				this.didSearch = false;
				this.confirmService.confirm({ title: "Error", message: "No existen primas/comisiones para la consulta realizada.", showcancel: false });
				return;
			}

		});

		this.plate$.subscribe(e => {
			this._spinner.hide();
			if (e !== null) {
				this.registerForm.get('ddlUse').setValue(e.vehicleUse.id);
				this.registerForm.get('ddlClass').setValue(e.vehicleClass.id);
				this.marcaFind = Number(e.vehicleBrand.id);
				const tmpbrands = [];
				tmpbrands.push({ description: e.vehicleBrand.description, id: e.vehicleBrand.id });
				this.printBrands(tmpbrands);
				this.registerForm.get('ddlMarca').setValue(this.marcaFind);
				this.modeloFind = Number(e.vehicleModel.id);
				const tmpmodels = [];
				tmpmodels.push({ description: e.vehicleModel.description, id: e.vehicleModel.id });
				this.printModels(tmpmodels);
				this.registerForm.get('ddlModelo').setValue(this.modeloFind);
			}
		});
		this.classes$.subscribe(c => {
			this._spinner.hide();
			c.forEach(value => {
				if (value.status === 'ACTIVE') {
					this.classes.push(value.clazz);
				}
			});
			this.registerForm.get('ddlClass').setValue(this.classes);
		});

	}


	loadBrands(id) {
		this.brands$.subscribe(e => {
			this.printBrands(e);
		});
	}

	printBrands(e) {
		this.brands = sortArray(e, "description", 1);
		this.marcaSeleccionada.next(this.brands.slice());
		this.marcaFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this.filtrarMarcas();
		});
		this._spinner.hide();
		this.cd.markForCheck();
	}

	loadModels(id) {
		this.models$.subscribe(e => {
			this.printModels(e);
		});
	}

	printModels(e) {
		this.models = sortArray(e, "description", 1);
		this.modeloSeleccionada.next(this.models.slice());
		this.modeloFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this.filtrarModelos();
		});
		this._spinner.hide();
		this.cd.markForCheck();
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
		this.cd.markForCheck();
	}

	private filtrarModelos() {
		if (!this.models) {
			return;
		}
		let search = this.modeloFiltroCtrl.value;
		if (!search) {
			this.modeloSeleccionada.next(this.models.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.modeloSeleccionada.next(this.models.filter(model => model.description.toLowerCase().indexOf(search) > -1));
		this.cd.markForCheck();
	}

	searchPlate() {
		const plate = this.getFormValues().txtRegist.toString().toLocaleUpperCase().trim();
		if (plate === '') {
			this.confirmService.confirm({ title: "Error", message: "Ingrese una placa.", showcancel: false });
			return;
		}
		if (plate.length < 6) {
			this.confirmService.confirm({ title: "Error", message: "Ingrese mínimo 6 caracteres.", showcancel: false });
			return;
		}
		this.store.dispatch(new feeActions.LoadPlateSearch(plate));
		this.cd.markForCheck();
	}

	searchData() {
		this.dataSource = new MatTableDataSource();
		if (this.mydata.length === 0) {
			this.confirmService.confirm({ title: "Error", message: "Seleccione al menos 1 canal.", showcancel: false }).subscribe(() => {
				this.addChannels();
			});
			return;
		}

		const json = {
			queryDate: this.getFormValues().txtIniVig.toISOString(),
			brokerId: null,
			intermediaId: null,
			salesPointId: null,
			clientId: null,
			zipCode: this.getFormValues().ddlProvince,
			useId: this.getFormValues().ddlUse,
			classId: this.getFormValues().ddlClass,
			brandId: this.getFormValues().ddlMarca,
			modelId: this.getFormValues().ddlModelo,
			seats: this.getFormValues().txtSeats,
			personType: this.getFormValues().ddlPersonType,
			currency: this.getFormValues().ddlCurrency,
			isDigital: null,
			isRenovation: null
		};

		const searchQuery = [];
		for (let index = 0; index < this.mydata.length; index++) {
			const element = this.mydata[index];
			const baseP = JSON.parse(JSON.stringify(json));
			baseP.brokerId = element.brokerId;
			baseP.intermediaId = element.intermediaId;
			baseP.salesPointId = element.salespointId;
			baseP.clientId = element.clientId;
			searchQuery.push(baseP);
		}
		this._spinner.show();
		this.didSearch = true;
		this.store.dispatch(new feeActions.LoadFeeSearch(searchQuery));
		this.cd.markForCheck();
	}

	getFormValues() {
		return this.registerForm.value;
	}

	loadBrandsByClass() {
		this._spinner.show();
		this.brands = [];
		this.models = [];
		const mClass = this.registerForm.value.ddlClass;
		this.store.dispatch(new feeActions.LoadBrandsByClass(mClass));
		this.cd.markForCheck();
	}

	loadClassesByUse() {
		this._spinner.show();
		this.classes = [];
		const idUse: string = this.registerForm.value.ddlUse;
		this.store.dispatch(new feeActions.LoadClassesByUse(idUse));
		this.cd.markForCheck();
	}

	loadModelByBrandsByClass() {
		this._spinner.show();
		this.models = [];
		this.registerForm.get('ddlModelo').reset();
		this.store.dispatch(new feeActions.LoadModelByBrandsByClass(this.getFormValues().ddlClass, this.getFormValues().ddlMarca));
		this.cd.markForCheck();
	}

	loadProvincesBydepartment(setdefault: boolean) {
		this.registerForm.get('ddlProvince').reset();
		this.optionsProvince = this.provinceRaw.filter(o => o["parent"] === this.getFormValues().ddlDepartment);
		this.province$ = sortArray(this.optionsProvince, "description", 1);

		if (setdefault) {
			this.registerForm.get('ddlProvince').setValue('150100');
		}
		this.cd.markForCheck();
	}

	get havePlateValue() {
		const mplate = this.getFormValues().txtRegist;
		if (mplate.toString() === '') {
			return true;
		}
		return false;
	}

	ngOnInit() {
		this.store.dispatch(new feeActions.LoadUses());
		this.store.dispatch(new feeActions.LoadPersonTypes());
		this.store.dispatch(new feeActions.LoadDepartments());

		this.locations$.subscribe(o => {
			o.map(d => {
				if (d["type"] === "DEPARTMENT") {
					this.optionsDepartament.push(d);
				} else {
					this.provinceRaw.push(d);
				}
			});
			this.departments$ = this.optionsDepartament;

			this.registerForm.get('ddlDepartment').setValue('150000');
			this.loadProvincesBydepartment(true);
		});

		this.loadBrands(null);
		this.loadModels(null);
		this.cd.markForCheck();
	}

	addChannels() {
		const dialogRef = this.dialog.open(ManageChannelCreatePopupComponent, {
			width: "970px"
		});

		const strBase = 'Broker: *B* <br />Intermediario: *I* <br /> PV: *P* <br /> Cliente: *C*';

		const dataBase = this.mydata;

		dialogRef.afterClosed().subscribe((result: NewAgent[]) => {
			if (result) {

				const baseJson = {
					id: 1,
					brokerId: '',
					intermediaId: '',
					salespointId: '',
					clientId: '',
					name: strBase,
					add: false
				};

				result.forEach(a => {
					switch (a.type) {
						case "BROKER":
							baseJson.brokerId = a.id;
							baseJson.name = baseJson.name.replace('*B*', a.description);
							break;
						case "MIDDLEMAN":
							baseJson.intermediaId = a.id;
							baseJson.name = baseJson.name.replace('*I*', a.description);
							break;
						case "POINT_OF_SALE":
							baseJson.salespointId = a.id;
							baseJson.name = baseJson.name.replace('*P*', a.description);
							break;
						case "CUSTOMER":
							baseJson.clientId = a.id;
							baseJson.name = baseJson.name.replace('*C*', a.description);
							break;
					}
				});
				baseJson.id = dataBase.length + 1;

				let exists = false;
				if (dataBase.length > 0) {

					const fnd = dataBase.filter(
						x => x.brokerId === baseJson.brokerId &&
							x.intermediaId === baseJson.intermediaId &&
							x.salespointId === baseJson.salespointId &&
							x.clientId === baseJson.clientId
					);

					if (fnd.length > 0) {
						exists = true;
					}
				}
				exists = false;
				if (exists) {
					this.confirmService.confirm({ title: "Error", message: "Canal existente.", showcancel: false });
					return;
				} else {
					baseJson.name = baseJson.name.replace('*B*', '-');
					baseJson.name = baseJson.name.replace('*I*', '-');
					baseJson.name = baseJson.name.replace('*P*', '-');
					baseJson.name = baseJson.name.replace('*C*', '-');
					this.mydata.push(baseJson);
					this.populateChannel();
				}
			}
		});
	}

	removeChannel(id) {
		const index = this.mydata.indexOf(id);
		if (index !== -1) {
			this.mydata.splice(index, 1);
		}
		this.populateChannel();
	}

	populateChannel() {

		for (let index = 0; index < this.mydata.length; index++) {
			const element = this.mydata[index];
			element.id = index + 1;
		}

		this.dataSourceChannel.data = this.mydata;
		this.dataSource = new MatTableDataSource();
	}


	resetFormData() {
		this.registerForm.reset();
		this.ngOnInit();
		this.registerForm.get('ddlMarca').reset();
		this.cd.markForCheck();
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}
	filterRenova () {
		this.displayedColumns =  this.showRenovations ? this.displayedColumnsReno : this.displayedColumnsNotReno;
		this.displayedHeaders = this.showRenovations ? this.headersTableNotGrossUp : this.headersTable;
	}
}
