import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { ActionsSubject, Store } from "@ngrx/store";
import { isNullOrUndefined } from '@swimlane/ngx-datatable/release/utils';
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { sortArray } from "../../../../shared/helpers/utils";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { Actividades } from "../../../actividades/models/Actividades";
import { ManageChannelCreatePopupTkComponent } from "../../../manage-channel/container/manage-channel-create-popup/manage-channel-create-popup.tk.component";
import { NewAgent } from "../../../manage-channel/models/NewAgent";
import { Parameter } from "../../../parameters/models/parameter.model";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import * as matrizActions from "../../state/actions/matriz.actions";
import * as fromReducer from "../../state/reducers";


class MatrizSearchData {

	id: string;
	tariff: string;
	field: string;
	areaGroup: string;
	activityGroup: string;
	activityVariation: string;
	enterprise: {
		size: string;
		minimumPremium: number;
		minimumPremiumEndoso: number;
		netRate: Array<{
			id: string;
			description: string;
			premium: number;
		}>
	};
	broker: number;
	broker1: number;
	midleman: number;
	salesPoint: number;
	discount: number;
	commission: number;


	constructor(data: any) {
		this.field = data.field;
		this.areaGroup = data.areaGroup;
		this.activityGroup = data.activityGroup;
		this.discount = data.discount;
		this.commission = data.commission;
		this.tariff = data.tariff;
		this.activityVariation = data.activityVariation;
	}
}

@Component({
	selector: "app-matriz-search",
	templateUrl: "./matriz-search.component.html",
	styleUrls: ["./matriz-search.component.scss"]
})
export class MatrizSearchComponent implements OnInit {
	mydata: any[] = [];
	visibleTable: boolean = false;
	dataSourceChannel = new MatTableDataSource<any>();
	dataSource$: Observable<any[]> = this.store.select(fromReducer.getPremiun);
	dataSource = new MatTableDataSource<any>();
	displayedColumns: string[] = [];
	displayedColumnsChannel: string[] = ["id", "description", "acciones"];

	locations$: Observable<Ubigeo[]> = this.store.select(fromReducer.getDepartments);
	departments$: Ubigeo[] = [];
	actividades$: Observable<Actividades[]> = this.store.select(fromReducer.getActividades);
	optionsActividades: Actividades[] = [];
	parameters$: Observable<Parameter[]> = this.store.select(fromReducer.getParameter);
	parameters: Parameter[] = [];
	provinceRaw: Ubigeo[] = [];
	optionsDepartament: Ubigeo[] = [];
	optionsProvince: Ubigeo[] = [];
	province$: Ubigeo[] = [];
	colSpanTasa = 0;
	colSpanDescuentos = 4;
	registerForm: FormGroup;

	constructor(public dialog: MatDialog,
		private confirmService: AppConfirmService,
		private actionsSubject$: ActionsSubject,
		private _spinner: NgxSpinnerService,
		private store: Store<fromReducer.MatrizState>,
		private formBuilder: FormBuilder) {
		this.registerForm = this.formBuilder.group({
			txtIniVig: ["", Validators.required],
			ddlCurrency: ["", Validators.required],
			ddlDepartment: ["", Validators.required],
			ddlActividad: ["", Validators.required],
			ddlEmpresa: ["", Validators.required],
			ddlProvince: ["", Validators.required]
		});

		this.registerForm.get("txtIniVig").setValue(moment());
		this.registerForm.get("ddlCurrency").setValue("PEN");
	}


