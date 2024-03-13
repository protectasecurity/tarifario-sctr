import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { SeatsRestriction } from 'app/shared/models/class.model';
import { SubGroups } from 'app/shared/models/class.model';
import { SeatConfigurationOperator } from 'app/shared/models/seat-configuration.model';
import { Use } from 'app/shared/models/use.model';
import { AccessMaping } from 'app/shared/security/access.mapping';
import { Zone } from 'app/views/zones/models/zone.model';
import { Moment } from 'moment';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sortArray } from '../../../../shared/helpers/utils';
import { FileExportService } from '../../../../shared/services/file.export.service';
import * as feeActions from '../../_state/actions/fee.actions';
import * as fromReducer from '../../_state/reducers';
import { EffectDateService } from '../../components/effectdate-confirm/effectdate-confirm.service';
import { RiskGroupPickerDialogComponent } from '../../components/riskgroup-picker-dialog/riskgroup-picker-dialog';
import { ZonePickerDialogComponent } from '../../components/zone-picker-dialog/zone-picker-dialog';
import { headerRenderer, percentRenderer } from '../../helper/renderer-helper';
import { Fee, FeeType, IDerivedChild, IFeeCommission, IFeeRisk, IFeeZone, IFeeZoneValue } from '../../models/fee.model';
import { IAreaGroup, ILinkedChannel, IRiskGroup, ITariffMatrixItem, TariffMatrix } from '../../models/tariffmatrix.model';
import { SeatType } from './../../../../shared/models/class.model';
import { RiskGroup } from './../../../../shared/models/risk-group.model';
import { AppModules, EActions } from './../../../../shared/security/access.mapping';
import { AppConfirmService } from './../../../../shared/services/app-confirm/app-confirm.service';
import { RiskGroupDetailComponent } from './../../../risk-group/components/risk-group-detail/risk-group-detail.component';
import { FeeAssociateChannelDialogComponent } from './../../components/fee-associate-channel-dialog/fee-associate-channel-dialog';
import { FeeMasiveService } from './../../components/fee-masive/fee-masive.service';
import { ICommissions, ICommissionsDetail, IMatrixChannelGroup } from './../../models/tariffmatrix.model';

