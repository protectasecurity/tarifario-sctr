import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { filter, switchAll } from 'rxjs/operators';
import { AccessMaping, AppModules, EActions } from '../../../../shared/security/access.mapping';
import { FileExportService } from '../../../../shared/services/file.export.service';
import * as feeActions from '../../_state/actions/fee.actions';
import * as fromReducer from '../../_state/reducers';
import { Fee, FeeType } from '../../models/fee.model';
import { FeePickerDialogComponent } from './../../../dashboard/components/fee-picker-dialog/fee-picker-dialog';

import { sortArray } from 'app/shared/helpers/utils';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { ChannelChildFeeDialogComponent } from '../../components/channel-child-fee-dialog/channel-child-fee-dialog';
import { TariffMatrix } from '../../models/tariffmatrix.model';
const { range } = extendMoment(moment);

@Component({
	selector: 'app-fee-list-special-container',
	templateUrl: './fee-list-special-container.component.html',
	styleUrls: ['./fee-list-special-container.component.css']
})
export class FeeListSpecialContainerComponent implements OnInit {
	displayedColumns: string[]; // = ['description', 'startDate', 'endDate', 'currency', 'type', 'changeDate', 'state', 'asociated', 'actions'];
	dataSource: MatTableDataSource<Fee>;
	dateFormat = 'DD/MM/YYYY';
	public items$: Observable<Fee[]>;
	public feeList: Fee[];
	public feeListChannel: Fee[];

	descriptionFilter = new FormControl();
	iniVigFilter = new FormControl('VIGENTE');
	monedaFilter = new FormControl();
	sectorFilter = new FormControl();
	tipoFilter = new FormControl();
	stateFilter = new FormControl('true');
	filteredValues = {
		description: '',
		iniVig: 'VIGENTE',
		/* finVig: '', */
		moneda: '',
		sector: '',
		tipo: '',
		/* fecCamb: '', */
		state: 'true'
	};