	ngOnInit() {
		this.store.dispatch(new matrizActions.LoadDepartments());
		this.store.dispatch(new matrizActions.LoadActividades());
		this.store.dispatch(new matrizActions.LoadParameters());

		this.actividades$.subscribe(a => {
			a.map(d => {
				this.optionsActividades.push(d);
			});
		});

		this.locations$.subscribe(o => {
			o.map(d => {
				if (d["type"] === "DEPARTMENT") {
					this.optionsDepartament.push(d);
				} else {
					this.provinceRaw.push(d);
				}
			});
			this.departments$ = this.optionsDepartament;

			this.registerForm.get("ddlDepartment").setValue("150000");
			this.loadProvincesBydepartment(true);
		});

		this.parameters$.subscribe(o => {
			this.parameters = o.filter(d => (d.isActive) && (d.type === "WORKER_TYPE"));
			const workers = this.parameters.map(a => a.description);
			if (workers.length !== 0) {
				this.colSpanTasa = workers.length;
				this.displayedColumns = [];
				this.displayedColumns = this.displayedColumns.concat(
					["id", "tariff", "field", "areaGroup", "minimum", "minimumEndoso", "variation"], workers,
					["commission", "discount", "broker", "midleman"]);
			}
		});

		this.dataSource$.subscribe(o => this.processDataSource(o));
	}

	getFormValues() {
		return this.registerForm.value;
	}

	loadProvincesBydepartment(setdefault: boolean) {
		this.registerForm.get("ddlProvince").reset();
		this.optionsProvince = this.provinceRaw.filter(o => o["parent"] === this.getFormValues().ddlDepartment);
		this.province$ = sortArray(this.optionsProvince, "description", 1);

		if (setdefault) {
			this.registerForm.get("ddlProvince").setValue("150100");
		}
	}

