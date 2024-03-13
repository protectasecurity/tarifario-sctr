import { Pipe } from '@angular/core';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { Brand, VehicleGroup } from 'app/shared/models/brand.model';
import { BaseLimit, Class, MaxLimit, MinLimit, SeatsRestriction, SeatType, SubGroups, VehicleClass } from 'app/shared/models/class.model';
import { Model } from 'app/shared/models/model.model';
import { SeatConfigurationOperator } from 'app/shared/models/seat-configuration.model';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { RiskGroupOptionsComponent } from '../../container/risk-group-options/risk-group-options.component';
import { BrandModelPickerDialogComponent } from '../brandmodel-picker-dialog/brandmodel-picker-dialog';

@Component({
	selector: 'app-risk-group-options-header',
	templateUrl: './risk-group-options-header.component.html',
	styleUrls: ['./risk-group-options-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class RiskGroupOptionsHeaderComponent implements OnInit, OnChanges {
	riskGroupOptions: FormGroup;
	filterModelos: FormControl;
	showBrandButton: boolean = false;
	defaultValue: object = { value: '', disabled: true };
	showBetween: boolean = false;
	masterCheck: boolean = false;
	models: Model[] = [];

	public dataSource = new MatTableDataSource<Model>();

	operatorList: string[] = [];
	displayedColumns: string[] = ['description', 'acciones'];
	modelIds: String[] = [];
	vehicleGroup: VehicleGroup = new VehicleGroup();
	editedVehicleClass: VehicleClass = null;

	@Input()
	data: SubGroups;
	@Input()
	classes: Class[];
	@Input()
	brands: Brand[];
	@Output()
	loadBrandsByClass: EventEmitter<any> = new EventEmitter<any>();

	public filteredValues = {
		modelos: ''
	};

	constructor(
		private fb: FormBuilder,
		private dialog: MatDialog,
		private ref: ChangeDetectorRef,
		public riskDialog: MatDialogRef<RiskGroupOptionsComponent>
	) {
		this.buildForm();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.classes) {
			const changedClasses: Class[] = changes.classes.currentValue;
			if (changedClasses.length > 0) {
				if (this.riskGroupOptions && this.data) {
					this.editForm(this.data);
				}
			}
		}
		if (changes.data) {
			const existingSubGroups: SubGroups = changes.data.currentValue;
			if (existingSubGroups) {
				if (existingSubGroups.vehicleGroup) {
					this.vehicleGroup = existingSubGroups.vehicleGroup;
					existingSubGroups.vehicleGroup.filters.map(x => (this.models = this.models.concat(x.segmentedModels)));
					this.models = this.models.sort(function (a, b) {
						const nameA = a.brand.description.toLowerCase() + a.description.toLowerCase(),
							nameB = b.brand.description.toLowerCase() + b.description.toLowerCase();
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					});
					this.dataSource = new MatTableDataSource<Model>(this.models);
				}
			}
		}
	}
	ngOnInit() {
		Object.keys(SeatConfigurationOperator).forEach(key => {
			if (key.toString() !== 'GREATER' && key.toString() !== 'MINOR') {
				//  !== SeatConfigurationOperator.GREATER_OR_EQUAL || key !== SeatConfigurationOperator.MINOR_OR_EQUAL) {
				this.operatorList.push(SeatConfigurationOperator[key]);
			}
		});
	}
	buildForm() {
		this.filterModelos = new FormControl();

		this.filterModelos.valueChanges
			.pipe(
				debounceTime(100),
				distinctUntilChanged()
			)
			.subscribe(val => {
				this.filteredValues['modelos'] = val;
			});

		this.riskGroupOptions = this.fb.group({
			vehicleClass: ['', [Validators.required]],
			operador: [this.defaultValue],
			rangeOperator: this.fb.group({
				minLimit: this.defaultValue,
				maxLimit: this.defaultValue
			}),
			isExclusionVehicleGroup: [false],
			chkAsientos: [this.defaultValue],
			chkMarcasModelos: [this.defaultValue],
			filtroModelos: this.filterModelos
		});
	}

	resetfiltro() {
		this.riskGroupOptions.get('filtroModelos').setValue('');
		this.filteredValues['modelos'] = '';
		this.dataSource.filter = '';
	}

	editForm(data: SubGroups) {
		const toSelect = this.classes.find(c => c.id.toString() === data.vehicleClass.id.toString());
		// this.handlerToggleAsientos(data.seatsRestriction ? true : false);
		this.riskGroupOptions.patchValue({
			vehicleClass: toSelect,
			rangeOperator: {
				minLimit: data.seatsRestriction ? this.getMinValue(data.seatsRestriction) : this.defaultValue,
				maxLimit: data.seatsRestriction ? this.getSeatValue(data.seatsRestriction.maxLimit) : this.defaultValue
			},
			isExclusionVehicleGroup: data.isExclusionVehicleGroup
		});

		if (data.seatsRestriction) {
			const xxx = this.getOperator(data.seatsRestriction);
			this.riskGroupOptions.controls['operador'].setValue(xxx);
			this.riskGroupOptions.get('operador').enable();
			this.riskGroupOptions.get('operador').updateValueAndValidity({ emitEvent: false, onlySelf: true });
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.enable();
			this.riskGroupOptions.get('chkAsientos').setValue(true);
			this.changeOperator();
		}
		// if (this.riskGroupOptions.value.vehicleClass !== undefined) {
		this.loadBrandsByClass.emit(this.riskGroupOptions.value.vehicleClass.id.toString());
		// }
		if (data.vehicleGroup) {
			this.showBrandButton = true;
			this.riskGroupOptions.get('chkMarcasModelos').setValue(true);
		}
		this.riskGroupOptions.get('chkMarcasModelos').enable();
		this.riskGroupOptions.get('chkAsientos').enable();
		this.editedVehicleClass = this.riskGroupOptions.value.vehicleClass;
		this.riskGroupOptions.get('vehicleClass').disable({ onlySelf: true });
		this.riskGroupOptions.updateValueAndValidity();
	}
	getMinValue(seatsRestriction: SeatsRestriction): number | object {
		if (seatsRestriction.minLimit) {
			return seatsRestriction.minLimit.value;
		}
		if (seatsRestriction.maxLimit) {
			return seatsRestriction.maxLimit.value;
		}
		return this.defaultValue;
	}
	getSeatValue(limit: BaseLimit): number | object {
		if (!limit) {
			return this.defaultValue;
		}
		return limit.value;
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
	changeOperator() {
		const currentOperator = this.riskGroupOptions.value.operador;
		this.clearValidators();

		if (currentOperator === SeatConfigurationOperator.BETWEEN) {
			this.showBetween = true;
			this.riskGroupOptions.get('rangeOperator').setValidators([rangeNumber]);
			this.riskGroupOptions
				.get('rangeOperator')
				.get('maxLimit')
				.enable();
			this.riskGroupOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValidators([Validators.required, Validators.min(1)]);
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.setValidators([Validators.required, Validators.min(1)]);
		} else {
			this.showBetween = false;
			// this.riskGroupOptions.get('rangeOperator').setValidators([rangeNumber]);

			if (currentOperator === SeatConfigurationOperator.MINOR) {
				this.riskGroupOptions
					.get('rangeOperator')
					.get('minLimit')
					.setValidators([Validators.required, Validators.min(1), minNumber]);
			} else {
				this.riskGroupOptions
					.get('rangeOperator')
					.get('minLimit')
					.setValidators([Validators.required, Validators.min(1)]);
			}

			this.riskGroupOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValidators(null);
			this.riskGroupOptions
				.get('rangeOperator')
				.get('maxLimit')
				.disable();
			this.riskGroupOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValue('');
		}

		this.riskGroupOptions
			.get('rangeOperator')
			.get('maxLimit')
			.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		this.riskGroupOptions.updateValueAndValidity();
	}

	clearValidators(): void {
		this.riskGroupOptions
			.get('rangeOperator')
			.get('maxLimit')
			.clearValidators();
		this.riskGroupOptions
			.get('rangeOperator')
			.get('minLimit')
			.clearValidators();
		this.riskGroupOptions.get('rangeOperator').clearValidators();
	}

	toggleasientos(e) {
		this.handlerToggleAsientos(e.checked);
	}

	handlerToggleAsientos(accion: boolean) {
		this.riskGroupOptions.get('operador').reset();
		this.riskGroupOptions
			.get('rangeOperator')
			.get('minLimit')
			.reset();
		this.riskGroupOptions
			.get('rangeOperator')
			.get('maxLimit')
			.reset();
		if (accion) {
			this.riskGroupOptions.get('operador').enable();
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.enable();
			this.riskGroupOptions.get('operador').setValidators([Validators.required]);
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.setValidators([Validators.required, Validators.min(1)]);
		} else {
			this.riskGroupOptions.get('operador').disable();
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.disable();
			this.riskGroupOptions.get('operador').setValidators(null);
			this.riskGroupOptions
				.get('rangeOperator')
				.get('minLimit')
				.setValidators(null);
		}
		this.riskGroupOptions.get('operador').updateValueAndValidity({ emitEvent: false, onlySelf: true });
		this.riskGroupOptions
			.get('rangeOperator')
			.get('minLimit')
			.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		this.riskGroupOptions.updateValueAndValidity();
		this.changeOperator();
	}

	changeClass() {
		if (this.vehicleGroup.filters) {
			this.vehicleGroup = new VehicleGroup();
			this.models = [];
			this.dataSource = new MatTableDataSource<Model>([]);
		}
		this.loadBrandsByClass.emit(this.riskGroupOptions.value.vehicleClass.id.toString());
		this.riskGroupOptions.get('chkAsientos').enable();
		this.riskGroupOptions.get('chkMarcasModelos').enable();
	}

	togglemarcas(e) {
		if (e.checked) {
			this.showBrandButton = true;
		} else {
			this.showBrandButton = false;
		}
	}

	modelChecked(id: string) {
		return this.modelIds.filter(model => model === id).length > 0;
	}

	masterModelChecked() {
		return this.masterCheck;
	}

	masterToggleGlobal(event: any) {
		this.modelIds = [];
		this.masterCheck = event.checked;
		if (event.checked) {
			for (let index = 0; index < this.models.length; index++) {
				const element = this.models[index];
				this.modelIds.push(element.id);
			}
		}
	}
	deleteSingleItem(modelId: string) {
		this.modelIds.push(modelId);
		this.delete();
	}

	applyFilter(filtro: string) {
		this.dataSource.filter = filtro.trim().toLowerCase();
	}

	delete() {
		this.modelIds.map(id => {
			this.models = this.models.filter(model => model.id !== id);
			this.dataSource = new MatTableDataSource<Model>(this.models);
		});

		const mainTmpVehGroup = JSON.parse(JSON.stringify(this.vehicleGroup.filters));

		let nonDeletedModels: Model[];
		for (let index = 0; index < this.modelIds.length; index++) {
			const element = this.modelIds[index];
			for (let indexGroup = 0; indexGroup < mainTmpVehGroup.length; indexGroup++) {
				const elementGroup = mainTmpVehGroup[indexGroup];
				nonDeletedModels = [];
				for (let indexElement = 0; indexElement < elementGroup.segmentedModels.length; indexElement++) {
					const elementModel = elementGroup.segmentedModels[indexElement];
					if (elementModel.id !== element) {
						nonDeletedModels.push(elementModel);
					}
				}
				elementGroup.segmentedModels = nonDeletedModels;
			}
		}
		this.masterCheck = false;
		this.vehicleGroup.filters = mainTmpVehGroup ? mainTmpVehGroup.filter(x => x.segmentedModels.length > 0) : [];
		this.modelIds = [];
		this.resetfiltro();
	}
	selectItem(event: any, modelId: string) {
		if (event.checked) {
			const xx = this.modelIds.filter(x => x === modelId).length;
			if (xx === 0) {
				this.modelIds.push(modelId);
			}
		} else {
			this.modelIds = this.modelIds.filter(x => x !== modelId);
		}
	}

	createSeatsRestriccionInstance(minLimit: number, minSeatType: SeatType, maxLimit: number, maxSeatType: SeatType): SeatsRestriction {
		if (minLimit && !maxLimit) {
			return SeatsRestriction.CreateInstanceWithMinLimit(MinLimit.CreateInstance(minLimit, minSeatType));
		}
		if (maxLimit && !minLimit) {
			return SeatsRestriction.CreateInstanceWithMaximit(MaxLimit.CreateInstance(maxLimit, maxSeatType));
		}

		return SeatsRestriction.CreateInstance(MinLimit.CreateInstance(minLimit, minSeatType), MaxLimit.CreateInstance(maxLimit, maxSeatType));
	}

	getSeatsRestriction(riskGroupform: any): SeatsRestriction {
		const operadorValue: string = riskGroupform.value.operador;

		const minLimitValue: number = riskGroupform.value.rangeOperator ? riskGroupform.value.rangeOperator.minLimit : null;
		const maxLimitValue: number = riskGroupform.value.rangeOperator ? riskGroupform.value.rangeOperator.maxLimit : null;

		if (operadorValue === '') {
			return null;
		}
		if (operadorValue === SeatConfigurationOperator.GREATER_OR_EQUAL) {
			return this.createSeatsRestriccionInstance(minLimitValue, SeatType.CLOSED, null, null);
		}
		if (operadorValue === SeatConfigurationOperator.GREATER) {
			return this.createSeatsRestriccionInstance(minLimitValue, SeatType.OPEN, null, null);
		}
		if (operadorValue === SeatConfigurationOperator.EQUAL) {
			return this.createSeatsRestriccionInstance(minLimitValue, SeatType.CLOSED, minLimitValue, SeatType.CLOSED);
		}
		if (operadorValue === SeatConfigurationOperator.MINOR_OR_EQUAL) {
			return this.createSeatsRestriccionInstance(null, null, minLimitValue, SeatType.CLOSED);
		}
		if (operadorValue === SeatConfigurationOperator.MINOR) {
			return this.createSeatsRestriccionInstance(null, null, minLimitValue, SeatType.OPEN);
		}
		if (operadorValue === SeatConfigurationOperator.BETWEEN) {
			return this.createSeatsRestriccionInstance(minLimitValue, SeatType.OPEN, maxLimitValue, SeatType.CLOSED);
		}

		return null;
	}
	openBrandModelPicker() {
		if (!this.riskGroupOptions.valid) {
			return;
		}
		this.modelIds = [];
		const itemclassSelected: Class = this.editedVehicleClass ? this.editedVehicleClass : this.riskGroupOptions.value.vehicleClass;
		const dialogRef = this.dialog.open(BrandModelPickerDialogComponent, {
			disableClose: false,
			width: '900px',
			height: '547px',
			data: { brands: this.brands, class: itemclassSelected }
		});
		dialogRef.afterClosed().subscribe((result: VehicleGroup) => {
			if (!result) {
				return;
			}

			if (this.vehicleGroup.filters) {
				// Eliminar los modelos repetidos
				this.vehicleGroup.filters = this.vehicleGroup.filters.concat(result.filters);
			} else {
				this.vehicleGroup = result;
			}

			const newModels: Model[] = [];
			result.filters.map(brands => {
				brands.segmentedModels.map(model => {
					if (this.models.filter(x => x.id.toString() === model.id.toString()).length === 0) {
						newModels.push(model);
					}
				});
			});

			this.models = this.models.concat(newModels);
			this.models = this.models.sort(function (a, b) {
				const nameA = a.brand.description.toLowerCase() + a.description.toLowerCase(),
					nameB = b.brand.description.toLowerCase() + b.description.toLowerCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
			this.dataSource = new MatTableDataSource<Model>(this.models);
			this.ref.markForCheck();
		});
	}
	addClassGroup() {
		let vg: VehicleGroup = null;
		const itemclassSelected: Class = this.editedVehicleClass ? this.editedVehicleClass : this.riskGroupOptions.value.vehicleClass;
		if (this.vehicleGroup.filters !== undefined) {
			if (this.vehicleGroup.filters !== null) {
				if (this.vehicleGroup.filters.length === 0) {
					this.riskGroupOptions.get('chkMarcasModelos').setValue(false);
					this.riskGroupOptions.get('isExclusionVehicleGroup').setValue(false);
				}
			}
		}
		const chkMarcasModelosValue = this.riskGroupOptions.controls['chkMarcasModelos'].value;
		if (chkMarcasModelosValue) {
			if (this.vehicleGroup.filters) {
				vg = this.vehicleGroup;
			}
		}

		const subGroups = SubGroups.CreateInstance(
			itemclassSelected,
			vg,
			this.getSeatsRestriction(this.riskGroupOptions),
			this.riskGroupOptions.value.isExclusionVehicleGroup,
			true
		);
		this.riskDialog.close(subGroups);
	}
}

function rangeNumber(c: AbstractControl): { [key: string]: boolean } | null {
	const minLimit = c.get('minLimit');
	const maxLimit = c.get('maxLimit');

	if (maxLimit.value <= minLimit.value) {
		return { match: true };
	}
	return null;
}

function minNumber(c: AbstractControl): { [key: string]: boolean } | null {
	const minLimit = c.value;
	if (minLimit <= 1) {
		return { match: true };
	}
	return null;
}
