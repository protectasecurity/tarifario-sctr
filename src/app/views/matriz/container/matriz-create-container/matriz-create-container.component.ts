import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatSelectionList, MatSelectionListChange } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { HotTableRegisterer } from "@handsontable/angular";
import { ofType } from "@ngrx/effects";
import { ActionsSubject, Store } from "@ngrx/store";
import { isNullOrUndefined } from "@swimlane/ngx-datatable/release/utils";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { sortArray } from "../../../../shared/helpers/utils";
import { SeatConfigurationOperator } from "../../../../shared/models/seat-configuration.model";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { FileExportService } from "../../../../shared/services/file.export.service";
import { Actividades } from "../../../actividades/models/Actividades";
import { FeeType } from "../../../fee/models/fee.model";
import { ILinkedChannel } from "../../../fee/models/tariffmatrix.model";
import { ParametersTypeConfiguration } from "../../../parameters/models/company-type.model";
import { Parameter } from "../../../parameters/models/parameter.model";
import { Zone } from "../../../zones/models/zone.model";
import { EffectDateService } from "../../components/effectdate-confirm/effectdate-confirm.service";
import { MatrizChannelAssociateComponent } from "../../components/matriz-channel-associate/matriz-channel-associate.component";
import { MatrizPickElementsComponent } from "../../components/matriz-pick-elements/matriz-pick-elements.component";
import { headerRenderer, percentRenderer } from "../../helper/renderer-helper";
import { Appraisals, BranchEnumType, IMatrixChannelGroup, MatrizRiesgo, RamoEnumType, Risk } from "../../models/matriz.model";
import * as matActions from "../../state/actions/matriz.actions";
import * as fromReducer from "../../state/reducers";