@Component({
	selector: 'app-fee-create-container',
	templateUrl: './fee-create-container.component.html',
	styleUrls: ['./fee-create-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FeeCreateContainerComponent implements OnInit, OnDestroy {
	@ViewChild(HotTableRegisterer) hot: HotTableRegisterer;
	@ViewChild('cardcontent') cardcontent: ElementRef;

	public lnkChannelCtrl: FormControl = new FormControl();
	public lnkChannel: string = '';
	public lnkChannelFilterCtrl: FormControl = new FormControl();
	public filteredlnkChannel: ReplaySubject<IMatrixChannelGroup[]> = new ReplaySubject<IMatrixChannelGroup[]>(1);
	protected _onDestroy = new Subject<void>();

	viewHeight: number;
	settings2: any;
	instance1: string = 'tableSoat1';
	instance2: string = 'tableSoat2';
	mainpath: string;
	colHeaders: string[];
	rowData = [];

	premiumlayout: boolean = true;
	premiumbase: boolean = false;
	premiumbaseori: boolean = false;
	firstLoad: boolean = true;

	gruposRiesgoColl: RiskGroup[] = [];
	gruposRiesgoAllColl: RiskGroup[] = [];
	gruposRiesgoEditColl: RiskGroup[] = [];
	zonasColl: IFeeZone[] = [];
	zonasAllColl: IFeeZone[] = [];
	zoneEditColl: IFeeZone[] = [];

	feetypes: any[] = [];
	derivedChilds: IDerivedChild[];
	derivedChildMin: string = null;
	parentFeeDescription: string = '';

	filterSelected: string = 'fisico';
	filterSelectedCom: string = 'chfisico';
	chgroupSelected: string = '';

	filterSelectedColl: any[] = [];

	filterChannelColl: any[] = [];
	filterChannelCollMaster: any[] = [
		{ id: 'mat-button-bro', value: 'BROKER', class: 'bt-broker', hclass: 'ht-broker', label: 'Comisión broker' },
		{ id: 'mat-button-inter', value: 'MIDDLEMAN', class: 'bt-intermedia', hclass: 'ht-intermedia', label: 'Comisión intermediario' },
		{ id: 'mat-button-pv', value: 'POINT_OF_SALE', class: 'bt-salespoint', hclass: 'ht-salespoint', label: 'Comisión punto de venta' }
	];

	mainFee: Fee;
	mainFeeOrigin: string = null;
	isFisico: boolean = true;
	isFisicoR: boolean = false;
	isDigital: boolean = false;
	isDigitalR: boolean = false;

	mainIdTarifa: string;
	actualSoatType: string = 'fisico';
	isNew: boolean = true;

	changeVersionDate: boolean = false;
	isclone: boolean = false;
	isspecial: boolean = false;
	iscampaign: boolean = false;
	canEdit: boolean = true;
	originDate: string = '';
	haveDirectChannel: boolean = true;
	directChannel: boolean = false;
	item$: Observable<Fee>;
	items$: Observable<Fee[]>;
	items: Fee[];
	itemUpdates$: Observable<string[]>;
	riskgroups$: Observable<RiskGroup[]>;
	zones$: Observable<Zone[]>;
	uses$: Observable<Use[]>;
	uses: Use[];

	commissionColl: IFeeCommission[];

	sumCell: string = '0';
	canCell: string = '0';
	avgCell: string = '0';
	minCell: string = '0';
	maxCell: string = '0';

	estado: string = '';

	finMin: any = null;

	iniMin: any = null;

	lastEffectDate: any = null;

	frmValues = {
		description: '',
		iniVig: null,
		finVig: null,
		moneda: '',
		sector: '',
		tipo: '',
		version: null,
		effectdate: null
	};
	versionori: string = '';
	disableDescription: boolean = false;
	disableIniVig: boolean = false;
	disableFinVig: boolean = false;
	disableMoneda: boolean = false;
	disableSector: boolean = false;
	disableVersion: boolean = false;
	showStateEffect: boolean = false;
	maxDate: Moment;

	protected ngUnsubscribe: Subject<any> = new Subject<any>();

	modificationAllowed: boolean;

	isComisionGrossUp: boolean = false;

	constructor(
		public dialog: MatDialog,
		private _spinner: NgxSpinnerService,
		private store: Store<fromReducer.FeeState>,
		private activatedRoute: ActivatedRoute,
		public router: Router,
		private confirmService: AppConfirmService,
		private effectDateService: EffectDateService,
		private feeMasiveService: FeeMasiveService,
		private actionsSubject$: ActionsSubject,
		private permits: AccessMaping,
		private excel: FileExportService
	) {
		this.item$ = this.store.select(fromReducer.getItem);
		this.items$ = this.store.select(fromReducer.getItems);
		this.itemUpdates$ = this.store.select(fromReducer.getItemUpdate);
		this.riskgroups$ = this.store.select(fromReducer.getRiskGroups);
		this.zones$ = this.store.select(fromReducer.getZones);
		this.uses$ = this.store.select(fromReducer.getUses);
	}

	ngOnInit() {
		this.canEdit = this.permits.ShouldDo(AppModules.fee, EActions.modification);
		this.loadButtonToggle('PREMIUM');
		this.loadButtonTypes([]);
		this.store.dispatch(new feeActions.LoadRiskgroups());
		this.store.dispatch(new feeActions.LoadZones());
		this.store.dispatch(new feeActions.LoadUses());
		this.loadMasterObjects();
		this.triggers();
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	loadSearchChannel() {
		this.filteredlnkChannel.next(this.getLinkedChannel());
		setTimeout(() => {
			this.lnkChannelFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
				this.filtrarChannels();
			});
		}, 0);
	}

	loadButtonToggle(type: string) {
		const st = 'Físico';
		const rs = 'Físico renovación';
		const di = 'Digital';
		const rd = 'Digital renovación';

		const toggleArr = [];
		switch (type) {
			case 'BROKER':
				this.directChannel = this.haveDirectChannel ? true : false;
				if (!this.isComisionGrossUp) {
					toggleArr.push({ id: "mat-button-fis", value: "fisico_b", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-fisr", value: "fisicor_b", class: "bt-fisicor", hclass: "ht-fisr", label: rs, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital_b", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-digr", value: "digitalr_b", class: "bt-digitalr", hclass: "ht-digr", label: rd, type: type, enabled: true });
				} else {
					toggleArr.push({ id: "mat-button-fis", value: "fisico_b", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital_b", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
				}
				break;
			case 'MIDDLEMAN':
				this.directChannel = false;
				if (!this.isComisionGrossUp) {
					toggleArr.push({ id: "mat-button-fis", value: "fisico_i", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-fisr", value: "fisicor_i", class: "bt-fisicor", hclass: "ht-fisr", label: rs, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital_i", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-digr", value: "digitalr_i", class: "bt-digitalr", hclass: "ht-digr", label: rd, type: type, enabled: true });
				} else {
					toggleArr.push({ id: "mat-button-fis", value: "fisico_i", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital_i", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
				}
				break;
			default:
				this.directChannel = false;
				if (!this.isComisionGrossUp) {
					toggleArr.push({ id: "mat-button-fis", value: "fisico", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-fisr", value: "fisicor", class: "bt-fisicor", hclass: "ht-fisr", label: rs, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-digr", value: "digitalr", class: "bt-digitalr", hclass: "ht-digr", label: rd, type: type, enabled: true });
				} else {
					toggleArr.push({ id: "mat-button-fis", value: "fisico", class: "bt-fisico", hclass: "ht-fis", label: st, type: type, enabled: true });
					toggleArr.push({ id: "mat-button-dig", value: "digital", class: "bt-digital", hclass: "ht-dig", label: di, type: type, enabled: true });
				}
				break;
		}
		this.filterSelectedColl = toggleArr;
	}

	loadButtonTypes(types: string[]) {
		this.filterChannelColl = [];
		const xxx = this.filterChannelCollMaster;
		for (let index = 0; index < xxx.length; index++) {
			const element = xxx[index];
			const fndType = types.find(x => x === element.value);
			if (fndType !== undefined) {
				this.filterChannelColl.push(this.filterChannelCollMaster.find(x => x.value === fndType));
			}
		}
	}

	changeMode(e) {
		this.lnkChannelCtrl.setValue('');
		this.loadSearchChannel();
		this.chgroupSelected = '';
		this.premiumlayout = !this.premiumlayout;
		this.isComisionGrossUp = false;

		if (!this.premiumlayout) {
			this.premiumbase = false;
			const xxx = this.getLinkedChannel();
			if (xxx) {
				if (xxx.length > 0) {
					this.lnkChannelCtrl.setValue(xxx[0]);

					this.changeChannel(xxx[0]);
				}
			} else {
				this.loadButtonToggle('BROKER');
				this.filterSelected = 'fisico_b';
				this.onFilterChange('fisico_b');
			}
		} else {
			this.premiumbase = this.premiumbaseori;
			this.loadButtonTypes([]);
			this.loadButtonToggle('PREMIUM');
			this.filterSelected = 'fisico';
			this.onFilterChange('fisico');
		}
	}

	changeChannel(e) {
		const chGR = this.mainFee.linkedchannels.find(x => x.channelGroup.id === this.lnkChannelCtrl.value.id);
		this.lnkChannel = e.value ? e.value.id : e.id;
		const arr = [];
		let haveDirect = false;
		this.haveDirectChannel = false;
		this.chgroupSelected = 'BROKER';
		for (let idx = 0; idx < chGR.channelGroup.channels.length; idx++) {
			const channel = chGR.channelGroup.channels[idx];
			for (let idy = 0; idy < channel.agents.length; idy++) {
				const agente = channel.agents[idy];
				const fnd = arr.find(x => x === agente.type);
				if (fnd === undefined) {
					if (agente.type === 'BROKER' && agente.coreType === '8') {
						haveDirect = true;
					}
					arr.push(agente.type);
				}
			}
		}
		this.haveDirectChannel = haveDirect;
		this.loadButtonTypes(arr);
		this.loadButtonToggle('BROKER');
		this.filterSelected = 'fisico_b';
		this.onFilterChange('fisico_b');
	}

	getLinkedChannel(): IMatrixChannelGroup[] {
		let arr: IMatrixChannelGroup[] = [];
		this.maxDate = moment(new Date());

		if (this.mainFee.linkedchannels !== undefined) {
			for (let index = 0; index < this.mainFee.linkedchannels.length; index++) {
				if (this.maxDate < moment(this.mainFee.linkedchannels[index].endDate)) {
					this.maxDate = moment(this.mainFee.linkedchannels[index].endDate);
				}

				const groupchannel = this.mainFee.linkedchannels[index].channelGroup;
				arr.push(groupchannel);
			}
		}
		arr = sortArray(arr, 'description', 1);
		return arr;
	}

	filtrarChannels() {
		const xxx = this.getLinkedChannel();
		if (!xxx) {
			return;
		}
		let search = this.lnkChannelFilterCtrl.value;
		if (!search) {
			this.filteredlnkChannel.next(xxx.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredlnkChannel.next(xxx.filter(gch => gch.description.toLowerCase().indexOf(search) > -1));
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(feeActions.FeeActionTypes.CreateFeeCompleted))
			.subscribe(response => {
				this.handleBack();
			});

		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(feeActions.FeeActionTypes.UpdateFeeCompleted))
			.subscribe(response => {
				this.handleBack();
			});
	}

	async loadMasterObjects() {

		await this.uses$.subscribe(useColl => {
			this.uses = useColl;
		});

		await this.riskgroups$.subscribe(grpRiesgoColl => {
			this.gruposRiesgoAllColl = grpRiesgoColl;
			const tmpGrupoRiesgo = grpRiesgoColl.filter(d => d.isActive);
			this.gruposRiesgoColl = tmpGrupoRiesgo;
		});

		await this.zones$.subscribe(zonasColl => {
			this.zonasAllColl = sortArray(zonasColl, 'indice', 1);
			const tmpZone = zonasColl.filter(d => d.active && d.description !== 'Nacional');
			this.zonasColl = sortArray(tmpZone, 'indice', 1);
		});



		this.items$.subscribe(arr => {
			this.items = arr;
		});

		this.verifyEdition();
		this.loadMainFee();
	}

	verifyEdition() {
		const mainpath = this.activatedRoute.snapshot.url[0].path;
		this.mainpath = mainpath;
		let loadtemplate = false;

		Object.keys(FeeType).forEach(key => {
			this.feetypes.push({ key: key, value: FeeType[key] });
		});

		if (mainpath === 'manage' || mainpath === 'specialchannel' || mainpath === 'managecampaign') {
			loadtemplate = false;
			this.iscampaign = this.mainpath === 'managecampaign' ? true : false;
		} else {
			loadtemplate = true;
			if (mainpath === 'clone') {
				this.isclone = true;
			} else if (mainpath === 'campaign') {
				this.iscampaign = true;
			}
		}

		if (loadtemplate) {
			this.isNew = false;
			this.mainIdTarifa = this.activatedRoute.snapshot.params['Id'];
			this.mainFeeOrigin = this.mainIdTarifa;
			setTimeout(() => { }, 1000);
			this.store.dispatch(new feeActions.LoadFee(this.mainIdTarifa, null));
			if (mainpath === 'details') {
				this.store.dispatch(new feeActions.LoadFeeUpdates(this.mainIdTarifa));
			}
		}
	}

	inivigchange() {
		this.frmValues.finVig = null;
	}

	populateHeaderNames(): string[] {
		const mHeaderColl = ['Uso', 'Clase'];
		const zonasColl = sortArray(this.mainFee.zones, 'indice', 1);
		zonasColl.forEach(zone => {
			if (zone.status === 1) {
				mHeaderColl.push(zone.description);
			}
		});
		return mHeaderColl;
	}

	option(opt: number) {
		const zoneCollValue: Array<IFeeZoneValue> = [];
		const filas: Array<IFeeRisk> = [];

		if (this.zonasColl.length === 0) {
			this.confirmService.confirm({ title: 'Error', message: 'No se encontraron zonas activas.', showcancel: false });
			return;
		}

		if (this.gruposRiesgoColl.length === 0) {
			this.confirmService.confirm({ title: 'Error', message: 'No se encontraron grupos de riesgo activos.', showcancel: false });
			return;
		}

		for (let idx = 0; idx < this.zonasColl.length; idx++) {
			const zone = this.zonasColl[idx];
			zoneCollValue.push({
				idZone: zone.id,
				premium: {
					fisico: 0,
					fisicoRenovacion: 0,
					digital: 0,
					digitalRenovacion: 0
				},
				commission: [],
				status: 1
			});
		}

		for (let idx = 0; idx < this.gruposRiesgoColl.length; idx++) {
			const gruporiesgo = this.gruposRiesgoColl[idx];
			filas.push({
				id: gruporiesgo.id,
				vehicleUse: gruporiesgo.vehicleUse,
				fullDescription: this.calculateDescription(gruporiesgo.subGroups),
				description: gruporiesgo.description.replace(/\n/g, ' '),
				feeZone: zoneCollValue,
				isActive: true,
				indice: gruporiesgo.order,
				origin: false
			});
		}

		switch (opt) {
			case 1:
				this.mainFee.zones = this.zonasColl.map(v => {
					v.status = 1;
					return v;
				});
				// this.mainFee.zones = sortArray(this.mainFee.zones, "description", 1);
				this.mainFee.zones = this.mainFee.zones.sort(function (a, b) {
					return a.description.localeCompare(b.description);
				});
				this.mainFee.rows = filas;
				break;
			case 2:
				this.mainFee.zones = this.zonasColl.map(v => {
					v.status = 1;
					return v;
				});
				// this.mainFee.zones = sortArray(this.mainFee.zones, "description", 1);
				this.mainFee.zones = this.mainFee.zones.sort(function (a, b) {
					return a.description.localeCompare(b.description);
				});
				this.mainFee.rows = [];
				this.openRiskGroupPicker();
				break;
			case 3:
				// this.mainFee.zones = sortArray(this.mainFee.zones, "description", 1);
				this.mainFee.zones = this.mainFee.zones.sort(function (a, b) {
					return a.description.localeCompare(b.description);
				});
				this.mainFee.zones = this.zonasColl.map(v => {
					v.status = 0;
					return v;
				});
				this.mainFee.rows = filas;
				this.openZonePicker();
				break;
			default:
				break;
		}

		this.populateTable();
	}

	loadMainFee() {
		if (this.isNew) {
			this.mainFee = {
				idTarifa: null,
				description: null,
				type: null,
				startDate: null,
				endDate: null,
				effectDate: null,
				updatedAt: null,
				state: null,
				asociated: null,
				currency: null,
				target: null,
				zones: [],
				rows: [],
				riskGroups: [],
				linkedchannels: [],
				derivedChilds: [],
				premiumbase: false,
				mainParent: null
			};
			this.frmValues.iniVig = moment();
			this.frmValues.moneda = 'PEN';
			this.frmValues.sector = 'PRIVATE';
			this.handleControls();
		} else {
			if (this.firstLoad) {
				this._spinner.show();
				this.item$.subscribe(mFee => {
					if (mFee) {
						this.mainFee = mFee;
						this.setForm(mFee);
						this.firstLoad = false;
						this.loadDetail();
						this.populateTable();
					}
				});
			} else {
				this.loadDetail();
			}
		}
	}

	loadDetail() {
		const zoneCollValue: Array<IFeeZoneValue> = [];
		for (let idx = 0; idx < this.mainFee.zones.length; idx++) {
			const zone = this.mainFee.zones[idx];
			// zone.status = 1;
			zoneCollValue.push({
				idZone: zone.id,
				premium: {
					fisico: 0,
					fisicoRenovacion: 0,
					digital: 0,
					digitalRenovacion: 0
				},
				commission: [],
				status: 0
			});
		}
		if (this.mainFee.rows) {
			/* 	this.mainFee.rows = this.mainFee.rows.sort(function (a, b) {
							const nameA = Number(a.vehicleUse.order) + '-' + Number(a.indice),
									nameB = Number(b.vehicleUse.order) + '-' + Number(b.indice);
							if (nameA < nameB) {
									return -1;
							}
							if (nameA > nameB) {
									return 1;
							}
							return 0;
					}); */

			for (let idx = 0; idx < zoneCollValue.length; idx++) {
				const zoneCV = zoneCollValue[idx];
				for (let idxRG = 0; idxRG < this.mainFee.rows.length; idxRG++) {
					const gruporiesgo = this.mainFee.rows[idxRG];
					let mrisk = this.gruposRiesgoAllColl.find(xx => xx.id === gruporiesgo.id);
					if (!this.isNew && mrisk === undefined) {
						mrisk = this.gruposRiesgoEditColl.find(xx => xx.id === gruporiesgo.id);
					}
					gruporiesgo.fullDescription = mrisk.subGroups ? this.calculateDescription(mrisk.subGroups) : '';
					const existZoneInFee = gruporiesgo.feeZone.find(xx => xx.idZone === zoneCV.idZone);
					if (!existZoneInFee) {
						gruporiesgo.feeZone.push(zoneCV);
					}
				}
			}
		}
	}

	createStructureNew() {
		const feeColTemp = [];
		const feeColWidth = [100, 350];
		this.rowData = [];


		if (this.mainFee) {


			this.mainFee.rows.forEach(groupRisk => {
				if (this.uses !== undefined) {
					if (this.uses.length > 0) {
						const orderUse = this.uses.find(x => Number(x.id) === Number(groupRisk.vehicleUse.id)).order;
						if (orderUse !== undefined) {
							groupRisk.vehicleUse.order = orderUse;
							const orden = groupRisk.vehicleUse.order;
						}
					}
				}
			});


			this.mainFee.rows = this.mainFee.rows.sort(function (a, b) {

				const nameA = Number(a.vehicleUse.order) * 1000;
				const nameB = Number(b.vehicleUse.order) * 1000;

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});

			this.mainFee.rows.forEach(groupRisk => {
				const myJson = {
					id: groupRisk.id,
					use: this.capitalizeString(groupRisk.vehicleUse.description.toLowerCase()),
					description: groupRisk,
					feeZone: {}
				};
				groupRisk.feeZone.forEach(zones => {
					const objName = 'obj' + zones.idZone;

					let objValueFisico = 0;

					if (this.premiumlayout) {
						switch (this.filterSelected) {
							case 'fisico':
								objValueFisico = zones.premium.fisico ? zones.premium.fisico : 0;
								break;
							case 'fisicor':
								objValueFisico = zones.premium.fisicoRenovacion ? zones.premium.fisicoRenovacion : 0;
								break;
							case 'digital':
								objValueFisico = zones.premium.digital ? zones.premium.digital : 0;
								break;
							case 'digitalr':
								objValueFisico = zones.premium.digitalRenovacion ? zones.premium.digitalRenovacion : 0;
								break;
						}
					} else {
						const commId = this.lnkChannel;
						const fndCommission = zones.commission.find(x => x.channelGroupId === commId);
						if (fndCommission !== undefined) {
							switch (this.filterSelected) {
								case "fisico_b":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.brokerCommission.standardCommission ?
											fndCommission.brokerCommission.standardCommission : 0;
									} else {
										objValueFisico = fndCommission.brokerCommission.standardGrossUpCommission ?
											fndCommission.brokerCommission.standardGrossUpCommission : 0;
									}
									break;
								case 'fisicor_b':
									objValueFisico = fndCommission.brokerCommission.renewalStandardCommission
										? fndCommission.brokerCommission.renewalStandardCommission
										: 0;
									break;
								case "digital_b":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.brokerCommission.digitalCommission ?
											fndCommission.brokerCommission.digitalCommission : 0;
									} else {
										objValueFisico = fndCommission.brokerCommission.digitalGrossUpCommission ?
											fndCommission.brokerCommission.digitalGrossUpCommission : 0;
									}
									break;
								case 'digitalr_b':
									objValueFisico = fndCommission.brokerCommission.renewalDigitalCommission
										? fndCommission.brokerCommission.renewalDigitalCommission
										: 0;
									break;
								case "fisico_i":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.middlemanCommission.standardCommission ?
											fndCommission.middlemanCommission.standardCommission : 0;
									} else {
										objValueFisico = fndCommission.middlemanCommission.standardGrossUpCommission ?
											fndCommission.middlemanCommission.standardGrossUpCommission : 0;
									}
									break;
								case 'fisicor_i':
									objValueFisico = fndCommission.middlemanCommission.renewalStandardCommission
										? fndCommission.middlemanCommission.renewalStandardCommission
										: 0;
									break;
								case "digital_i":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.middlemanCommission.digitalCommission ?
											fndCommission.middlemanCommission.digitalCommission : 0;
									} else {
										objValueFisico = fndCommission.middlemanCommission.digitalGrossUpCommission ?
											fndCommission.middlemanCommission.digitalGrossUpCommission : 0;
									}
									break;
								case 'digitalr_i':
									objValueFisico = fndCommission.middlemanCommission.renewalDigitalCommission
										? fndCommission.middlemanCommission.renewalDigitalCommission
										: 0;
									break;
								case "fisico_p":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.pointOfSaleCommission.standardCommission ?
											fndCommission.pointOfSaleCommission.standardCommission : 0;
									} else {
										objValueFisico = fndCommission.pointOfSaleCommission.standardGrossUpCommission ?
											fndCommission.pointOfSaleCommission.standardGrossUpCommission : 0;
									}
									break;
								case 'fisicor_p':
									objValueFisico = fndCommission.pointOfSaleCommission.renewalStandardCommission
										? fndCommission.pointOfSaleCommission.renewalStandardCommission
										: 0;
									break;
								case "digital_p":
									if (!this.isComisionGrossUp) {
										objValueFisico = fndCommission.pointOfSaleCommission.digitalCommission ?
											fndCommission.pointOfSaleCommission.digitalCommission : 0;
									} else {
										objValueFisico = fndCommission.pointOfSaleCommission.digitalGrossUpCommission ?
											fndCommission.pointOfSaleCommission.digitalGrossUpCommission : 0;
									}
									break;
								case 'digitalr_p':
									objValueFisico = fndCommission.pointOfSaleCommission.renewalDigitalCommission
										? fndCommission.pointOfSaleCommission.renewalDigitalCommission
										: 0;
									break;
							}
						}
					}

					myJson.feeZone[objName] = objValueFisico;
					const existe = function (element) {
						return element.data === 'feeZone.' + objName;
					};
					if (!feeColTemp.some(existe)) {
						const sFeeAddZone = this.mainFee.zones.find(x => x.id === zones.idZone);
						if (sFeeAddZone.status === 1) {
							feeColWidth.push(90);
							feeColTemp.push({
								id: objName,
								data: 'feeZone.' + objName,
								type: 'numeric',
								format: '0.00',
								numericFormat: { pattern: '0.00[0000]' },
								renderer: percentRenderer,
								allowInvalid: false,
								allowEmpty: false,
								validator: this.validateNumeric,
								isZone: true,
								IdZone: zones.idZone,
								strict: true,
								positionY: sFeeAddZone.indice,
								statusY: sFeeAddZone.status
							});
						}
					}
				});
				if (groupRisk.isActive) {
					this.rowData.push(myJson);
				}
			});
		}
		const mColumnsColl = [];
		mColumnsColl.push({
			data: 'use',
			type: 'text',
			readOnly: true,
			isZone: false,
			renderer: headerRenderer,
			editor: false
		});
		mColumnsColl.push({
			data: 'description',
			type: 'text',
			readOnly: true,
			isZone: false,
			renderer: headerRenderer,
			editor: false
		});

		const feeColTempColl = sortArray(feeColTemp, 'positionY', 1).filter(x => x.statusY === 1);
		feeColTempColl.forEach(element => {
			mColumnsColl.push(element);
		});

		return { columns: mColumnsColl, colWidths: feeColWidth };
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
			colHeaders: this.populateHeaderNames(),
			columns: gds.columns, //
			fixedRowsTop: 0,
			fixedColumnsLeft: 2,
			rowHeaders: false,
			manualColumnMove: false,
			manualRowMove: false,
			columnSorting: false,
			readOnly: !this.canEdit || this.premiumbase || this.directChannel,
			manualColumnResize: false,
			colWidths: gds.colWidths,
			autoRowSize: true,
			wordWrap: true,
			comments: false,
			mergeCells: this.mergeData(),
			outsideClickDeselects: false,
			className: this.getHeaderColor(),
			afterChange: function (changes, source) {
				updateCollection2(changes, source, false, null);
			},
			afterSelectionEnd: function (r, c, r2, c2) {
				if (!isNaN(r)) {
					calculateResume(null, [r, c, r2, c2], setResume);
				} else {
					calculateResume(r, r.getSelected()[0], setResume);
				}
			},
			beforeRender: () => { },
			afterLoadData: () => { }
		};

		if (this.hot) {
			setTimeout(() => {
				this.hot.getInstance(this.instance2).updateSettings({ className: '' }, true);
				this.hot.getInstance(this.instance2).updateSettings(this.settings2, false);
				this.hot.getInstance(this.instance2).render();
				this.hot.getInstance(this.instance2).deselectCell();
				this.hideSpinner();
			}, 0);
		} else {
			this.hideSpinner();
		}
	}

	updateCollection2(c, s, masive, masivevalue) {
		let element: IFeeRisk;
		let ttt: IFeeZoneValue;

		const mainTmpFee = JSON.parse(JSON.stringify(this.mainFee));

		for (let index = 0; index < mainTmpFee.rows.length; index++) {
			element = mainTmpFee.rows[index];
			const sData = this.rowData.find(function (item) {
				return item.id === element.id;
			});

			if (sData) {
				const feeZoneColl = sData.feeZone;
				const objfeeZoneColl = Object.keys(feeZoneColl);

				for (let headerIdx = 0; headerIdx < objfeeZoneColl.length; headerIdx++) {
					const header = objfeeZoneColl[headerIdx];
					const zoneHeaderIdZone = header.replace('obj', '');
					const riskValue = masive ? masivevalue : feeZoneColl[header];

					ttt = element.feeZone.find(items => {
						return items.idZone === zoneHeaderIdZone;
					});
					if (!ttt) {
						element.feeZone.push({
							idZone: zoneHeaderIdZone,
							premium: {
								fisico: 0,
								fisicoRenovacion: 0,
								digital: 0,
								digitalRenovacion: 0
							},
							commission: [],
							status: 0
						});
					} else {
						if (this.premiumlayout) {
							switch (this.actualSoatType) {
								case 'fisico':
									ttt.premium.fisico = riskValue;
									break;
								case 'fisicor':
									ttt.premium.fisicoRenovacion = riskValue;
									break;
								case 'digital':
									ttt.premium.digital = riskValue;
									break;
								case 'digitalr':
									ttt.premium.digitalRenovacion = riskValue;
									break;
							}
						} else {
							const commId = this.lnkChannel;
							if (this.mainFee.linkedchannels !== undefined) {
								if (this.mainFee.linkedchannels.length > 0) {
									let fnd = ttt.commission.find(x => x.channelGroupId === commId);
									if (fnd === undefined) {
										ttt.commission.push(this.getCommissionDefault(commId));
										fnd = ttt.commission.find(x => x.channelGroupId === commId);
									}
									switch (this.actualSoatType) {
										case "fisico_b":
											if (!this.isComisionGrossUp) {
												fnd.brokerCommission.standardCommission = riskValue;
											} else {
												fnd.brokerCommission.standardGrossUpCommission = riskValue;
											}
											break;
										case 'fisicor_b':
											fnd.brokerCommission.renewalStandardCommission = riskValue;
											break;
										case "digital_b":
											if (!this.isComisionGrossUp) {
												fnd.brokerCommission.digitalCommission = riskValue;
											} else {
												fnd.brokerCommission.digitalGrossUpCommission = riskValue;
											}
											break;
										case 'digitalr_b':
											fnd.brokerCommission.renewalDigitalCommission = riskValue;
											break;

										case "fisico_i":
											if (!this.isComisionGrossUp) {
												fnd.middlemanCommission.standardCommission = riskValue;
											} else {
												fnd.middlemanCommission.standardGrossUpCommission = riskValue;
											}
											break;
										case 'fisicor_i':
											fnd.middlemanCommission.renewalStandardCommission = riskValue;
											break;
										case "digital_i":
											if (!this.isComisionGrossUp) {
												fnd.middlemanCommission.digitalCommission = riskValue;
											} else {
												fnd.middlemanCommission.digitalGrossUpCommission = riskValue;
											}
											break;
										case 'digitalr_i':
											fnd.middlemanCommission.renewalDigitalCommission = riskValue;
											break;

										case "fisico_p":
											if (!this.isComisionGrossUp) {
												fnd.pointOfSaleCommission.standardCommission = riskValue;
											} else {
												fnd.pointOfSaleCommission.standardGrossUpCommission = riskValue;
											}
											break;
										case 'fisicor_p':
											fnd.pointOfSaleCommission.renewalStandardCommission = riskValue;
											break;
										case "digital_p":
											if (!this.isComisionGrossUp) {
												fnd.pointOfSaleCommission.digitalCommission = riskValue;
											} else {
												fnd.pointOfSaleCommission.digitalGrossUpCommission = riskValue;
											}
											break;
										case 'digitalr_p':
											fnd.pointOfSaleCommission.renewalDigitalCommission = riskValue;
											break;
									}
								}
							}
						}
					}
				}
			}
		}
		this.mainFee = JSON.parse(JSON.stringify(mainTmpFee));
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

	setResume(q, s, min, max, b) {
		if (b) {
			this.avgCell = (s / q).toFixed(2);
			this.canCell = q.toFixed(1);
			this.sumCell = s.toFixed(2);
			this.minCell = min.toFixed(2);
			this.maxCell = max.toFixed(2);
		} else {
			this.avgCell = '0.00';
			this.canCell = '0';
			this.sumCell = '0.00';
			this.minCell = '0.00';
			this.maxCell = '0.00';
		}
	}

	capitalizeString(s) {
		return s && s[0].toUpperCase() + s.slice(1);
	}

	mergeData() {
		const mergeUse = [];
		if (this.mainFee.rows) {
			if (this.mainFee.rows.length > 1) {
				for (let Idx = 0; Idx < this.mainFee.rows.length; Idx++) {
					const gruporiesgo = this.mainFee.rows[Idx];
					if (gruporiesgo.isActive) {
						let entryFound = false;
						const tempObj = {
							name: this.capitalizeString(gruporiesgo.vehicleUse.description.toLowerCase()),
							count: 1
						};

						for (const item of mergeUse) {
							if (item.name === tempObj.name) {
								item.count++;
								entryFound = true;
								break;
							}
						}
						if (!entryFound) {
							mergeUse.push(tempObj);
						}
					}
				}
			}
		}
		const mergeColl = [];
		let tmpRow = 0;

		for (let Idx = 0; Idx < mergeUse.length; Idx++) {
			const mergeItem = mergeUse[Idx];
			const myMerge = { row: tmpRow, col: 0, rowspan: mergeItem.count, colspan: 1 };
			tmpRow = mergeItem.count + tmpRow;
			mergeColl.push(myMerge);
		}

		return mergeColl.filter(x => x.rowspan !== 1);
	}

	validateNumeric = function (value, callback) {
		if (value === '') {
			callback(true);
		} else {
			const regexp = /^\d+(\.\d{1,2})?$/;
			if (regexp.test(value)) {
				const numbers = value.toString().split('.');
				const preDecimal = numbers[0];
				if (preDecimal.length > 6) {
					callback(false);
				} else {
					callback(true);
				}
			} else {
				callback(false);
			}
		}
	};

	getHeaderColor() {
		return this.filterSelectedColl.find(x => x.value === this.filterSelected).hclass;
	}

	onFilterChange(e) {
		this.hot.getInstance(this.instance2).updateSettings({ className: '' }, true);
		this.hot.getInstance(this.instance2).updateSettings({ className: this.getHeaderColor() }, false);
		this.populateTable();
		this.setResume(0, 0, 0, 0, false);
		this.actualSoatType = e;
	}

	onComissionTypeChange() {
		switch (this.chgroupSelected) {
			case 'BROKER':
				this.loadButtonToggle(this.chgroupSelected);
				this.filterSelected = 'fisico_b';
				this.onFilterChange('fisico_b');
				break;
			case 'MIDDLEMAN':
				this.loadButtonToggle(this.chgroupSelected);
				this.filterSelected = 'fisico_i';
				this.onFilterChange('fisico_i');
				break;
			default:
				break;
		}
		this.populateTable();
	}

	hideSpinner() {
		setTimeout(() => {
			this._spinner.hide();
		}, 500);
	}

	openZonePicker() {
		const tmpZO = JSON.parse(JSON.stringify(this.mainFee.zones));
		const tmpZE = JSON.parse(JSON.stringify(this.zoneEditColl));
		const dialogRef = this.dialog.open(ZonePickerDialogComponent, {
			width: '810px',
			disableClose: true,
			data: {
				zones: tmpZO,
				delete: true,
				isnew: this.isNew,
				premiumbase: this.premiumbase,
				zonasBase: tmpZE
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.updateZones(result);
			}
		});
	}

	openRiskGroupPicker() {
		const tmpGR = JSON.parse(JSON.stringify(this.mainFee.rows));
		const dialogRef = this.dialog.open(RiskGroupPickerDialogComponent, {
			width: '1100px',
			disableClose: true,
			data: {
				riskgroup: tmpGR,
				delete: true,
				isnew: this.isNew,
				premiumbase: this.premiumbase,
				gruposRiesgoBase: tmpGR // this.gruposRiesgoEditColl
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.updateRiskGroups(result);
				this._spinner.hide();
			}
		});
	}

	openChannels() {
		const mlinked: ILinkedChannel[] = [];

		const tmpLC = JSON.parse(JSON.stringify(this.mainFee.linkedchannels));
		const dialogRef = this.dialog.open(FeeAssociateChannelDialogComponent, {
			disableClose: true,
			width: '1200px',
			data: { linked: tmpLC, canEdit: this.canEdit, feeStart: this.frmValues.iniVig, feeEnd: this.frmValues.finVig }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.mainFee.linkedchannels = result;
				if (!this.premiumlayout) {
					this.changeMode(true);
				}
			}
		});
	}

	updateZones(zones: IFeeZone[]) {
		const zoneCollValue: Array<IFeeZoneValue> = [];

		for (let Idx = 0; Idx < zones.length; Idx++) {
			const zoneAdded = zones[Idx];
			const existZoneInFee = this.mainFee.zones.find(xx => xx.id === zoneAdded.id);
			if (!existZoneInFee) {
				this.mainFee.zones.push(zoneAdded);
			}
		}


		for (let Idx = 0; Idx < this.mainFee.zones.length; Idx++) {
			const zone = this.mainFee.zones[Idx];
			const existZoneInFee = zones.find(xx => xx.id === zone.id);
			if (existZoneInFee) {
				zone.status = existZoneInFee.status;
				zone.indice = existZoneInFee.indice;
				zoneCollValue.push({
					idZone: zone.id,
					premium: {
						fisico: 0,
						fisicoRenovacion: 0,
						digital: 0,
						digitalRenovacion: 0
					},
					commission: [],
					status: 0
				});
			} else {
				zone.status = 0;
			}
		}

		// for (let Idx = 0; Idx < zones.length; Idx++) {
		// 	const zoneAdded = zones[Idx];
		// 	const existZoneInFee = this.mainFee.zones.find(xx => xx.id === zoneAdded.id);
		// 	if (!existZoneInFee) {
		// 		zoneCollValue.push({
		// 			idZone: zoneAdded.id,
		// 			premium: {
		// 				fisico: 0,
		// 				fisicoRenovacion: 0,
		// 				digital: 0,
		// 				digitalRenovacion: 0
		// 			},
		// 			commission: [],
		// 			status: 0
		// 		});
		// 	}
		// }

		for (let Idx = 0; Idx < zoneCollValue.length; Idx++) {
			const zoneCV = zoneCollValue[Idx];
			for (let IdxGR = 0; IdxGR < this.mainFee.rows.length; IdxGR++) {
				const gruporiesgo = this.mainFee.rows[IdxGR];
				const existZoneInFee = gruporiesgo.feeZone.find(xx => xx.idZone === zoneCV.idZone);
				if (!existZoneInFee) {
					gruporiesgo.feeZone.push(zoneCV);
				}
			}
		}
		console.log(zones);
		this.populateTable();
	}

	getCommissionDefault(channelId: string) {
		const detComm: ICommissionsDetail = {
			standardCommission: 0,
			digitalCommission: 0,
			renewalStandardCommission: 0,
			renewalDigitalCommission: 0,
			standardGrossUpCommission: 0,
			digitalGrossUpCommission: 0
		};
		const jsoncomm: ICommissions = {
			channelGroupId: channelId,
			brokerCommission: detComm,
			middlemanCommission: detComm,
			pointOfSaleCommission: detComm
		};
		return jsoncomm;
	}

	updateRiskGroups(riskgroups: RiskGroup[]) {
		const zoneCollValue: Array<IFeeZoneValue> = [];
		this.mainFee.zones.forEach(zone => {
			zoneCollValue.push({
				idZone: zone.id,
				premium: {
					fisico: 0,
					fisicoRenovacion: 0,
					digital: 0,
					digitalRenovacion: 0
				},
				commission: [],
				status: 0
			});
		});

		for (let idxRG = 0; idxRG < riskgroups.length; idxRG++) {
			const rg = riskgroups[idxRG];
			const fndGroup = this.mainFee.rows.find(x => x.id === rg.id);

			if (rg.vehicleUse.id === '14' || rg.vehicleUse.id === '15') {
				console.log(rg);
			}

			let mrisk = this.gruposRiesgoAllColl.find(xx => xx.id === rg.id);
			if (!this.isNew && mrisk === undefined) {
				mrisk = this.gruposRiesgoEditColl.find(xx => xx.id === rg.id);
			}
			if (fndGroup == null) {
				this.mainFee.rows.push({
					id: rg.id,
					vehicleUse: rg.vehicleUse,
					fullDescription: mrisk.subGroups ? this.calculateDescription(mrisk.subGroups) : '',
					description: rg.description.replace(/\n/g, ' '),
					feeZone: zoneCollValue,
					isActive: true,
					indice: rg.indice,
					origin: false
				});
			} else {
				fndGroup.indice = rg.indice;
				fndGroup.isActive = rg.isActive;
			}
		}

		this.mainFee.rows.forEach(rgr => {
			if (rgr.feeZone == null) {
				rgr.feeZone = zoneCollValue;
			}
		});

		this.mainFee.rows = this.mainFee.rows.sort(function (a, b) {
			const nameA = Number(a.vehicleUse.order) * 1000 + Number(a.indice),
				nameB = Number(b.vehicleUse.order) * 1000 + Number(b.indice);
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});
		this.populateTable();
	}

	setForm(fee: Fee) {
		const iniVig = fee.startDate ? moment(fee.startDate, 'DD/MM/YYYY') : null;
		const finVig = fee.endDate ? moment(fee.endDate, 'DD/MM/YYYY') : null;
		this.gruposRiesgoEditColl = fee.riskGroups;
		this.zoneEditColl = fee.zones;
		this.estado = fee.state === true ? 'ACTIVO' : 'INACTIVO';

		if (this.firstLoad) {
			this.originDate = fee.updatedAt;
		}

		let feetype = '';
		if (this.mainpath === 'manage') {
			feetype = 'BASE';
		} else if (this.mainpath === 'details' || this.mainpath === 'clone') {
			feetype = fee.type;
			this.iscampaign = feetype === 'CAMPAIGN' ? true : false;
			if (this.mainFee.mainParent) {
				this.derivedChildMin = this.mainFee.mainParent.endDate;
			}
			if (feetype === 'BASE') {
				this.derivedChilds = fee.derivedChilds.filter(x => x.endDate != null);
				let minEndDate = null;
				if (this.derivedChilds.length > 0) {
					minEndDate = this.derivedChilds[0].endDate;
					for (let idxD = 0; idxD < this.derivedChilds.length; idxD++) {
						const element = this.derivedChilds[idxD];
						if (element.endDate) {
							if (element.endDate < minEndDate) {
								minEndDate = element.endDate;
							}
						}
					}
				}
				this.derivedChildMin = minEndDate;
			}
		} else if (this.mainpath === 'campaign') {
			feetype = 'CAMPAIGN';
		} else if (this.mainpath === 'specialchannel' || this.mainpath === 'basechannel' || this.mainpath === 'basespecialchannel') {
			feetype = 'SPECIAL';
		}

		this.lastEffectDate = fee.effectDate;
		this.frmValues = {
			description: fee.description,
			iniVig: iniVig,
			finVig: finVig,
			moneda: fee.currency,
			sector: fee.target,
			tipo: feetype,
			version: this.changeVersionDate ? this.frmValues.version : fee.updatedAt,
			effectdate: fee.effectDate
		};

		this.isspecial = feetype === 'SPECIAL' ? true : false;

		this.handleControls();
		this.loadSearchChannel();
	}

	handleControls() {
		// spacuilachannel : sin tarifario base
		// basechaneel Primas base
		// basespecialchannel : Primas especiales
		this.iniMin = moment();
		if (this.mainpath === 'manage' || this.mainpath === 'managecampaign') {
			this.frmValues.iniVig = moment();
			this.disableDescription = false;
			this.disableIniVig = false;
			this.disableFinVig = false;
			this.disableMoneda = false;
			this.disableSector = false;
			this.disableVersion = true;
			this.showStateEffect = false;
			this.frmValues.tipo = this.mainpath === 'manage' ? 'BASE' : 'CAMPAIGN';
			this.isspecial = this.mainpath === 'manage' ? false : true;
		} else {
			if (!this.canEdit) {
				this.disableDescription = true;
				this.disableIniVig = true;
				this.disableFinVig = true;
				this.disableMoneda = true;
				this.disableSector = true;
				this.disableVersion = false;
				this.showStateEffect = true;
			} else if (this.mainpath === 'details') {
				this.disableDescription = false;
				this.disableIniVig = true;
				this.disableFinVig = false;
				this.disableMoneda = true;
				this.disableSector = true;
				this.disableVersion = false;
				this.showStateEffect = true;
				this.premiumbaseori = JSON.parse(JSON.stringify(this.mainFee.premiumbase));
				this.premiumbase = this.premiumbaseori;

				if (this.premiumbase) {
					this.parentFeeDescription = 'Tarifario padre: ' + this.mainFee.mainParent.description;
					/* 	this.parentFeeDescription = this.parentFeeDescription + "(" + this.frmValues.iniVig;

							const finVig = this.frmValues.finVig ? this.frmValues.finVig : null;
							if (finVig != null) {
									this.parentFeeDescription = this.parentFeeDescription + "-" + finVig + ")";
							} else {
									this.parentFeeDescription = this.parentFeeDescription + ")";
							} */
				}
			} else if (this.mainpath === 'campaign') {
				this.frmValues.iniVig = moment();
				this.frmValues.description = '';
				this.disableDescription = false;
				this.disableIniVig = false;
				this.disableFinVig = false;
				this.disableMoneda = true;
				this.disableSector = true;
				this.disableVersion = true;
				this.showStateEffect = false;
			} else if (this.mainpath === 'clone') {
				this.frmValues.description = '';
				this.disableDescription = false;
				this.disableIniVig = false;
				this.disableFinVig = false;
				this.disableMoneda = false;
				this.disableSector = false;
				this.disableVersion = true;
				this.showStateEffect = false;
			} else if (this.mainpath === 'specialchannel' || this.mainpath === 'basechannel' || this.mainpath === 'basespecialchannel') {
				this.isspecial = true;
				this.frmValues.description = '';
				this.frmValues.iniVig = null;
				this.frmValues.finVig = null;
				this.frmValues.tipo = 'SPECIAL';
				this.disableDescription = false;
				this.disableIniVig = false;
				this.disableFinVig = false;
				this.disableMoneda = false;
				this.disableSector = false;
				this.disableVersion = true;
				this.showStateEffect = false;
				this.premiumbase = this.mainpath === 'basechannel' ? true : false;
			}
		}
	}

	save() {
		const description = this.frmValues.description
			? this.frmValues.description
				.toString()
				.toLocaleLowerCase()
				.trim()
			: '';

		if (description === '') {
			this.confirmService.confirm({ title: 'Error', message: 'Ingrese una descripción válida.', showcancel: false });
			return;
		}

		let existsdescription = 0;
		if (this.isNew) {
			existsdescription = this.items.filter(x => x.description.toLocaleLowerCase().trim() === description).length;
		} else {
			existsdescription = this.items.filter(x => x.description.toLocaleLowerCase().trim() === description && x.idTarifa !== this.mainIdTarifa).length;
		}

		if (existsdescription > 0) {
			this.confirmService.confirm({ title: 'Error', message: 'La descripción ingresada ya existe en otro tarifario.', showcancel: false });
			return;
		}

		const iniVig = moment(this.frmValues.iniVig, 'DD/MM/YYYY');
		if (!iniVig.isValid()) {
			this.confirmService.confirm({ title: 'Error', message: 'Ingrese una fecha de inicio de vigencia válida.', showcancel: false });
			return;
		}

		if (this.iscampaign && this.frmValues.finVig === null) {
			this.confirmService.confirm({ title: 'Error', message: 'Ingrese una fecha de fin de vigencia válida.', showcancel: false });
			return;
		}

		const finVig = this.frmValues.finVig ? moment(this.frmValues.finVig, 'DD/MM/YYYY') : null;
		if (finVig != null) {
			if (!finVig.isValid()) {
				this.confirmService.confirm({ title: 'Error', message: 'Ingrese una fecha de fin de vigencia válida.', showcancel: false });
				return;
			}
			if (iniVig.format('YYYY-MM-DD') !== finVig.format('YYYY-MM-DD') && finVig <= iniVig) {
				this.confirmService.confirm({
					title: 'Error',
					message: 'Fin de vigencia inválido, no puede ser menor o igual que el inicio de vigencia.',
					showcancel: false
				});
				return;
			}
		}
		if (this.isNew) {
			const atLeastOneCell = this.validateNewFee();
			if (!atLeastOneCell) {
				this._spinner.hide();
				this.confirmService.confirm({
					title: 'Error',
					message: 'Debe llenar al menos una prima en el tarifario.',
					showcancel: false
				});
				return;
			}
		}
		const tariff = this.transformToMatrix();
		let createfee: boolean = false;
		if (this.mainpath !== 'details') {
			if (this.isNew || this.isclone || this.iscampaign || this.isspecial) {
				createfee = true;
			}
		}
		if (createfee) {
			this.confirmService
				.confirm({
					title: 'Confirmación',
					message: '¿Está seguro de guardar los cambios en el tarifario?',
					showcancel: true
				})
				.subscribe(x => {
					if (x === true) {
						tariff.effectDate = this.frmValues.iniVig;
						this._spinner.show();
						this.store.dispatch(new feeActions.CreateFee(tariff));
						setTimeout(() => { console.log('tarifa registrada'); }, 3000);
					}
				});
		} else {
			this.effectDateService
				.confirm({
					title: 'Confirmación',
					message: '¿Está seguro de guardar los cambios en el tarifario?',
					showcancel: true,
					effecdate: this.lastEffectDate,
					mindate: this.lastEffectDate,
					maxdate: finVig
				})
				.subscribe((x: any) => {
					if (x.res === true) {
						const now = moment();
						// const sTime = now.format("YYYY-MM-DD") !== x.val.format("YYYY-MM-DD") ? '05:00:01.000Z' : now.toISOString().split("T")[1];
						// (now.zone(0) as any)._d.toLocaleTimeString();
						// const sdate = x.val.format("YYYY-MM-DD") + 'T' + sTime;
						if (this.isNew) {
							tariff.effectDate = x.val.toISOString(); // sdate;
						} else {
							tariff.effectDate = x.val; // sdate;
						}
						this._spinner.show();
						this.store.dispatch(new feeActions.UpdateFee(tariff));
						setTimeout(() => { console.log('tarifa actualizada'); }, 3000);
					}
				});
		}
	}

	openFeeMasive() {
		this.feeMasiveService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de aplicar este valor de forma masiva?',
				showcancel: true
			})
			.subscribe((x: any) => {
				if (x.res === true) {
					this.updateCollection2(null, null, true, x.val);
					this.populateTable();
				}
			});
	}

	transformToMatrix(): TariffMatrix {
		const tariffMatrix: TariffMatrix = new TariffMatrix(null);
		tariffMatrix.id = this.isNew ? null : this.mainIdTarifa;
		tariffMatrix.type = this.frmValues.tipo;
		tariffMatrix.startDate = this.frmValues.iniVig;
		tariffMatrix.endDate = this.frmValues.finVig;
		tariffMatrix.hasEndDate = this.frmValues.finVig === null ? false : true;
		tariffMatrix.description = this.frmValues.description;
		tariffMatrix.currency = this.frmValues.moneda;
		tariffMatrix.target = this.frmValues.sector;
		tariffMatrix.originTariffMatrix = null;
		if (this.mainpath === 'basechannel') {
			tariffMatrix.originTariffMatrix = this.mainFeeOrigin;
		}
		tariffMatrix.linkedChannelGroups = this.mainFee.linkedchannels;
		const details: ITariffMatrixItem[] = [];

		const zoneArr = sortArray(this.mainFee.zones, 'indice', 1);

		for (let index = 0; index < this.mainFee.rows.length; index++) {
			const feeItems = this.mainFee.rows[index];
			for (let detItem = 0; detItem < feeItems.feeZone.length; detItem++) {
				const zone = feeItems.feeZone[detItem];
				const existZoneInFee = zoneArr.find(xx => xx.id === zone.idZone);
				if (existZoneInFee) {
					if (existZoneInFee.status === 1) {
						if (feeItems.isActive) {
							details.push({
								riskGroupId: feeItems.id,
								areaGroupId: zone.idZone,
								standardPremium: zone.premium.fisico,
								digitalPremium: zone.premium.digital,
								renewalStandardPremium: zone.premium.fisicoRenovacion,
								renewalDigitalPremium: zone.premium.digitalRenovacion,
								commissions: zone.commission
							});
						}
					}
				}
			}
		}
		tariffMatrix.details = details;

		const areaDetails: IAreaGroup[] = [];
		const riskDetails: IRiskGroup[] = [];
		for (let idxZone = 0; idxZone < details.length; idxZone++) {
			const element = details[idxZone];
			const existsZone = areaDetails.filter(ar => ar.id === element.areaGroupId).length;
			if (existsZone === 0) {
				let mzone = this.zonasAllColl.find(xx => xx.id === element.areaGroupId);
				if (!this.isNew && mzone === undefined) {
					mzone = this.zoneEditColl.find(xx => xx.id === element.areaGroupId);
				}
				const sOrder = zoneArr.find(xx => xx.id === mzone.id);
				areaDetails.push({
					id: mzone.id,
					description: mzone.description,
					isActive: mzone.active,
					isUsed: mzone.used,
					departments: mzone.locations,
					order: sOrder ? sOrder.indice : 0
				});
			}
			const existsRisk = riskDetails.filter(ri => ri.id === element.riskGroupId).length;

			if (existsRisk === 0) {
				let mrisk = this.gruposRiesgoAllColl.find(xx => xx.id === element.riskGroupId);
				if (!this.isNew && mrisk === undefined) {
					mrisk = this.gruposRiesgoEditColl.find(xx => xx.id === element.riskGroupId);
				}
				riskDetails.push({
					id: mrisk.id,
					isBase: mrisk.isBase,
					order: mrisk.order,
					indice: mrisk.order,
					isActive: mrisk.isActive,
					isUsed: mrisk.isUsed,
					description: mrisk.description,
					vehicleUse: mrisk.vehicleUse,
					personType: mrisk.personType,
					subGroups: mrisk.subGroups
				});
			}
		}
		tariffMatrix.areaGroups = sortArray(areaDetails, 'order', 1);
		tariffMatrix.riskGroups = riskDetails;
		return tariffMatrix;
	}

	validateNewFee(): boolean {
		const mainTmpFee = JSON.parse(JSON.stringify(this.mainFee));
		for (let index = 0; index < mainTmpFee.rows.length; index++) {
			const element = mainTmpFee.rows[index].feeZone;
			for (let idx = 0; idx < element.length; idx++) {
				const premiumAsign = element[idx];
				const validFee =
					premiumAsign.premium.fisico + premiumAsign.premium.fisicoRenovacion + premiumAsign.premium.digital + premiumAsign.premium.digitalRenovacion;
				if (validFee > 0) {
					return true;
				}
			}
		}
		return false;
	}

	cancel() {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de cancelar?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.handleBack();
				}
			});
	}

	changeVersion() {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: 'Esta seguro de ver la versión seleccionada, se perderán los cambios actuales.',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.changeVersionDate = true;
					if (this.originDate === this.frmValues.version) {
						this.canEdit = true;
					} else {
						this.canEdit = false;
					}
					this.store.dispatch(new feeActions.LoadFee(this.mainIdTarifa, this.frmValues.version));
					this.handleControls();
				}
			});
	}

	handleBack() {
		if (this.frmValues.tipo !== 'BASE') {
			setTimeout(() => {
				this.router.navigate(['/fee/listspecial']);
			}, 5000);
		} else {
			setTimeout(() => {
				this.router.navigate(['/fee/list']);
			}, 5000);
		}
	}

	get showTableData() {
		const showTable = this.mainFee === undefined ? false : this.mainFee.rows.filter(v => v.isActive).length > 0;
		return showTable;
	}

	exportar(e: Event) {
		e.preventDefault();
		if (this.premiumlayout) {
			//  this.excel.exportarTarifario('Tarifario', this.settings2);
			const mHeaderColl = ['Uso', 'Clase', 'Tipo SOAT'];
			this.addZonesHeader(mHeaderColl);
			this.excel.exportPrimas(this.mainFee, mHeaderColl, this.getGeneralInformation());
		} else {
			const mHeaderCollPrima = ['Uso', 'Clase', 'Tipo SOAT'];
			const mHeaderCollComisiones = ['Brok/Inter', 'Tipo SOAT', 'Uso', 'Clase'];
			this.addZonesHeader(mHeaderCollPrima);
			this.addZonesHeader(mHeaderCollComisiones);
			this.excel.exportPrimasAndComissions(this.mainFee, mHeaderCollPrima, mHeaderCollComisiones, this.lnkChannel);
		}
	}

	private getGeneralInformation() {
		const format = 'dd/MM/yyyy';
		const locale = 'en-US';
		const selectedVersion: string = this.cardcontent.nativeElement.children[0].children[0].children[6].children[0].innerText;
		const version = selectedVersion.split('\t');
		const generalInfo = {
			description: this.frmValues.description,
			iniVig: (this.frmValues.iniVig) ? formatDate(this.frmValues.iniVig, format, locale) : '',
			finVig: (this.frmValues.finVig) ? formatDate(this.frmValues.finVig, format, locale) : '',
			moneda: (this.frmValues.moneda === 'PEN') ? 'Soles' : 'Dólares',
			sector: this.frmValues.sector,
			tarifarioPadre: (this.mainFee.mainParent) ? this.mainFee.mainParent.description : '',
			tipo: FeeType[this.frmValues.tipo],
			estado: (this.mainFee.state) ? 'Activo' : 'Inactivo',
			version: version[0],
			effectdate: (this.frmValues.effectdate) ? formatDate(this.frmValues.effectdate, format, locale) : '',
		};
		return generalInfo;
	}

	private addZonesHeader(mHeaderColl: string[]) {
		const zonasColl = sortArray(this.mainFee.zones, 'indice', 1);
		zonasColl.forEach(zone => {
			if (zone.status === 1) {
				mHeaderColl.push(zone.description);
			}
		});
	}

	calculateDescription(sg: SubGroups[]): string {
		const descriptions: string[] = [];
		// let personType: string = sg. !this.riskGroupForm.value.personType ? '' : this.getPersonType(this.riskGroupForm.value.personType);
		// 	personType = personType.length > 0 ? `Tipo de persona: ${personType}\n` : '';
		sg.map(x => {
			const clase = x.vehicleClass.description;
			let asientos: string = '';
			asientos = x.seatsRestriction ? this.getDescripcionDeAsientos(x.seatsRestriction) : '';
			asientos = asientos.length > 0 ? ` - ${asientos} asiento(s)` : '';
			const vehicleGroup = x.vehicleGroup;

			if (vehicleGroup) {
				const brandsAndModels: string[] = [];

				const groupByBrandSort = vehicleGroup.filters.sort(function (a, b) {
					const nameA = a.brandDescription.toString(),
						nameB = b.brandDescription.toString();
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});

				groupByBrandSort.map(y => {
					const modelsList: string[] = [];
					y.segmentedModels.map(z => {
						modelsList.push(z.description);
					});
					brandsAndModels.push(`${y.brandDescription} ( ${modelsList.join(', ')})`);
				});

				descriptions.push(
					`${clase}${asientos} - ${x.isExclusionVehicleGroup ? `(EXCLUIDO) ${brandsAndModels.join(', ')}` : brandsAndModels.join(', ')}`
				);
			} else {
				descriptions.push(`${clase}${asientos}`);
			}
		});
		const personType: string = '';
		return `${personType} ${descriptions.filter(x => x !== '').join(', \n')}`.toString().trim();
	}
	getDescripcionDeAsientos(seatsRestriction: SeatsRestriction): string {
		const currentOperator = this.getOperator(seatsRestriction);
		if (currentOperator === SeatConfigurationOperator.BETWEEN) {
			return currentOperator + ' ' + seatsRestriction.minLimit.value + ' y ' + seatsRestriction.maxLimit.value;
		}
		if (currentOperator === SeatConfigurationOperator.GREATER || currentOperator === SeatConfigurationOperator.GREATER_OR_EQUAL) {
			return currentOperator + ' ' + seatsRestriction.minLimit.value;
		}
		if (currentOperator === SeatConfigurationOperator.MINOR || currentOperator === SeatConfigurationOperator.MINOR_OR_EQUAL) {
			return currentOperator + ' ' + seatsRestriction.maxLimit.value;
		}
		if (currentOperator === SeatConfigurationOperator.EQUAL) {
			return currentOperator + ' ' + seatsRestriction.minLimit.value;
		}
	}
	getOperator(seatsRestriction: SeatsRestriction): SeatConfigurationOperator {
		if (!seatsRestriction) {
			return null;
		}
		if (seatsRestriction.minLimit && seatsRestriction.minLimit.type === SeatType.CLOSED && !seatsRestriction.maxLimit) {
			return SeatConfigurationOperator.GREATER_OR_EQUAL;
		}
		if (seatsRestriction.minLimit && seatsRestriction.minLimit.type === SeatType.OPEN && !seatsRestriction.maxLimit) {
			return SeatConfigurationOperator.GREATER;
		}
		if (
			seatsRestriction.minLimit &&
			seatsRestriction.maxLimit &&
			seatsRestriction.minLimit.type === seatsRestriction.maxLimit.type &&
			seatsRestriction.minLimit.value === seatsRestriction.maxLimit.value
		) {
			return SeatConfigurationOperator.EQUAL;
		}
		if (!seatsRestriction.minLimit && seatsRestriction.maxLimit && seatsRestriction.maxLimit.type === SeatType.CLOSED) {
			return SeatConfigurationOperator.MINOR_OR_EQUAL;
		}
		if (!seatsRestriction.minLimit && seatsRestriction.maxLimit && seatsRestriction.maxLimit.type === SeatType.OPEN) {
			return SeatConfigurationOperator.MINOR;
		}
		if (
			seatsRestriction.minLimit &&
			seatsRestriction.minLimit.type === SeatType.OPEN &&
			seatsRestriction.maxLimit &&
			seatsRestriction.maxLimit.type === SeatType.CLOSED
		) {
			return SeatConfigurationOperator.BETWEEN;
		}
	}

	filterGrossUP() {
		this.isComisionGrossUp = !this.isComisionGrossUp;
		this.onComissionTypeChange();
	}
}
