import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Fee } from 'app/views/fee/models/fee.model';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { IAlert } from '../../../../shared/models/alert.model';
import { RiskGroup } from '../../../../shared/models/risk-group.model';
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { FileExportService } from "../../../../shared/services/file.export.service";
import * as riskActions from '../../_state/actions/risk.actions';
import * as fromReducer from '../../_state/reducers';
import { RiskGroupModalComponent } from '../../risk-group-modal/risk-group-modal';

@Component({
	selector: 'app-risk-group-list-container.component',
	templateUrl: './risk-group-list-container.component.html',
	styleUrls: ['./risk-group-list-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RiskGroupListContainerComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	items$: Observable<RiskGroup[]> = this.store.select(fromReducer.getItems);
	fees$: Observable<Fee[]> = this.store.select(fromReducer.getFees);
	items: RiskGroup[];
	feesRiskGroup: RiskGroup[] = [];
	fees: Fee[] = [];
	alerts: IAlert[] = [];
	dataSource: MatTableDataSource<RiskGroup>;
	displayedColumns: string[] = ['use.description', 'description', 'isActive', 'actions'];
	descriptionFilter = new FormControl();
	stateFilter = new FormControl();
	baseFilter = new FormControl();
	filteredValues = {
		uso: '',
		state: 'true',
		base: ''
	};

	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;
	canSort: boolean;
	canClone: boolean;
	constructor(
		private store: Store<fromReducer.RiskState>,
		private alertService: AlertService,
		public dialog: MatDialog,
		private actionsSubject$: ActionsSubject,
		private router: Router,
		private confirmService: AppConfirmService,
		private permits: AccessMaping,
		private exportService: FileExportService
	) {
		this.triggers();
	}

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.risk_group, EActions.create);
		this.canDelete = !this.permits.ShouldDo(AppModules.risk_group, EActions.delete);
		this.canChange = !this.permits.ShouldDo(AppModules.risk_group, EActions.changestate);
		this.canClone = !this.permits.ShouldDo(AppModules.risk_group, EActions.clone);
		this.canSort = this.permits.ShouldDo(AppModules.risk_group, EActions.sort);

		this.store.dispatch(new riskActions.LoadFees());
		this.store.dispatch(new riskActions.Load());
		this.items$.subscribe((value: RiskGroup[]) => {
			this.items = value.sort(function (a, b) {
				const nameA = Number(a.vehicleUse.order) * 1000 + a.description.trim(),
					nameB = Number(b.vehicleUse.order) * 1000 + b.description.trim();

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
			this.FillData();
		});

		this.fees$.subscribe((value: Fee[]) => {
			this.fees = value;
		});

		this.getAlerts();
		this.setFilters();
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(riskActions.RiskActionTypes.UpdateRiskGroupCompleted))
			.subscribe(response => {
				this.store.dispatch(new riskActions.Load());
			});
	}

	excelExport(e) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.exportRiskGroup(this.dataSource.data, ['Uso', 'Descripción', 'Estado', 'En Uso']);
		} else {
			this.confirmService.confirm({
				title: "Error",
				message: "No existen datos para exportar.",
				showcancel: false
			});
		}
	}

	private FillData() {
		this.dataSource = new MatTableDataSource(this.items);
		this.dataSource.filterPredicate = this.feeFilterPredicate();
		this.stateFilter.setValue('true');
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}

	setFilters(): any {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['uso'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues['state'] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.baseFilter.valueChanges.subscribe(baseFilterValue => {
			this.filteredValues['base'] = baseFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: RiskGroup, filter: string): boolean {
			const searchString = JSON.parse(filter);
			const findDescript = searchString.uso
				? searchString.uso
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

			const findEstado = searchString.state ? searchString.state.toString().trim() : '';
			const resultEstado = findEstado === 'true' ? true : false;
			const estadoFilter = findEstado === '' ? true : data.isActive === resultEstado;

			const findBase = searchString.base ? searchString.base.toString().trim() : '';
			const resultBase = findBase === 'true' ? true : false;
			const baseFilter = findBase === '' ? true : data.isBase === resultBase;

			return descriptionFilter && estadoFilter && baseFilter;
		};
		return myFilterPredicate;
	}

	getAlerts(): void {
		this.alerts = this.alertService.all();
		this.alertService.clear();
		setTimeout(() => {
			this.alerts = [];
		}, 5000);
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(RiskGroupModalComponent, {
			width: '600px',
			disableClose: true,
			data: { riskgroups: this.items }
		});

		dialogRef.afterClosed().subscribe(x => {
			if (x) {
				this.store.dispatch(new riskActions.Load());
			}
		});
	}

	changeStatus(item: RiskGroup) {
		item.isActive = !item.isActive;
		this.store.dispatch(new riskActions.UpdateRiskGroup(item));
	}

	changeBase(item: RiskGroup) {
		item.isBase = !item.isBase;
		this.store.dispatch(new riskActions.UpdateRiskGroup(item));
	}
	edit(groupId: string) {
		this.router.navigate([`/risk-group/edit/${groupId}`]);
	}
	clone(groupId: string) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de clonar el grupo de riesgo seleccionado?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/risk-group/clone/${groupId}/true`]);
				}
			});
	}
	delete(row: RiskGroup) {
		let exists: boolean = false;
		idxDE: for (let index = 0; index < this.fees.length; index++) {
			const element = this.fees[index];
			for (let idx = 0; idx < element.riskGroups.length; idx++) {
				const rg = element.riskGroups[idx];
				if (row.id === rg.id) {
					exists = true;
					break idxDE;
				}
			}
		}

		if (exists) {
			this.confirmService.confirm({
				title: 'Error',
				message: 'El grupo de riesgo seleccionado no se puede eliminar. (Se encuentra registrado en una o más tarifas)',
				showcancel: false
			});
			return;
		}

		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar el grupo de riesgo seleccionado?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new riskActions.Delete(row.id));
				}
			});
	}
}