	addChannels() {
		const dialogRef = this.dialog.open(ManageChannelCreatePopupTkComponent, {
			width: "970px"
		});

		const strBase = "Broker: *B* <br />Intermediario: *I* <br /> PV: *P* <br /> Cliente: *C*";
		const strBaseBB = "Broker: *B* <br />Broker: *B1* <br />Intermediario: *I* <br /> PV: *P* <br /> Cliente: *C*";

		const dataBase = this.mydata;

		dialogRef.afterClosed().subscribe((result: NewAgent[]) => {
			if (result) {

				const baseJson = {
					id: 1,
					brokerId: "",
					brokerId1: "",
					middlemanId: "",
					salespointId: "",
					clientId: "",
					name: strBase,
					add: false
				};
				if (result.length > 1) {
					result[0].type === result[1].type ? baseJson.name = strBaseBB : baseJson.name = strBase;
				}

				result.forEach((a, i) => {
					switch (a.type) {
						case "BROKER":
							if (i === 0) {
								baseJson.brokerId = a.id;
								baseJson.name = baseJson.name.replace("*B*", a.description);
							} else {
								baseJson.brokerId1 = a.id;
								baseJson.name = baseJson.name.replace("*B1*", a.description);
								const last = this.displayedColumns.length - 1;
								this.displayedColumns.splice(last, 0, "broker1");
								this.colSpanDescuentos = this.colSpanDescuentos + 1;
							}
							break;
						case "MIDDLEMAN":
							baseJson.middlemanId = a.id;
							baseJson.name = baseJson.name.replace("*I*", a.description);
							break;
						case "POINT_OF_SALE":
							baseJson.salespointId = a.id;
							baseJson.name = baseJson.name.replace("*P*", a.description);
							break;
						case "CUSTOMER":
							baseJson.clientId = a.id;
							baseJson.name = baseJson.name.replace("*C*", a.description);
							break;
					}
				});
				baseJson.id = dataBase.length + 1;

				let exists = false;
				if (dataBase.length > 0) {

					const fnd = dataBase.filter(
						x => x.brokerId === baseJson.brokerId && x.brokerId1 === baseJson.brokerId1 &&
							x.middlemanId === baseJson.middlemanId &&
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
					baseJson.name = baseJson.name.replace("*B*", "-");
					baseJson.name = baseJson.name.replace("*I*", "-");
					baseJson.name = baseJson.name.replace("*P*", "-");
					baseJson.name = baseJson.name.replace("*C*", "-");
					this.mydata.push(baseJson);
					this.populateChannel();
				}
			}
		});
	}

	searchData() {
		this.dataSource = new MatTableDataSource();
		if (this.mydata.length === 0) {
			this.confirmService.confirm({ title: "Error", message: "Seleccione al menos 1 canal.", showcancel: false }).subscribe(() => {
				this.addChannels();
			});
			return;
		}

		const list: any[] = [];
		this.mydata.forEach(c => {

			const json = {
				queryDate: this.getFormValues().txtIniVig.toISOString(),
				zipCode: this.getFormValues().ddlProvince,
				activity: this.getFormValues().ddlActividad,
				workers: this.getFormValues().ddlEmpresa,
				currency: this.getFormValues().ddlCurrency,
				channel: []
			};

			Object.keys(c).forEach(k => {
				switch (k) {
					case "brokerId":
						if (c[k] !== "") {
							json.channel.push({ brokerId: c[k] });
						}
						break;
					case "brokerId1":
						if (c[k] !== "") {
							json.channel.push({ brokerId: c[k] });
						}
						break;
					case "middlemanId":
						if (c[k] !== "") {
							json.channel.push({ middlemanId: c[k] });
						}
						break;
					case "salespointId":
						if (c[k] !== "") {
							json.channel.push({ salespointId: c[k] });
						}
						break;
					case "clientId":
						if (c[k] !== "") {
							json.channel.push({ clientId: c[k] });
						}
						break;
				}
			});

			list.push(json);
		});
		this._spinner.show();
		this.visibleTable = true;
		this.store.dispatch(new matrizActions.LoadGetPremiun(list));
	}

	removeChannel(id) {
		const index = this.mydata.indexOf(id);
		if (index !== -1) {
			this.mydata.splice(index, 1);
			const bb = this.mydata.filter(d => d.brokerId1 !== "");
			const pos = this.displayedColumns.indexOf("broker1");
			if (bb.length === 0 && pos !== -1) {
				this.displayedColumns.splice(pos, 1);
			}
		}
		this.populateChannel();
	}

	populateChannel() {

		for (let index = 0; index < this.mydata.length; index++) {
			const element = this.mydata[index];
			element.id = index + 1;
		}

		this.dataSourceChannel.data = this.mydata;
	}

	processDataSource(data: any) {
		const result: MatrizSearchData[] = [];
		data.forEach((w, i) => {
			if (w.hasOwnProperty("fields")) {
				w["fields"].forEach(d => {
					d.enterprise.forEach(e => {
						const base: MatrizSearchData = new MatrizSearchData(d);
						base.id = i + 1;
						base.enterprise = {
							size: e["size"],
							minimumPremium: e["minimumPremium"],
							minimumPremiumEndoso: e["minimumPremiumEndoso"],
							netRate: []
						};
						this.parameters.forEach(p => {

							if (!isNullOrUndefined(e["netRate"])) {
								const val = e["netRate"].find(f => f.description === p.description);
								if (val) {
									base.enterprise.netRate.push(val);
								} else {
									base.enterprise.netRate.push({
										id: p.id,
										description: p.description,
										premium: 0
									});
								}
							}

						});

						d["channels"].forEach((a, j) => {
							if (!isNullOrUndefined(d["channelDistributions"])) {
								const resultC = d["channelDistributions"].find(f => f.roleId === a.roleId);
								switch (a.roleType) {
									case "BROKER":
										if (resultC && j === 0 && a.roleDescription !== "DIRECTOS") {
											base.broker = resultC["distribution"];
										} else if (resultC && a.roleDescription !== "DIRECTOS") {
											base.broker1 = resultC["distribution"];
										}
										break;
									case "MIDDLEMAN":
										if (resultC) {
											base.midleman = resultC["distribution"];
										}
										break;
									case "POINT_OF_SALE":
										if (resultC) {
											base.salesPoint = resultC["distribution"];
										}
										break;
								}
							}
						});
						result.push(base);
					});
				});
			}
		});
		this.dataSource = new MatTableDataSource<MatrizSearchData>(result);
		this._spinner.hide();

	}
}

