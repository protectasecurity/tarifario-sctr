import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatPaginator, MatTable, MatTableDataSource } from "@angular/material";
import { Store } from "@ngrx/store";
import { NgxSpinnerService } from "ngx-spinner";
import { from, Observable } from "rxjs";
import { sortArray } from "../../../../shared/helpers/utils";
import { SeatConfigurationOperator } from "../../../../shared/models/seat-configuration.model";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { RiskGroupModalComponent } from "../../../risk-group/risk-group-modal/risk-group-modal";
import { ParametersTypeConfiguration } from "../../models/company-type.model";
import { Parameter } from "../../models/parameter.model";
import * as paramsActions from '../../state/actions/parameter.actions';
import * as fromReducer from '../../state/reducers';
import { ParametersModalComponent } from "../parameters-modal/parameters-modal";
import { ParametersOrderComponent } from "../parameters-order/parameters-order.component";


@Component({
	selector: 'parameters-list',
	templateUrl: './parameters-list.component.html',
	styleUrls: ['./parameters-list.component.css']
})

export class ParametersListComponent implements OnInit, OnChanges {
	@ViewChild('table') table: MatTable<Parameter>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	displayedColumns: string[] = ['type', 'description', 'equivalence', 'active', 'used', 'actions'];
	dataSource: MatTableDataSource<Parameter>;
	displayNew: Parameter[] = [];
	@Input()
	items: Parameter[];
	@Output()
	onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onUpdateStatus: EventEmitter<Parameter> = new EventEmitter<Parameter>();
	@Output()
	onAddParameter: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onEditParameter: EventEmitter<any> = new EventEmitter<any>();

	canSort: boolean = false;
	listParamas: Parameter[];
	descriptionFilter = new FormControl();
	stateFilter = new FormControl();
	enusoFilter = new FormControl();
	isEditing: boolean;
	filteredValues = {
		descripcion: '',
		enuso: '',
		estado: null
	};
	public isLoading$: Observable<boolean>;

	constructor(
		public dialog: MatDialog,
		private _spinner: NgxSpinnerService,
		private confirmService: AppConfirmService,
		private spinner: NgxSpinnerService,
		private store: Store<fromReducer.ParamState>
	) {
		this._spinner.show();
	}

	ngOnChanges(changes: SimpleChanges): void {

		if (changes.items && changes.items.currentValue) {
			// this.listParamas = sortArray(changes.items.currentValue, 'order', 1);
			// 	this.displayNew = sortArray(changes.items.currentValue, 'order', 1);

			this.listParamas = changes.items.currentValue.sort(function (a, b) {
				const nameA = a.type.trim() + '-' + a.description.trim(),
					nameB = b.type.trim() + '-' + b.description.trim();

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});

			this.displayNew = changes.items.currentValue.sort(function (a, b) {
				const nameA = a.type.trim() + '-' + a.description.trim(),
					nameB = b.type.trim() + '-' + b.description.trim();

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});

			this.dataSource = new MatTableDataSource(this.listParamas);
			this.dataSource.filterPredicate = this.feeFilterPredicate();
			this.setFilters();
		}
	}

	ngOnInit(): void {
		this._spinner.hide();
	}

	getType(type: string) {
		return ParametersTypeConfiguration[type];
	}

	getDescrip(element: any) {
		if (ParametersTypeConfiguration[element.type] === ParametersTypeConfiguration.COMPANY_SIZE) {
			if (SeatConfigurationOperator[element.operators] === SeatConfigurationOperator.BETWEEN) {
				return element.description + ' ' + SeatConfigurationOperator[element.operators] + ' ' + element.value + ' y ' + element.valueMax;
			} else {
				return element.description + ' ' + SeatConfigurationOperator[element.operators] + ' ' + element.value;
			}
		} else {
			return element.description;
		}
	}
	edit(param: Parameter) {
		this.openParametersPicker(false, param);
	}
	openParametersPicker(isNew: boolean, mParameter?: Parameter) {
		this.isEditing = !isNew;
		let dialogRef;
		if (this.isEditing) {
			this.confirmService
				.confirm({
					title: 'Confirmación',
					message: '¿Está seguro de editar el parametro?',
					showcancel: true
				})
				.subscribe(x => {
					if (x === true) {/* 
						console.log('PARAMETROS EDIT', this.listParamas);
						console.log('PARAMETRO EDIT', mParameter); */
						dialogRef = this.dialog.open(ParametersModalComponent, {
							disableClose: true,
							data: { isNew: isNew, parameter: mParameter, items: this.listParamas }
						});
					}
					dialogRef.afterClosed().subscribe(result => {
						if (result) {
							this.editing(result);
						}
					});
				});
		} else {
			/* 	console.log('PARAMETROS NEW', this.listParamas);
				console.log('PARAMETRO NEW', mParameter); */
			dialogRef = this.dialog.open(ParametersModalComponent, {
				disableClose: true,
				data: { isNew: isNew, parameter: mParameter, items: this.listParamas }
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.create(result);
				}
			});
		}
	}

	refreshTable(newParam: Parameter): void {
		if (this.displayNew.filter(x => x.id === newParam.id).length > 0) {
			return;
		}
		this.displayNew.push(newParam);
		// this.displayNew = sortArray(this.displayNew, 'order', 1);

		this.displayNew = this.displayNew.sort(function (a, b) {
			const nameA = a.type.trim() + '-' + a.description.trim(),
				nameB = b.type.trim() + '-' + b.description.trim();

			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});


		this.dataSource = new MatTableDataSource(this.displayNew);
	}
	changeStatus(row: Parameter) {
		row.isActive = !row.isActive;

		if (row.type === 'WORKER_TYPE') {
			row.valueMax = 99;
		}

		this.onUpdateStatus.emit(row);
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues['descripcion'] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.enusoFilter.valueChanges.subscribe(enusoFilterValue => {
			this.filteredValues['enuso'] = enusoFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});

		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues['estado'] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: Parameter, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.descripcion
				? searchString.descripcion
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

			// enuso
			const findEnUso = searchString.enuso ? searchString.enuso.toString().trim() : '';
			const resultEnUso = findEnUso === 'true' ? true : false;
			const enUsoFilter = findEnUso === '' ? true : data.isDeleted === resultEnUso;

			// estado
			const findEstado = searchString.estado ? searchString.estado.toString().trim() : '';
			const resultEstado = findEstado === 'true' ? true : false;
			const estadoFilter = findEstado === '' ? true : data.isActive === resultEstado;
			return descriptionFilter && estadoFilter && enUsoFilter;
		};
		return myFilterPredicate;
	}

	delete(row: any) {
		this.onDelete.emit(row);
	}
	create(row: Parameter) {

		this.onAddParameter.emit(row);
		this.refreshTable(row);
	}
	editing(row: Parameter) {
		this.onEditParameter.emit(row);
		this.refreshTable(row);
	}

	saveParameters(paramsData: Parameter[]): void {
		if (this.isEditing) {
			this.store.dispatch(new paramsActions.UpdateParameter(paramsData[0]));
		} else {
			this.store.dispatch(new paramsActions.AddParameter(paramsData));
		}
	}

	dropTable(event: CdkDragDrop<Parameter[]>) {
		this.spinner.show();

		const parameter = event.item.data;
		parameter.order = event.currentIndex;
		parameter.valueMax = 0;
		// this.store.dispatch(new paramsActions.UpdateParameter(parameter));
		this.onEditParameter.emit(parameter);
		this.refreshTable(parameter);

		this.spinner.hide();

	}
}