@Component({
    selector: "app-matriz-create-container",
    templateUrl: "./matriz-create-container.component.html",
    styleUrls: ["./matriz-create-container.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class MatrizCreateContainerComponent implements OnInit, AfterViewInit {
    @ViewChild(HotTableRegisterer) hot: HotTableRegisterer;
    @ViewChild("zones") zones: MatSelectionList;
    @ViewChild("type") type: MatSelectionList;
    @ViewChild("tamano") tamano: MatSelectionList;

    mainMatriz: MatrizRiesgo;
    settings2: any;
    instance1: string = "tableKuntur1";
    instance2: string = "tableKuntur2";
    mainpath: string;
    rowData = [];
    filterSelected: string = "riesgo";
    firstLoad: boolean = true;
    parent: boolean = false;
    parentDescription: string = "";

    current_zone: string = "";

    frmType: string = "";
    sumCell: string = "0";
    canCell: string = "0";
    avgCell: string = "0";
    minCell: string = "0";
    maxCell: string = "0";
    canEdit: boolean = true;
    canEditToogle: boolean = false;

    filterSelectedColl: any[] = [];
    isNew: boolean = true;
    loadModal: boolean = true;
    isclone: boolean = false;
    iscampaign: boolean = false;
    zones$: Observable<Zone[]>;
    zonesAll: Zone[];
    channels$: Observable<IMatrixChannelGroup[]>;
    channels: IMatrixChannelGroup[];
    actividades$: Observable<Actividades[]>;
    actividades: Actividades[];
    parameter$: Observable<Parameter[]>;
    items$: Observable<MatrizRiesgo[]>;
    effectDate$: Observable<any>;
    effectDate: any;
    items: MatrizRiesgo[];
    actualZone: Zone[] = [];
    actualFieldCovarage: Parameter[] = [];
    actualFieldCompany: Parameter[] = [];
    lstWorkerTypes: Parameter[] = [];
    actualField: Parameter[] = [];
    headerParameters: string[] = [];
    actualAct1: Actividades[] = [];
    actualAct: Actividades[] = [];
    tempRisk: Risk[] = [];
    tempRiskDeleted: Risk[] = [];
    operatorBranch: any[] = [];
    operatorRamo: any[] = [];
    selected = -1;
    estado: string = "";
    lastEffectDate: any = null;

    current_ramo: string = "";
    current_branch: string = "";
    showComponent: boolean;
    premiumbase: boolean = false;
    premiumbaseori: boolean = false;
    changeVersionDate: boolean = false;
    isspecial: boolean = false;
    originDate: string = "";

    finMin: any = null;
    iniMin: any = null;
    itemUpdates$: Observable<string[]>;
    feetypes: any[] = [];

    frmValues = {
        description: "",
        iniVig: null,
        finVig: null,
        moneda: "PEN",
        tipo: "",
        version: null,
        effectdate: null
    };

    disableDescription: boolean = false;
    disableIniVig: boolean = false;
    disableFinVig: boolean = false;
    disableMoneda: boolean = false;
    disableVersion: boolean = true;
    showStateEffect: boolean = false;

    item$: Observable<MatrizRiesgo>;
    protected ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public router: Router,
        public dialog: MatDialog,
        private _spinner: NgxSpinnerService,
        private store: Store<fromReducer.MatrizState>,
        private confirmService: AppConfirmService,
        private activatedRoute: ActivatedRoute,
        private actionsSubject$: ActionsSubject,
        private effectDateService: EffectDateService,
        private excel: FileExportService
    ) {
        this.showComponent = false;
        this.item$ = this.store.select(fromReducer.getItem);
        this.items$ = this.store.select(fromReducer.getItems);
        this.zones$ = this.store.select(fromReducer.getZones);
        this.actividades$ = this.store.select(fromReducer.getActividades);
        this.parameter$ = this.store.select(fromReducer.getParameter);
        this.itemUpdates$ = this.store.select(fromReducer.updatesMatriz);
        this.channels$ = this.store.select(fromReducer.getChannelGroup);
        this.effectDate$ = this.store.select(fromReducer.getEffectDate);
    }

    inivigchange() {
        this.frmValues.finVig = null;
    }

    changeVersion() {
        this.confirmService
            .confirm({
                title: "Confirmación",
                message: "Esta seguro de ver la versión seleccionada, se perderán los cambios actuales.",
                showcancel: true
            })
            .subscribe(x => {
                if (x === true) {
                    this.changeVersionDate = true;
                    this.firstLoad = false;
                    this.filterSelected = "riesgo";
                    if (this.originDate === this.frmValues.version) {
                        this.effectDate = "";
                    } else {
                        this.store.dispatch(new matActions.LoadEffectDate(this.mainMatriz.id, new Date(this.mainMatriz.effectDate).toISOString()));
                    }
                    this.store.dispatch(new matActions.LoadMatriz(this.mainMatriz.id, this.frmValues.version));
                    this.handleControls();
                }
            });
    }

    ngAfterViewInit() {
        if (this.loadModal) {
            setTimeout(() => {

                const dialogRef = this.dialog.open(MatrizPickElementsComponent, {
                    width: "1400px",
                    disableClose: false,
                    data: { zones: this.zones$, actividades: this.actividades$, delete: true, isnew: true }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        Object.keys(BranchEnumType).forEach(key => {
                            this.operatorBranch.push({ "key": key, "value": BranchEnumType[key] });
                        });
                        Object.keys(RamoEnumType).forEach(key => {
                            this.operatorRamo.push({ "key": key, "value": RamoEnumType[key] });
                        });

                        this.actualZone = result.zone;
                        this.actualAct1 = result.actividades;
                        this.showComponent = true;

                        this.loadButtonToggle();
                        this.loadInitialMatriz(true);
                        this.populateTable();

                        this.current_ramo = this.actualFieldCovarage[0].id;
                        this.current_branch = this.actualFieldCompany[0].id;
                        this.current_zone = this.actualZone[0].id;

                        setTimeout(() => this.subcriberChecks());
                    }
                });
            });
        }
    }

    getFieldsSize(element: any) {
        if (ParametersTypeConfiguration[element.type] === ParametersTypeConfiguration.COMPANY_SIZE) {
            if (ParametersTypeConfiguration[element.type] === ParametersTypeConfiguration.COMPANY_SIZE) {
                if (SeatConfigurationOperator[element.operators] === SeatConfigurationOperator.BETWEEN) {
                    return SeatConfigurationOperator[element.operators] + " " + element.value + " y " + element.valueMax;
                } else {
                    return SeatConfigurationOperator[element.operators] + " " + element.value;
                }
            } else {
                return element.description;
            }
        }
    }

    getFieldsSizeCovarage(element: any) {
        if (ParametersTypeConfiguration[element.type] === ParametersTypeConfiguration.FIELD) {
            return element.description;
        }
    }

    ngOnInit() {

        Object.keys(FeeType).forEach(key => {
            this.feetypes.push({ key: key, value: FeeType[key] });
        });

        this.store.dispatch(new matActions.LoadZones());
        this.store.dispatch(new matActions.LoadParameters());
        this.store.dispatch(new matActions.LoadActividades());
        this.store.dispatch(new matActions.LoadChannelGroup());

        setTimeout(() => { }, 2000);

        this.loadCheck();
        this.triggers();
        this.verifyLoad();

        this.items$.subscribe(arr => this.items = arr);

        this.actividades$.subscribe(arr => this.actividades = arr);

        this.zones$.subscribe(arr => this.zonesAll = arr);

        this.channels$.subscribe(arr => this.channels = arr);

        this.effectDate$.subscribe(eff => this.effectDate = eff);

        this.item$.subscribe((result: MatrizRiesgo) => {
            if (result) {
                Object.keys(BranchEnumType).forEach(key => {
                    this.operatorBranch.push({ "key": key, "value": BranchEnumType[key] });
                });
                Object.keys(RamoEnumType).forEach(key => {
                    this.operatorRamo.push({ "key": key, "value": RamoEnumType[key] });
                });

                if (this.firstLoad) {
                    this.originDate = result.updatedAt;
                }

                if (result.originTariffMatrix) {
                    this.parent = true;
                    this.parentDescription = result.originTariffMatrix.description;
                }

                this.showComponent = true;
                this.disableVersion = false;
                this.actualZone = result.areaGroups;
                this.actualAct1 = result.activityGroups;
                this.estado = result.isActive ? "ACTIVO" : "INACTIVO";
                this.lastEffectDate = result.effectDate;

                if (result.type === "SPECIAL") {
                    this.isspecial = true;
                } else if (result.type === "CAMPAIGN") {
                    this.iscampaign = true;
                }

                const tmpField = result.parameters.filter(d => (d.isActive) && (d.type === "FIELD"));
                const tmpField1 = result.parameters.filter(d => (d.isActive) && (d.type === "COMPANY_SIZE"));
                let tmpHeaders = result.parameters.filter(d => d.type === "WORKER_TYPE");
                if (this.isNew) {
                    tmpHeaders = result.parameters.filter(d => (d.isActive) && (d.type === "WORKER_TYPE"));
                }

                this.actualFieldCovarage = tmpField;
                this.actualFieldCompany = tmpField1;
                this.actualField = result.parameters;
                this.headerParameters = tmpHeaders.map(a => a.description);

                this.current_ramo = this.actualFieldCovarage.length !== 0 ? this.actualFieldCovarage[0].id : "";
                this.current_branch = this.actualFieldCompany.length !== 0 ? this.actualFieldCompany[0].id : "";
                this.current_zone = this.actualZone.length !== 0 ? this.actualZone[0].id : "";
                const findOb = result.risks.filter(ob => ob.areaGroupId === this.current_zone &&
                    ob.fieldsId === this.current_ramo && ob.enterpriseSizeId === this.current_branch);

                this.tempRisk = result.risks;
                this.mainMatriz = new MatrizRiesgo(result);
                this.mainMatriz.risks = findOb;
                if (this.isclone) {
                    this.frmValues.description = "";
                    this.frmValues.tipo = result.type;
                    this.disableVersion = true;
                } else if (this.mainpath === "details") {
                    this.frmValues.description = result.description;
                    this.frmValues.iniVig = moment(new Date(result.startDate), "DD/MM/YYYY");
                    this.frmValues.finVig = result.endDate ? moment(new Date(result.endDate), "DD/MM/YYYY") : null;
                    this.frmValues.moneda = result.currency;
                    this.frmValues.tipo = result.type;
                    this.frmValues.version = result.updatedAt;
                }
                this.loadButtonToggle();
                setTimeout(() => {
                    this.subcriberChecks();
                    this.populateTable();
                });
            }
        });
    }

    triggers() {
        this.actionsSubject$
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(ofType(matActions.MatrizActionsType.CreateMatrizCompleted))
            .subscribe(response => {
                this.handleBack();
            });

        this.actionsSubject$
            .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(ofType(matActions.MatrizActionsType.LoadMatrizUpdatesComplete))
            .subscribe(response => {
                this.handleBack();
            });
    }

    verifyLoad() {
        const mainpath = this.activatedRoute.snapshot.url[0].path;
        this.mainpath = mainpath;
        let loadtemplate = false;

        if (mainpath === "manage" || mainpath === "specialchannel" || mainpath === "managecampaign") {
            loadtemplate = false;
        } else {
            loadtemplate = true;
            this.loadModal = false;
            if (mainpath === "basechannel") {
                this.canEdit = false;
            } else {
                if (mainpath === "clone") {
                    this.isclone = true;
                } else if (mainpath === "campaign") {
                    this.iscampaign = true;
                    this.isNew = true;
                }
            }
        }

        if (loadtemplate) {
            const idMatriz = this.activatedRoute.snapshot.params["Id"];
            switch (mainpath) {
                case "details":
                    this.store.dispatch(new matActions.LoadMatriz(idMatriz, null));
                    this.store.dispatch(new matActions.LoadUpdatesMatriz(idMatriz));
                    this.handleControls();
                    break;
                default:
                    this.store.dispatch(new matActions.LoadMatriz(idMatriz, null));
                    this.handleControls();
                    break;
            }
        }
    }

    handleBack() {
        if (this.frmValues.tipo !== "BASE") {
            this.router.navigate([`/matriz/list-special`]);
        } else {
            this.router.navigate([`/matriz/list`]);
        }
    }

    openPicker() {
        const dialogRef = this.dialog.open(MatrizPickElementsComponent, {
            width: "1400px",
            disableClose: false,
            data: { zones: this.actualZone, actividades: this.actualAct1, delete: true, isnew: false }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (this.showComponent === false) {
                this.actualZone = result.zone;
                this.actualAct1 = result.actividades;
                this.showComponent = true;
                this.loadButtonToggle();

                this.loadInitialMatriz(true);


                this.populateTable();
                this.current_ramo = this.actualFieldCovarage[0].id;
                this.current_branch = this.actualFieldCompany[0].id;
                this.current_zone = this.actualZone[0].id;

                setTimeout(() => this.subcriberChecks());
            } else {
                if (result) {
                    this.updateArrays(result.zone, result.actividades);
                    this.populateTable();

                    this.loadButtonToggle();
                    this.loadCheck();
                }
            }
        });
    }

    loadCheck() {
        this.parameter$.subscribe(x => {
            const tmpField = x.filter(d => (d.isActive) && (d.type === "FIELD"));
            const tmpField1 = x.filter(d => (d.isActive) && (d.type === "COMPANY_SIZE"));

            let tmpHeaders = x.filter(d => d.type === "WORKER_TYPE");
            this.lstWorkerTypes = tmpHeaders;
            if (this.isNew) {
                tmpHeaders = x.filter(d => d.isActive && d.type === "WORKER_TYPE");
            }
            this.actualFieldCovarage = tmpField;
            this.actualFieldCompany = tmpField1;
            this.actualField = x;
            this.headerParameters = tmpHeaders.map(a => a.description);
        });
    }

    subcriberChecks() {
        if (this.zones) {
            this.zones.selectionChange.subscribe((z: MatSelectionListChange) => {
                this.zones.deselectAll();
                this.current_zone = z.option.value;
                z.option.selected = true;
                this.addRisk();
            });
        }
        if (this.type) {
            this.type.selectionChange.subscribe((t: MatSelectionListChange) => {
                this.type.deselectAll();
                this.current_ramo = t.option.value;
                t.option.selected = true;
                this.addRisk();
            });
        }
        if (this.tamano) {
            this.tamano.selectionChange.subscribe((m: MatSelectionListChange) => {
                this.tamano.deselectAll();
                this.current_branch = m.option.value;
                m.option.selected = true;
                this.addRisk();
            });
        }
    }

    loadButtonToggle() {
        const tc = "T.Neta";
        const tr = "T.Riesgo";

        const toggleArr = [];

        toggleArr.push({ id: "mat-button-fis", value: "riesgo", class: "bt-toogle", hclass: "ht-fis", label: tr, enabled: true });
        toggleArr.push({ id: "mat-button-fisr", value: "comercial", class: "bt-toogle", hclass: "ht-fisr", label: tc, enabled: true });

        this.filterSelectedColl = toggleArr;
    }

    onFilterChange(e) {

        this.hot.getInstance(this.instance2).updateSettings({ className: "" }, true);
        this.hot.getInstance(this.instance2).updateSettings({ className: this.getHeaderColor() }, false);

        this.filterSelected === "riesgo" ? this.canEditToogle = false : this.canEditToogle = true;
        this.populateTable();

        this.filterSelected = e;
    }

    addRisk() {
        if (this.mainMatriz.risks[0].areaGroupId !== this.current_zone ||
            this.mainMatriz.risks[0].fieldsId !== this.current_ramo ||
            this.mainMatriz.risks[0].enterpriseSizeId !== this.current_branch) {

            const findOb = this.tempRisk.filter(ob => ob.areaGroupId === this.current_zone &&
                ob.fieldsId === this.current_ramo &&
                ob.enterpriseSizeId === this.current_branch);
            let oldObj = this.tempRisk.filter(ob => ob.areaGroupId === this.mainMatriz.risks[0].areaGroupId &&
                ob.fieldsId === this.mainMatriz.risks[0].fieldsId &&
                ob.enterpriseSizeId === this.mainMatriz.risks[0].enterpriseSizeId);

            if (oldObj.length === 0) {
                this.tempRisk = this.tempRisk.concat(this.mainMatriz.risks);
            } else {
                oldObj = this.mainMatriz.risks;
                this.tempRisk = this.tempRisk.filter(ob => ob.areaGroupId !== this.mainMatriz.risks[0].areaGroupId ||
                    ob.fieldsId !== this.mainMatriz.risks[0].fieldsId ||
                    ob.enterpriseSizeId !== this.mainMatriz.risks[0].enterpriseSizeId);
                this.tempRisk = this.tempRisk.concat(oldObj);
            }

            if (findOb.length !== 0) {
                this.mainMatriz.risks = findOb;
            } else {
                const riesgo: Array<Risk> = [];
                let idx = 0;
                this.actualAct1.forEach(act => {
                    riesgo.push({
                        id: "obj." + act.id,
                        activityId: act.id,
                        areaGroupId: this.current_zone,
                        minimumPremium: 0,
                        minimumPremiumEndoso: 0,
                        fieldsId: this.current_ramo,
                        enterpriseSizeId: this.current_branch,
                        appraisals: [],
                        order: act.order
                    });
                    const appr: Array<Appraisals> = [];
                    this.actualField.forEach(w => {
                        if (w.type === "WORKER_TYPE") {
                            appr.push({
                                commercialAppraisal: 0,
                                riskAppraisal: 0,
                                workerTypeId: w.id
                            });
                        }
                    });
                    riesgo[idx]["appraisals"] = appr;
                    idx++;
                });
                this.mainMatriz.risks = [];
                riesgo.forEach(x => {
                    this.mainMatriz.risks.push(x);
                });
            }

            this.isNew = true;
            this.populateTable();
            this.onFilterChange(this.filterSelected);
        }
    }

    loadInitialMatriz(isNew: boolean) {
        if (isNew) {
            this.mainMatriz = {
                id: null,
                description: null,
                type: null,
                startDate: null,
                endDate: null,
                effectDate: null,
                isActive: null,
                currency: null,
                areaGroups: this.actualZone,
                activityGroups: this.actualAct1,
                parameters: this.actualField,
                risks: [],
                derivedTariffMatrices: [],
                linkedChannelGroups: [],
                updatedAt: null,
                originTariffMatrix: null
            };
            const riesgo: Array<Risk> = [];
            let idx = 0;
            this.actualAct1.forEach(act => {/* 
				console.log(this.actualZone);
				console.log(this.actualFieldCovarage);
				console.log(this.actualFieldCompany); */
                riesgo.push({
                    id: "obj." + act.id,
                    activityId: act.id,
                    areaGroupId: this.actualZone[0].id,
                    minimumPremium: 0,
                    minimumPremiumEndoso: 0,
                    fieldsId: this.actualFieldCovarage[0].id,
                    enterpriseSizeId: this.actualFieldCompany[0].id,
                    appraisals: [],
                    order: act.order
                });
                const appr: Array<Appraisals> = [];
                this.actualField.forEach(w => {
                    if (w.type === "WORKER_TYPE") {
                        appr.push({
                            commercialAppraisal: 0,
                            riskAppraisal: 0,
                            workerTypeId: w.id
                        });
                    }
                });
                riesgo[idx]["appraisals"] = appr;
                idx++;

            });

            this.mainMatriz.risks = riesgo;

            this.frmValues.iniVig = moment();
            this.frmValues.moneda = "PEN";
            this.handleControls();

        } else {
            if (!this.firstLoad) {
                this.loadDetail();
            }
        }
    }

    updateArrays(zone: any[], actividades: any[]) {
        const oldZone = this.actualZone.filter(item => zone.find(old => old.id === item.id) === undefined);
        const newZone = zone.filter(item => this.actualZone.find(old => old.id === item.id) === undefined);

        this.actualZone = zone;
        this.mainMatriz.areaGroups = zone;

        oldZone.forEach(z => {
            if (this.current_zone === z.id) {
                this.tempRiskDeleted = this.tempRiskDeleted.concat(this.mainMatriz.risks);
                this.mainMatriz.risks = [];
                this.current_zone = this.actualZone[0].id;
                this.tempRisk = this.tempRisk.filter(o => o.areaGroupId !== z.id);
            } else {
                const temp = this.tempRisk.filter(o => o.areaGroupId === z.id);
                this.tempRiskDeleted = this.tempRiskDeleted.concat(temp);
                this.tempRisk = this.tempRisk.filter(o => o.areaGroupId !== z.id);
            }
        });

        newZone.forEach(z => {
            const tempDel = this.tempRiskDeleted.filter(o => o.areaGroupId === z.id);
            this.tempRisk = this.tempRisk.concat(tempDel);
            this.tempRiskDeleted = this.tempRiskDeleted.filter(o => o.areaGroupId !== z.id);
        });

        const unused = this.actividades.filter(item => actividades.find(old => old.id === item.id) === undefined);

        this.mainMatriz.activityGroups = actividades;
        this.actualAct1 = actividades;

        unused.forEach(a => {
            const temp = this.tempRisk.filter(o => o.activityId === a.id);
            this.tempRiskDeleted = this.tempRiskDeleted.concat(temp);
            this.tempRisk = this.tempRisk.filter(o => o.activityId !== a.id);

            const tempAct = this.mainMatriz.risks.filter(o => o.activityId === a.id);
            this.tempRiskDeleted = this.tempRiskDeleted.concat(tempAct);
            this.mainMatriz.risks = this.mainMatriz.risks.filter(o => o.activityId !== a.id);
        });

        actividades.forEach(na => {
            const appr: Array<Appraisals> = [];
            this.actualField.forEach(w => {
                if (w.type === "WORKER_TYPE") {
                    appr.push({
                        commercialAppraisal: 0,
                        riskAppraisal: 0,
                        workerTypeId: w.id
                    });
                }
            });

            if (!this.mainMatriz.risks.find(o => o.activityId === na.id)) {
                const dele = this.tempRiskDeleted.find(ob => ob.areaGroupId === this.current_zone &&
                    ob.fieldsId === this.current_ramo && ob.enterpriseSizeId === this.current_branch && ob.activityId === na.id);

                if (dele) {
                    this.mainMatriz.risks.push(dele);
                    this.tempRiskDeleted = this.tempRiskDeleted.filter(ob => ob.areaGroupId !== this.current_zone ||
                        ob.fieldsId !== this.current_ramo || ob.enterpriseSizeId !== this.current_branch || ob.activityId !== na.id);
                } else {
                    this.mainMatriz.risks.push({
                        id: "obj." + na.id,
                        activityId: na.id,
                        areaGroupId: this.actualZone[0].id,
                        minimumPremium: 0,
                        minimumPremiumEndoso: 0,
                        fieldsId: this.actualFieldCovarage[0].id,
                        enterpriseSizeId: this.actualFieldCompany[0].id,
                        appraisals: appr,
                        order: na.order
                    });
                }
            }

            this.actualFieldCompany.forEach(acom => {
                this.actualFieldCovarage.forEach(afc => {
                    this.actualZone.forEach(az => {
                        const temp = this.tempRisk.filter(ob => ob.areaGroupId === az.id && ob.fieldsId === afc.id && ob.enterpriseSizeId === acom.id);
                        if (temp.length !== 0 && !temp.find(o => o.activityId === na.id)) {
                            const del = this.tempRiskDeleted.find(ob => ob.areaGroupId === az.id && ob.fieldsId === afc.id
                                && ob.enterpriseSizeId === acom.id && ob.activityId === na.id);
                            if (del) {
                                this.tempRisk.push(del);
                                this.tempRiskDeleted = this.tempRiskDeleted.filter(ob => ob.areaGroupId !== az.id || ob.fieldsId !== afc.id
                                    || ob.enterpriseSizeId !== acom.id || ob.activityId !== na.id);
                            } else {
                                this.tempRisk.push({
                                    id: "obj." + na.id,
                                    activityId: na.id,
                                    areaGroupId: az.id,
                                    minimumPremium: 0,
                                    minimumPremiumEndoso: 0,
                                    fieldsId: afc.id,
                                    enterpriseSizeId: acom.id,
                                    appraisals: appr,
                                    order: na.order
                                });
                            }
                        }
                    });
                });
            });
        });
        if (this.mainMatriz.risks.length === 0) {
            const risk = this.tempRisk.filter(ob => ob.areaGroupId === this.current_zone &&
                ob.fieldsId === this.current_ramo &&
                ob.enterpriseSizeId === this.current_branch);
            if (risk.length !== 0) {
                this.mainMatriz.risks = risk;
            } else {
                this.loadInitialMatriz(true);
            }
        }
    }

    loadDetail() {
        const zoneCollValue: Array<Risk> = [];
        for (let idx = 0; idx < this.mainMatriz.risks.length; idx++) {
            this.mainMatriz.risks.forEach(groupRisk => {
                const myJson = {
                    minimumPremium: groupRisk.minimumPremium,
                    minimumPremiumEndoso: groupRisk.minimumPremiumEndoso,
                    tafValue: {}
                };
                groupRisk.appraisals.forEach(row => {

                });
            });
        }
    }

    createStructureNew() {

        const feeColTemp = [];
        const feeColWidth = [500];
        this.rowData = [];
        for (let index = 0; index < this.mainMatriz.activityGroups.length; index++) {
            const element = this.mainMatriz.activityGroups[index];
            const xxx = this.actividades.find(x => x.id === element.id);
            if (!isNullOrUndefined(xxx)) {
                element.order = xxx.order;
            } else {/* 
				console.log(element); */
            }
        }
        if (this.isNew) {
            let first = true;
            this.mainMatriz.risks.forEach(mrisk => {

                const descGrupo = this.mainMatriz.activityGroups.find(xx => xx.id === mrisk.activityId);
                const descAct = this.mainMatriz.activityGroups.find(xx => xx.id === mrisk.activityId);

                const myJson = {
                    id: "row." + mrisk.activityId,
                    description: "[" + descGrupo.group + "] - " + descAct.description,
                    minimumPremium: 0,
                    minimumPremiumEndoso: 0,
                    feeZone: {},
                    order: Number(descAct.order)
                };

                mrisk.appraisals.forEach(appr => {

                    const objName = appr.workerTypeId;
                    const haveRisk = this.lstWorkerTypes.find(x => x.id === objName);

                    let objValueCell = 0;

                    if (first) {
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: "SminimumPremium",
                            data: "feeZone.SminimumPremium",
                            type: "numeric",
                            format: "0.00",
                            numericFormat: { pattern: "0.00" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            validator: this.validatePrima,
                            isZone: true,
                            IdZone: appr.workerTypeId,
                            strict: true,
                            positionY: 1, // sFeeAddZone.indice,
                            statusY: 1 // sFeeAddZone.status
                        });
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: "SminimumPremiumEndoso",
                            data: "feeZone.SminimumPremiumEndoso",
                            type: "numeric",
                            format: "0.00",
                            numericFormat: { pattern: "0.00" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            validator: this.validatePrima,
                            isZone: true,
                            IdZone: appr.workerTypeId,
                            strict: true,
                            positionY: 1, // sFeeAddZone.indice,
                            statusY: 1 // sFeeAddZone.status
                        });
                        first = false;
                    }

                    switch (this.filterSelected) {
                        case "riesgo":
                            objValueCell = appr.riskAppraisal ? appr.riskAppraisal : 0;
                            break;
                        case "comercial":
                            objValueCell = appr.commercialAppraisal ? appr.commercialAppraisal : 0; // (appr.riskAppraisal / (1 - descAct.factor)) : 0;
                            break;
                    }
                    myJson.feeZone["SminimumPremium"] = mrisk.minimumPremium;
                    myJson.feeZone["SminimumPremiumEndoso"] = mrisk.minimumPremiumEndoso;
                    myJson.feeZone[objName] = objValueCell;

                    const existe = function (element) {
                        return element.data === "feeZone." + objName;
                    };

                    if (!feeColTemp.some(existe) && haveRisk.isActive) {
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: objName,
                            data: "feeZone." + objName,
                            type: "numeric",
                            format: "-0.00",
                            numericFormat: { pattern: "-0.000000" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            validator: this.validateNumeric,
                            isZone: true,
                            IdZone: appr.workerTypeId,
                            strict: true,
                            positionY: 1,
                            statusY: 1
                        });
                    }
                });
                this.rowData.push(myJson);
            });
        } else {

            let first = true;
            this.mainMatriz.risks.forEach(mrisk => {
                const descGrupo = this.mainMatriz.activityGroups.find(xx => xx.id === mrisk.activityId);
                const descAct = this.mainMatriz.risks.find(xx => xx.activityId === mrisk.activityId);
                const act = this.mainMatriz.activityGroups.find(xx => xx.id === mrisk.activityId);

                const myJson = {
                    id: "row." + mrisk.activityId,
                    description: "[" + descGrupo.group + "] - " + act.description,
                    minimumPremium: 0,
                    minimumPremiumEndoso: 0,
                    feeZone: {},
                    order: Number(descAct.order)
                };

                mrisk.appraisals.forEach(appr => {

                    const objName = appr.workerTypeId;
                    const haveRisk = this.lstWorkerTypes.find(x => x.id === objName);
                    let objValueCell = 0;

                    if (first) {
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: "SminimumPremium",
                            data: "feeZone.SminimumPremium",
                            type: "numeric",
                            format: "0.00",
                            numericFormat: { pattern: "0.00" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            readOnly: this.canEditToogle,
                            validator: this.validatePrima,
                            isZone: true,
                            IdZone: appr.workerTypeId,
                            strict: true,
                            positionY: 1,
                            statusY: 1
                        });
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: "SminimumPremiumEndoso",
                            data: "feeZone.SminimumPremiumEndoso",
                            type: "numeric",
                            format: "0.00",
                            numericFormat: { pattern: "0.00" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            readOnly: this.canEditToogle,
                            validator: this.validatePrima,
                            isZone: true,
                            IdZone: appr.workerTypeId,
                            strict: true,
                            positionY: 1, // sFeeAddZone.indice,
                            statusY: 1 // sFeeAddZone.status
                        });
                        first = false;
                    }
                    switch (this.filterSelected) {
                        case "riesgo":
                            objValueCell = descAct.appraisals.find(a => a.workerTypeId === appr.workerTypeId).riskAppraisal;
                            break;
                        case "comercial":
                            let inf = descAct.appraisals.find(a => a.workerTypeId === appr.workerTypeId).commercialAppraisal;
                            if (inf === Infinity || inf === -Infinity) {
                                inf = 0;
                            }
                            objValueCell = Number(inf.toFixed(6));

                            break;
                    }
                    myJson.feeZone["SminimumPremium"] = mrisk.minimumPremium;
                    myJson.feeZone["SminimumPremiumEndoso"] = mrisk.minimumPremiumEndoso;
                    myJson.feeZone[objName] = objValueCell;

                    const existe = function (element) {
                        return element.data === "feeZone." + objName;
                    };

                    if (!feeColTemp.some(existe) && haveRisk.isActive) {
                        // const sFeeAddZone = this.mainFee.zones.find(x => x.id === zones.idZone);
                        // if (sFeeAddZone.status === 1) {
                        feeColWidth.push(90);
                        feeColTemp.push({
                            id: objName,
                            data: "feeZone." + objName,
                            type: "numeric",
                            format: "-0.00",
                            numericFormat: { pattern: "-0.000000" },
                            renderer: percentRenderer,
                            allowInvalid: false,
                            allowEmpty: false,
                            validator: this.validateNumeric,
                            isZone: true,
                            IdZone: mrisk.areaGroupId,
                            strict: true,
                            positionY: 1, // sFeeAddZone.indice,
                            statusY: 1 // sFeeAddZone.status
                        });
                    }
                });
                this.rowData.push(myJson);
            });
        }

        this.rowData = this.rowData.sort(function (a, b) {
            const nameA = Number(a.order) * 1000, // + Number(a.indice),
                nameB = Number(b.order) * 1000; // + Number(b.indice);

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });


        const mColumnsColl = [];
        mColumnsColl.push({
            data: "description",
            type: "text",
            readOnly: true,
            renderer: headerRenderer,
            editor: false
        });

        const feeColTempColl = sortArray(feeColTemp, "positionY", 1).filter(x => x.statusY === 1);
        feeColTempColl.forEach(element => {
            mColumnsColl.push(element);
        });
        return { columns: mColumnsColl, colWidths: feeColWidth };
    }

    setResume(q, s, min, max, b) {
        if (b) {
            this.avgCell = (s / q).toFixed(2);
            this.canCell = q.toFixed(1);
            this.sumCell = s.toFixed(2);
            this.minCell = min.toFixed(2);
            this.maxCell = max.toFixed(2);
        } else {
            this.avgCell = "0.00";
            this.canCell = "0";
            this.sumCell = "0.00";
            this.minCell = "0.00";
            this.maxCell = "0.00";
        }
    }

    calculateResume(r, selected, cb) {

        cb(0, 0, 0, 0, false);
        let sumCelda: number = 0;
        let canCelda: number = 0;

        const filaInicio = selected[0] < selected[2] ? selected[0] : selected[2];
        const filaFin = selected[0] < selected[2] ? selected[2] : selected[0];
        const columnaInicio = selected[1] < selected[3] ? selected[1] : selected[3];
        const columnaFin = selected[1] < selected[3] ? selected[3] : selected[1];

        const aValues = [];

        if (columnaInicio > 1) {
            for (let i = filaInicio; i <= filaFin; i += 1) {
                for (let y = columnaInicio; y <= columnaFin; y += 1) {
                    let value = 0;
                    if (r === null) {
                        value = this.hot.getInstance(this.instance2).getDataAtCell(i, y);
                    } else {
                        value = r.getDataAtCell(i, y);
                    }
                    aValues.push(value);
                    sumCelda = sumCelda + value;
                    canCelda = value > 0 ? canCelda + 1 : canCelda;
                }
            }
            if (canCelda !== undefined && sumCelda !== undefined) {
                if (canCelda > 1 && sumCelda > 0) {
                    const oValues = aValues.filter(x => x > 0).sort((a, b) => a - b);
                    cb(canCelda, sumCelda, oValues[0], oValues[oValues.length - 1], true);
                }
            }
        }
    }

    updateCollection2(c, s) {

        if (s !== "loadData") {

            /* 	const mainTmpFee = JSON.parse(JSON.stringify(this.mainMatriz.risks));

                for (let index = 0; index < mainTmpFee.length; index++) {
                    const element = mainTmpFee[index];
                    const sData = this.rowData.find(item => item.id === "row." + element.activityId);

                    Object.entries(sData.feeZone).forEach(([key, value]) => {
                        const obj: Appraisals = element.appraisals.find(items => items.workerTypeId === key);
                        if (obj) {
                            obj[key] = Number(value);
                        } else {
                            const prp = key.slice(1);
                            element[prp] = Number(value);
                        }
                    });
                }
                this.mainMatriz.risks = mainTmpFee;
                 */
            this.mainMatriz.risks.forEach(element => {
                const sData = this.rowData.find(item => item.id === "row." + element.activityId);

                Object.entries(sData.feeZone).forEach(([key, value]) => {
                    const obj: Appraisals = element.appraisals.find(items => items.workerTypeId === key);
                    /* const factor = this.mainMatriz.activityGroups.find(act => act.id === element.activityId); */

                    /* 	let commercialAppraisal = (Number(value) / (1 - Number(factor.factor)));
                        if (isNaN(commercialAppraisal)) {
                            commercialAppraisal = 0;
                        } */
                    /* 	const appr: Appraisals = new Appraisals(commercialAppraisal, value, key); */
                    if (obj) {

                        this.filterSelected === "riesgo" ? obj.riskAppraisal = Number(value) : obj.commercialAppraisal = Number(value);

                        /* 	obj.commercialAppraisal = commercialAppraisal;
                            obj.riskAppraisal = Number(value); */
                    } else {
                        const prp = key.slice(1);
                        element[prp] = Number(value);
                    }
                });
            });
        }

    }

    populateHeaderNames(): string[] {

        const mHeaderColl = ["Actividades Economicas", "Prima Mínima", "Prima Endoso"].concat(this.headerParameters);

        return mHeaderColl;

    }

    mergeData() {
        const mergeUse = [];
        const mergeColl = [];
        return mergeColl.filter(x => x.rowspan !== 1);
    }

    getHeaderColor() {
        return this.filterSelectedColl.find(x => x.value === this.filterSelected).hclass;
    }

    hideSpinner() {
        setTimeout(() => {
            this._spinner.hide();
        }, 500);
    }

    populateTable() {
        const gds = this.createStructureNew();
        const setResume = this.setResume.bind(this);
        const calculateResume = this.calculateResume.bind(this);
        const updateCollection2 = this.updateCollection2.bind(this);
        this._spinner.show();
        this.settings2 = {
            data: this.rowData,
            height: 350,
            colHeaders: this.populateHeaderNames(), //
            columns: gds.columns, //
            fixedRowsTop: 0,
            fixedColumnsLeft: 1,
            rowHeaders: false,
            manualColumnMove: false,
            manualRowMove: false,
            columnSorting: false,
            readOnly: !this.canEdit,
            manualColumnResize: false,
            colWidths: gds.colWidths,
            autoRowSize: true,
            wordWrap: true,
            comments: false,
            mergeCells: this.mergeData(),
            outsideClickDeselects: false,
            className: this.getHeaderColor(),
            afterChange: function (changes, source) {
                updateCollection2(changes, source);
            },
            afterSelectionEnd: function (r, c, r2, c2) {
                if (!isNaN(r)) {
                    calculateResume(null, [r, c, r2, c2], setResume);
                } else {
                    calculateResume(r, r.getSelected()[0], setResume);
                }
            },
            beforeRender: () => {
            },
            afterLoadData: () => {
            }
        };

        if (this.hot) {
            setTimeout(() => {
                this.hot.getInstance(this.instance2).updateSettings({ className: "" }, true);
                this.hot.getInstance(this.instance2).updateSettings(this.settings2, false);
                this.hot.getInstance(this.instance2).render();
                this.hot.getInstance(this.instance2).deselectCell();
                this.hideSpinner();
            }, 0);
        } else {
            this.hideSpinner();
        }
        this.isNew = false;
    }

    validateNumeric = function (value, callback) {
        if (value === "") {
            callback(true);
        } else {
            const regexp = /^\-?\d{1,2}(\.\d{1,6})?$/;
            if (regexp.test(value)) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    validatePrima = function (value, callback) {
        if (value === "") {
            callback(true);
        } else {
            const regexp = /^\d{1,4}(\.\d{1,2})?$/;
            if (regexp.test(value)) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    save() {
        const description = this.frmValues.description
            ? this.frmValues.description
                .toString()
                .toLocaleLowerCase()
                .trim()
            : "";

        if (description === "") {
            this.confirmService.confirm({ title: "Error", message: "Ingrese una descripción válida.", showcancel: false });
            return;
        }

        const existsdescription = this.items.filter(x => x.description.toLocaleLowerCase().trim() === description).length;

        if (existsdescription > 1) {
            this.confirmService.confirm({ title: "Error", message: "La descripción ingresada ya existe en otro tarifario.", showcancel: false });
            return;
        } else if (existsdescription === 1 && this.mainpath === "manage") {
            this.confirmService.confirm({ title: "Error", message: "La descripción ingresada ya existe en otro tarifario.", showcancel: false });
            return;
        }
        if (this.iscampaign && this.frmValues.finVig === null) {
            this.confirmService.confirm({ title: "Error", message: "Ingrese una fecha de fin de vigencia válida.", showcancel: false });
            return;
        }

        const iniVig = this.frmValues.iniVig ? moment(this.frmValues.iniVig, "DD/MM/YYYY") : null;
        const finVig = this.frmValues.finVig ? moment(this.frmValues.finVig, "DD/MM/YYYY") : null;

        if (finVig != null) {
            if (!finVig.isValid()) {
                this.confirmService.confirm({ title: "Error", message: "Ingrese una fecha de fin de vigencia válida.", showcancel: false });
                return;
            }
            if (iniVig.format("YYYY-MM-DD") !== finVig.format("YYYY-MM-DD") && finVig <= iniVig) {
                this.confirmService.confirm({
                    title: "Error",
                    message: "Fin de vigencia inválido, no puede ser menor o igual que el inicio de vigencia.",
                    showcancel: false
                });
                return;
            }
        }
        let errorChan: boolean = false;
        if (this.mainMatriz.linkedChannelGroups.length > 0) {
            const fechaIni = moment(new Date(this.frmValues.iniVig), "DD/MM/YYYY");
            const fechaEnd = moment(new Date(this.frmValues.finVig), "DD/MM/YYYY");
            for (const obj of this.mainMatriz.linkedChannelGroups) {
                const inVigChan = obj.startDate ? moment(new Date(obj.startDate), "DD/MM/YYYY") : null;
                const finVigChan = obj.endDate ? moment(new Date(obj.endDate), "DD/MM/YYYY") : null;


                if (inVigChan < fechaIni) {
                    errorChan = true;
                    break;
                }
                if (finVig !== null && finVigChan !== null) {
                    if (finVigChan > fechaEnd || finVigChan < fechaIni) {
                        errorChan = true;
                        break;
                    }
                }
            }
        }
        if (errorChan === true) {
            this.confirmService.confirm({
                title: "Error",
                message: "Las fechas de vigencia de los canales deben estar dentro de la vigencia del tarifario.",
                showcancel: false
            });
            return;
        }
        this.confirmService
            .confirm({
                title: "Guardar",
                message: "¿Está seguro de guardar los cambios en el tarifario?",
                showcancel: true
            })
            .subscribe(x => {
                if (x === true) {
                    this.mainMatriz.description = description;
                    this.mainMatriz.endDate = this.frmValues.finVig;
                    this.mainMatriz.startDate = this.frmValues.iniVig;
                    this.mainMatriz.type = this.frmValues.tipo;
                    this.mainMatriz.currency = this.frmValues.moneda;
                    let oldObj = this.tempRisk.filter(ob => ob.areaGroupId === this.mainMatriz.risks[0].areaGroupId &&
                        ob.fieldsId === this.mainMatriz.risks[0].fieldsId &&
                        ob.enterpriseSizeId === this.mainMatriz.risks[0].enterpriseSizeId);

                    if (oldObj.length === 0) {
                        this.mainMatriz.risks = this.mainMatriz.risks.concat(this.tempRisk);
                    } else {
                        oldObj = this.mainMatriz.risks;
                        this.mainMatriz.risks = this.tempRisk;
                    }

                    this.mainMatriz.areaGroups.forEach(val => {
                        val["isActive"] = val.active;
                        val["isUsed"] = val.used;
                        val["order"] = val.indice;
                    });
                    let createMat: boolean = false;
                    if (this.mainpath === "manage") {
                        this.store.dispatch(new matActions.CreateMatriz(this.mainMatriz));
                    } else {
                        if (this.mainpath !== "details") {
                            if (this.isNew || this.isclone || this.iscampaign || this.isspecial) {
                                createMat = true;
                            }
                        }
                        if (createMat) {
                            this.mainMatriz.originTariffMatrix = this.mainMatriz.id;
                            this.store.dispatch(new matActions.CreateMatriz(this.mainMatriz));
                        } else {
                            let minDate: any;
                            this.lastEffectDate > new Date() ?
                                minDate = this.lastEffectDate : minDate = new Date();

                            this.effectDate === "" ?
                                this.effectDateService
                                    .confirm({
                                        title: "Confirmación",
                                        message: "Por favor confirme la fecha de efecto del cambio",
                                        showcancel: true,
                                        effecdate: this.lastEffectDate,
                                        mindate: minDate,
                                        maxdate: finVig
                                    })
                                    .subscribe((res: any) => {
                                        if (res.res === true) {
                                            if (this.isNew) {
                                                this.mainMatriz.effectDate = res.val.toISOString(); // sdate;
                                            } else {
                                                this.mainMatriz.effectDate = res.val; // sdate;
                                            }
                                            this.store.dispatch(new matActions.LoadMatrizUpdates(this.mainMatriz));
                                        }
                                    }) :
                                this.effectDateService
                                    .confirm({
                                        title: "Confirmación",
                                        message: "Por favor confirme la fecha de efecto del cambio",
                                        showcancel: true,
                                        effecdate: this.lastEffectDate,
                                        mindate: minDate,
                                        maxdate: this.effectDate["effectDate"]
                                    })
                                    .subscribe((res: any) => {
                                        if (res.res === true) {
                                            if (this.isNew) {
                                                this.mainMatriz.effectDate = res.val.toISOString(); // sdate;
                                            } else {
                                                this.mainMatriz.effectDate = res.val; // sdate;
                                            }
                                            this.store.dispatch(new matActions.LoadMatrizUpdates(this.mainMatriz));
                                        }
                                    });
                        }
                    }
                }
            });
    }

    get showTableData() {
        const showTable = this.actualAct1 === undefined ? false : this.actualAct1.length > 0;
        return showTable;
    }

    exportar(e) {
        e.preventDefault();
        const version = document.getElementById("version").getElementsByTagName("span")[0].innerText;
        const matriz: MatrizRiesgo = new MatrizRiesgo(this.mainMatriz);
        const risk = this.tempRisk.filter(ob => ob.areaGroupId !== this.current_zone ||
            ob.fieldsId !== this.current_ramo || ob.enterpriseSizeId !== this.current_branch);
        matriz.risks = matriz.risks.concat(risk);
        this.excel.exportMatriz(matriz, version);
    }

    onFileSelected() {
        const file: any = document.getElementById("fileInput");
        this._spinner.show();
        // load from buffer
        const reader = new FileReader();
        const $scope = this;
        const event: EventEmitter<MatrizRiesgo> = new EventEmitter();

        reader.addEventListener("loadend", function () {
            const matriz: MatrizRiesgo = new MatrizRiesgo($scope.mainMatriz);
            const risk = $scope.tempRisk.filter(ob => ob.areaGroupId !== $scope.current_zone ||
                ob.fieldsId !== $scope.current_ramo || ob.enterpriseSizeId !== $scope.current_branch);
            matriz.risks = matriz.risks.concat(risk);
            $scope.excel.importMatrizData(reader.result, matriz, $scope.actividades, $scope.zonesAll, $scope.channels, event);
        });
        reader.readAsArrayBuffer(file.files[0]);

        event.subscribe(
            data => {
                this.tempRiskDeleted = [];
                this.actualZone = data.areaGroups;
                this.actualAct1 = data.activityGroups;

                const tmpField = data.parameters.filter(d => (d.isActive) && (d.type === "FIELD"));
                const tmpField1 = data.parameters.filter(d => (d.isActive) && (d.type === "COMPANY_SIZE"));
                const tmpHeaders = data.parameters.filter(d => (d.isActive) && (d.type === "WORKER_TYPE"));
                this.actualFieldCovarage = tmpField;
                this.actualFieldCompany = tmpField1;
                this.actualField = data.parameters;
                this.headerParameters = tmpHeaders.map(a => a.description);

                this.current_ramo = this.actualFieldCovarage[0].id;
                this.current_branch = this.actualFieldCompany[0].id;
                this.current_zone = this.actualZone[0].id;
                const findOb = data.risks.filter(ob => ob.areaGroupId === this.current_zone &&
                    ob.fieldsId === this.current_ramo && ob.enterpriseSizeId === this.current_branch);

                this.tempRisk = data.risks;
                this.mainMatriz = new MatrizRiesgo(data);
                this.mainMatriz.risks = findOb;

                setTimeout(() => {
                    this.subcriberChecks();
                    this.populateTable();
                });
            }
        );
    }

    openChannels() {
        const mlinked: ILinkedChannel[] = [];
        let edit = this.mainMatriz.linkedChannelGroups.length !== 0;
        if (this.mainpath === "details") {
            edit = true;
        }
        const tmpLC = JSON.parse(JSON.stringify(this.mainMatriz.linkedChannelGroups));
        if (this.frmValues.iniVig === null) {
            this.confirmService.confirm({ title: "Error", message: "Ingrese una fecha de inicio de vigencia del tarifario.", showcancel: false });
            return;
        }
        const dialogRef = this.dialog.open(MatrizChannelAssociateComponent, {
            disableClose: true,
            width: "1250px",
            data: { linked: tmpLC, canEdit: edit, parameters: this.actualField, startDate: this.frmValues.iniVig }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.mainMatriz.linkedChannelGroups = result;
            }
        });
    }

    handleControls() {
        // spacuilachannel : sin tarifario base
        // basechaneel Primas base
        // basespecialchannel : Primas especiales
        this.iniMin = moment();
        if (this.mainpath === "manage" || this.mainpath === "managecampaign") {
            this.frmValues.iniVig = moment();
            this.disableDescription = false;
            this.disableIniVig = false;
            this.disableFinVig = false;
            this.disableMoneda = false;
            this.disableVersion = true;
            this.showStateEffect = false;
            this.frmValues.tipo = this.mainpath === "manage" ? "BASE" : "CAMPAIGN";
            this.isspecial = this.mainpath === "manage" ? false : true;
            this.isNew = true;
        } else {
            if (this.mainpath === "basechannel") {
                this.isspecial = true;
                this.frmValues.description = "";
                this.disableDescription = false;
                this.disableMoneda = false;
                this.disableIniVig = false;
                this.disableFinVig = false;
                this.frmValues.tipo = "SPECIAL";
                this.disableVersion = false;
                this.showStateEffect = false;
            } else if (this.mainpath === "details") {
                this.disableDescription = false;
                this.disableIniVig = true;
                this.disableFinVig = false;
                this.disableMoneda = true;
                this.disableVersion = false;
                this.showStateEffect = true;
            } else if (this.mainpath === "campaign") {
                // this.frmValues.iniVig = moment();
                this.frmValues.description = "";
                this.disableDescription = false;
                this.disableIniVig = false;
                this.disableFinVig = false;
                this.frmValues.tipo = "CAMPAIGN";
                this.disableMoneda = false;
                this.disableVersion = true;
                this.showStateEffect = false;
            } else if (this.mainpath === "clone") {
                this.frmValues.description = "";
                this.disableDescription = false;
                this.disableIniVig = false;
                this.disableFinVig = false;
                this.disableMoneda = false;
                this.disableVersion = true;
                this.showStateEffect = false;
            } else if (this.mainpath === "specialchannel" || this.mainpath === "basechannel" || this.mainpath === "basespecialchannel") {
                this.isspecial = true;
                this.frmValues.description = "";
                this.frmValues.iniVig = null;
                this.frmValues.finVig = null;
                this.frmValues.tipo = "SPECIAL";
                this.disableDescription = false;
                this.disableIniVig = false;
                this.disableFinVig = false;
                this.disableMoneda = false;
                this.disableVersion = true;
                this.showStateEffect = false;
                this.premiumbase = this.mainpath === "basechannel" ? true : false;
            }
        }
    }
}