	locale: string = 'es';
	localeLongDateFormat: string = '';
	usDateFormat: string = 'DD/MM/YYYY';
	mainpath: string;
	channelCollection: any[] = [];

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
		public dialog: MatDialog,
		private _spinner: NgxSpinnerService,
		private permits: AccessMaping,
		private exportService: FileExportService
	) {
		this.items$ = this.store.select(fromReducer.getItems);
	}

	exportTable(e: Event) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.excelExport(
				'Tarifario de Canales',
				['Descripción', 'Inicio Vigencia', 'Fin Vigencia', 'Moneda', 'Sector', 'Tipo de Tarifa', 'Fecha Cambio', 'Activo'],
				['description', 'startDate', 'endDate', 'currency', 'target', 'type', 'updatedAt', 'state'],
				this.dataSource.data
			);
		} else {
			this.confirmService.confirm({
				message: 'No existen datos para exportar.',
				title: 'Error',
				showcancel: false
			});
		}
	}

	showreport(e: Event) {
		e.preventDefault();

		if (this.dataSource.data.length > 0) {
			for (let index = 0; index < this.feeListChannel.length; index++) {
				const element = this.feeListChannel[index];

				for (let idx = 0; idx < element.linkedchannels.length; idx++) {
					const linked = element.linkedchannels[idx].channelGroup;
					const mainlinked = element.linkedchannels[idx];

					for (let idy = 0; idy < linked.channels.length; idy++) {
						const channel = linked.channels[idy];

						const fndBrokerArr = [];
						const fndIdBrokerArr = [];
						const fndBroker = channel.agents.filter(x => x.type === 'BROKER');
						for (let idz = 0; idz < fndBroker.length; idz++) {
							const elementBroker = fndBroker[idz];
							fndBrokerArr.push(elementBroker.description);
							fndIdBrokerArr.push(elementBroker.id);
						}

						const fndIntemedrArr = [];
						const fndIdIntemedrArr = [];
						const fndIntemed = channel.agents.filter(x => x.type === 'MIDDLEMAN');
						for (let idz = 0; idz < fndIntemed.length; idz++) {
							const elementIntermed = fndIntemed[idz];
							fndIntemedrArr.push(elementIntermed.description);
							fndIdIntemedrArr.push(elementIntermed.id);
						}

						const mItem = {
							idcorredor: fndIdBrokerArr.join('-'),
							idintermed: fndIdIntemedrArr.join('-'),
							corredor: fndBrokerArr.join('-'),
							intermed: fndIntemedrArr.join('-'),
							client: null,
							concat: fndBrokerArr.join('-') + fndIntemedrArr.join('-') + linked.description + element.description,
							title: linked.description,
							tarifario: element.description,
							estadotarifario: element.state ? 'ACTIVO' : 'INACTIVO',
							tipotarifario: element.type === 'SPECIAL' ? 'CANAL' : 'CAMPAÑA',
							fisico: mainlinked.allowStandardTariff === true ? 'SI' : 'NO',
							digital: mainlinked.allowDigitalTariff === true ? 'SI' : 'NO',
							fisicorenov: mainlinked.allowRenewalStandardTariff === true ? 'SI' : 'NO',
							digitalrenov: mainlinked.allowRenewalDigitalTariff === true ? 'SI' : 'NO'
						};
						const fnd = this.channelCollection.find(
							x =>
								x.corredor === mItem.corredor &&
								x.intermed === mItem.intermed &&
								x.client === mItem.client &&
								x.title === mItem.title &&
								x.tarifario === mItem.tarifario
						);
						if (fnd === undefined) {
							this.channelCollection.push(mItem);
						}
					}
				}
			}
			this.exportService.excelExportNoWidht(
				'Canales Asociados',
				[
					'IdCorredor',
					'IdIntermediario',
					'Corredor',
					'Intermediario',
					'Cliente',
					'Grupo',
					'Tarifario',
					'Tipo',
					'Estado Tarifario',
					'Fisico',
					'Digital',
					'Fisico Ren.',
					'Digital Ren.'
				],
				[
					'idcorredor',
					'idintermed',
					'corredor',
					'intermed',
					'client',
					'title',
					'tarifario',
					'tipotarifario',
					'estadotarifario',
					'fisico',
					'digital',
					'fisicorenov',
					'digitalrenov'
				],
				sortArray(this.channelCollection, 'concat', 1)
			);
		}
	}

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.fee, EActions.create);
		this.viewEdit = this.shCreate ? 'Modificar' : 'Ver';
		this.canChange = this.permits.ShouldDo(AppModules.fee, EActions.changestate);
		this.canDelete = this.permits.ShouldDo(AppModules.fee, EActions.delete);
		this.canClone = this.permits.ShouldDo(AppModules.fee, EActions.clone);
		this.createCampaing = this.permits.ShouldDo(AppModules.fee, EActions.createcampaing);
		moment.locale('es');
		const mainpath = this.activatedRoute.snapshot.url.length > 0 ? this.activatedRoute.snapshot.url[0].path : '';
		this.store.dispatch(new feeActions.Load());
		this.displayedColumns = ['description', 'startDate', 'endDate', 'currency', 'sector', 'type', 'changeDate', 'effectDate', 'state', 'actions'];

		this.items$.subscribe(arr => {
			this.feeList = sortArray(arr, 'updatedAt', -1);
			const tmp = sortArray(
				arr.filter(x => x.type !== 'BASE'),
				'updatedAt',
				-1
			);
			this.feeListChannel = tmp;
			this.dataSource = new MatTableDataSource(tmp);
			this.dataSource.filterPredicate = this.feeFilterPredicate();
			this.loadInitData();
		});
		this._spinner.hide();
		this.setFilters();
	}

	changeStatus(item: Fee) {
		item.state = !item.state;
		const tariffMatrix: TariffMatrix = new TariffMatrix(null);
		tariffMatrix.isActive = item.state;
		tariffMatrix.id = item.idTarifa;
		this.store.dispatch(new feeActions.UpdateFee(tariffMatrix));
	}

	loadInitData() {
		this.filteredValues["state"] = 'true';
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['description'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.iniVigFilter.valueChanges.subscribe(iniVigFilterValue => {
			this.filteredValues['iniVig'] = iniVigFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.monedaFilter.valueChanges.subscribe(monedaFilterValue => {
			this.filteredValues['moneda'] = monedaFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.sectorFilter.valueChanges.subscribe(sectorFilterValue => {
			this.filteredValues['sector'] = sectorFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.tipoFilter.valueChanges.subscribe(tipoFilterValue => {
			this.filteredValues['tipo'] = tipoFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues['state'] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: Fee, filter: string): boolean {
			const searchString = JSON.parse(filter);
			// description
			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: '';
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
			const findMoneda = searchString.moneda ? searchString.moneda.toString().trim() : '';
			const currencyFilter = findMoneda === '' ? true : data.currency.toString().trim() === findMoneda;

			// sector
			const findSector = searchString.sector ? searchString.sector.toString().trim() : '';
			const sectorFilter = findSector === '' ? true : data.target.toString().trim() === findSector;

			// tipo
			const findTipo = searchString.tipo ? searchString.tipo.toString().trim() : '';
			const tipoFilter = findTipo === '' ? true : data.type.toString().trim() === findTipo;

			// estado
			const findEstado = searchString.state ? searchString.state.toString().trim() : '';
			const resultEstado = findEstado === 'true' ? true : false;
			const estadoFilter = findEstado === '' ? true : data.state === resultEstado;

			return descriptionFilter && iniVigFilter && currencyFilter && sectorFilter && estadoFilter && tipoFilter;
		};
		return myFilterPredicate;
	}

	formReset() {
		this.descriptionFilter.reset();
		this.iniVigFilter.reset();
		this.monedaFilter.reset();
		this.sectorFilter.reset();
		this.tipoFilter.reset();
		this.stateFilter.reset();
	}

	getType(type: any) {
		return FeeType[type];
	}

	viewFee(fee: Fee) {
		this.router.navigate([`/fee/details/${fee.idTarifa}`]);
	}

	clone(fee: Fee) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de clonar el tarifario seleccionado?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					// this.router.navigate([`/fee/clone/${fee.idTarifa}`], { skipLocationChange: true });
					this.router.navigate([`/fee/clone/${fee.idTarifa}`]);
				}
			});
	}

	createchild(fee: Fee) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de crear una campaña en base al tarifario seleccionado?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/fee/campaign/${fee.idTarifa}`]);
				}
			});
	}

	createspecial(fee: Fee) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de crear un tarifario de canal?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/fee/campaign/${fee.idTarifa}`]);
				}
			});
	}

	deletefee(fee: Fee) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar la tarifa seleccionada?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new feeActions.DeleteFee(fee.idTarifa));
				}
			});
	}

	getRouteParams(fee: Fee): object {
		return {
			queryParams: { key: fee.idTarifa },
			queryParamsHandling: 'merge'
		};
	}

	openFeePicker(isbase: boolean) {
		const dialogRef = this.dialog.open(FeePickerDialogComponent, {
			width: '1000px',
			disableClose: true,
			autoFocus: false,
			data: { feeList: this.feeList.filter(x => x.state === true && x.type === 'BASE'), isbase: isbase }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}
}
