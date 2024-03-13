import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { IMatrixChannelGroup } from './../../models/tariffmatrix.model';
import { StartEndDateDialogComponent } from './../startenddate-dialog/startenddate-dialog';

import { sortArray } from 'app/shared/helpers/utils';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { ILinkedChannel } from '../../models/tariffmatrix.model';
import { ChannelChildDialogComponent } from '../channel-child-dialog/channel-child-dialog';
import { ChannelListDialogComponent } from '../channel-list-dialog/channel-list-dialog';
import { EffectDateService } from '../effectdate-confirm/effectdate-confirm.service';

const { range } = extendMoment(moment);

@Component({
	selector: 'app-fee-associate-channel-dialog',
	templateUrl: './fee-associate-channel-dialog.html',
	styleUrls: ['./fee-associate-channel-dialog.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FeeAssociateChannelDialogComponent implements OnInit {
	descriptionFilter = new FormControl();
	disabled: boolean = false;

	filteredValues = {
		description: '',
		iniVig: '',
		finVig: ''
	};

	feeStart: string = '';
	feeEnd: string = '';

	//// GLOBAL ////
	dataSource: MatTableDataSource<ILinkedChannel>;
	dataActual: ILinkedChannel[] = [];
	selection = new SelectionModel<ILinkedChannel>(true, []);
	displayedColumns: string[] = [
		'description',
		'startDate',
		'endDate',
		'allowStandardTariff',
		'allowRenewalStandardTariff',
		'allowDigitalTariff',
		'allowRenewalDigitalTariff',
		'actions'
	];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private confirmService: AppConfirmService,
		private dateService: EffectDateService,
		public dialog: MatDialog,
		private dialogRef: MatDialogRef<FeeAssociateChannelDialogComponent>
	) {
		this.feeStart = data.feeStart;
		this.feeEnd = data.feeEnd;
		this.dataActual = data.linked;
		this.disabled = !data.canEdit;
		this.populate();
	}

	ngOnInit() {
		// this.dataActual = sortArray(this.dataActual, "channelGroup.description", 1);
		this.dataSource = new MatTableDataSource(this.dataActual);
		this.dataSource.filterPredicate = this.feeFilterPredicate();
		this.setFilters();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['description'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: ILinkedChannel, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: '';
			const descriptionFilter =
				data.channelGroup.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	addNewChannelToFee() {
		const dialogRef = this.dialog.open(ChannelListDialogComponent, {
			width: '800px',
			disableClose: true,
			data: { feeStart: this.feeStart, feeEnd: this.feeEnd }
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// 	const md = { data: this.selection.selected, date: this.effectDate };
				for (let index = 0; index < result.data.length; index++) {
					const element = result.data[index];
					const channelRepeat = this.dataActual.filter(f => f.channelGroup.id === element.id);
					if (channelRepeat.length === 0) {
						const linkendChannel: ILinkedChannel = {
							startDate: result.date.toISOString(),
							endDate: '',
							allowStandardTariff: false,
							allowDigitalTariff: false,
							allowRenewalStandardTariff: false,
							allowRenewalDigitalTariff: false,
							channelGroup: element
						};
						this.dataActual.push(linkendChannel);
					}
				}
				this.populate();
			}
		});
	}


	openChannelList() {
		const dialogRef = this.dialog.open(ChannelChildDialogComponent, {
			width: '1330px',
			disableClose: true,
			data: this.dataActual
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}


	populate() {
		this.dataSource = new MatTableDataSource(this.dataActual);
	}

	handleMenu(item: IMatrixChannelGroup, tipo: any) {
		const fndType = item.channels.filter(x => x.agents.filter(y => y.type === tipo)).length;
		let rtn = false;
		if (fndType > 0) {
			rtn = true;
		}
		return rtn;
	}

	delete(element: any) {
		this.confirmService
			.confirm({
				message: '¿Está seguro de eliminar el canal seleccionado?',
				showcancel: true
			})
			.subscribe((x: any) => {
				if (x === true) {
					this.dataActual = this.dataActual.filter(f => f.channelGroup.id !== element.channelGroup.id);
					this.populate();
				}
			});
	}

	addcommission(element: any) {
		this.dialogRef.close({ commission: true, data: element });
	}

	edit(element: ILinkedChannel) {
		const tmp = JSON.parse(JSON.stringify(element));
		const dialogRef = this.dialog.open(StartEndDateDialogComponent, {
			width: '500px',
			disableClose: true,
			data: { start: tmp.startDate, end: tmp.endDate, feeStart: this.feeStart, feeEnd: this.feeEnd }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const ilg = this.dataActual.find(x => x.channelGroup.id === element.channelGroup.id);
				if (ilg !== null) {
					ilg.startDate = result.start;
					ilg.endDate = result.end;
				}
			}
		});
	}

	changeStatus(element: ILinkedChannel) {
		/* 	let result: boolean = false;
		idxSU: for (let index = 0; index < this.dataActual.length; index++) {
			const element = this.dataActual[index];
			for (let idx = 0; idx < element.channelGroup.length; idx++) {
				const ch = element.channelGroup[idx];
				if (ch.id === id) {
					result = true;
					break idxSU;
				}
			}
		}
		return result; */
	}

	save() {
		this.dialogRef.close(this.dataActual);
	}

	close() {
		this.dialogRef.close();
	}
}
