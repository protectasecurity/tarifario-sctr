import { Component, Inject, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatRadioChange, MatTableDataSource } from "@angular/material";
import { forEach } from "@angular/router/src/utils/collection";
import { operators } from "rxjs/internal/Rx";
import { SeatsRestriction, SeatType } from "../../../../shared/models/class.model";
import { SeatConfigurationOperator } from "../../../../shared/models/seat-configuration.model";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { DisplayAgent } from "../../../manage-channel/container/manage-channel-create/manage-channel-create.component";
import { ManageChannel } from "../../../manage-channel/models/ManageChannel";
import { ParametersTypeConfiguration } from "../../models/company-type.model";
import { Parameter } from "../../models/parameter.model";

@Component({
	selector: 'app-parameters-modal',
	templateUrl: './parameters-modal.html',
	styleUrls: ['./parameters-modal.scss'],
	encapsulation: ViewEncapsulation.None
})


export class ParametersModalComponent implements OnInit {
	parametersOptions: FormGroup;
	operatorList: any[] = [];
	operatorType: any[] = [];
	showBetween: boolean = false;
	defaultValue: object = { value: '', disabled: false };
	newParam: Parameter;
	showRange: boolean = false;
	showCommission: boolean = false;
	showProductivity: boolean = false;
	showReward: boolean = false;
	parameters: Parameter[];
	constructor(private fb: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private confirmService: AppConfirmService,
		private dialogRef: MatDialogRef<ParametersModalComponent>) {
		this.parameters = data.items;
	}


	ngOnInit(): void {
		this.buildForm();

		Object.keys(SeatConfigurationOperator).forEach(key => {
			this.operatorList.push({ 'key': key, 'value': SeatConfigurationOperator[key] });
		});
		Object.keys(ParametersTypeConfiguration).forEach(key => {
			this.operatorType.push({ 'key': key, 'value': ParametersTypeConfiguration[key] });
		});

		if (!this.data.isNew) {
			if (ParametersTypeConfiguration[this.data.parameter.type] === ParametersTypeConfiguration.COMPANY_SIZE) {
				this.showRange = true;
			} else {
				this.showRange = false;
			}
			this.parametersOptions.patchValue({
				typeFilter: this.data.parameter.type,
				descriptionFilter: this.data.parameter.description,
				equivalenciaFilter: this.data.parameter.equivalence,
				operador: this.data.parameter.operators,
				rangeOperator: {
					minLimit: this.data.parameter.value,
					maxLimit: this.data.parameter.valueMax,
				}
			});
			this.changeOperator();
		}
	}

	buildForm() {
		this.parametersOptions = this.fb.group({
			typeFilter: ['', [Validators.required]],
			descriptionFilter: ['', [Validators.required]],
			equivalenciaFilter: [''],
			operador: ['', [Validators.required]],
			rangeOperator: this.fb.group({
				minLimit: this.defaultValue,
				maxLimit: this.defaultValue,
			})
		});
	}

	changeOperator() {
		const currentOperator = this.parametersOptions.value.operador;
		this.clearValidators();
		if (SeatConfigurationOperator[currentOperator] === SeatConfigurationOperator.BETWEEN) {
			this.showBetween = true;
			// this.parametersOptions.get('rangeOperator').setValidators([rangeNumber]);
			this.parametersOptions
				.get('rangeOperator')
				.get('maxLimit')
				.enable();
			this.parametersOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValidators([Validators.required, Validators.min(1)]);
			this.parametersOptions
				.get('rangeOperator')
				.get('minLimit')
				.setValidators([Validators.required, Validators.min(1)]);
		} else {
			this.showBetween = false;
			// this.parametersOptions.get('rangeOperator').setValidators([rangeNumber]);

			if (SeatConfigurationOperator[currentOperator] === SeatConfigurationOperator.MINOR) {
				this.parametersOptions
					.get('rangeOperator')
					.get('minLimit')
					.setValidators([Validators.required, Validators.min(1), minNumber]);
			} else {
				this.parametersOptions
					.get('rangeOperator')
					.get('minLimit')
					.setValidators([Validators.required, Validators.min(1)]);
			}

			this.parametersOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValidators(null);
			this.parametersOptions
				.get('rangeOperator')
				.get('maxLimit')
				.disable();
			this.parametersOptions
				.get('rangeOperator')
				.get('maxLimit')
				.setValue('');
		}

		this.parametersOptions
			.get('rangeOperator')
			.get('maxLimit')
			.updateValueAndValidity({ emitEvent: false, onlySelf: true });
		this.parametersOptions.updateValueAndValidity();
	}
	changeType() {
		const currentType = this.parametersOptions.value.typeFilter;
		switch (ParametersTypeConfiguration[currentType]) {
			case ParametersTypeConfiguration.COMPANY_SIZE: {
				this.showRange = true;
				this.showCommission = false;
				this.showProductivity = false;
				this.showReward = false;
				break;
			}
			case ParametersTypeConfiguration.COMMISSION: {
				this.showRange = false;
				break;
			}
			case ParametersTypeConfiguration.PRODUCTIVITY_GOAL: {
				this.showRange = true;
				break;
			}
			case ParametersTypeConfiguration.REWARD: {
				this.showRange = true;
				break;
			}
				break;
		}
		/*if (ParametersTypeConfiguration[currentType] === ParametersTypeConfiguration.COMPANY_SIZE) {
			this.showRange = true;
		} else {
			this.showRange = false;
		}*/
	}

	clearValidators(): void {
		this.parametersOptions
			.get('rangeOperator')
			.get('maxLimit')
			.clearValidators();
		this.parametersOptions
			.get('rangeOperator')
			.get('minLimit')
			.clearValidators();
		this.parametersOptions.get('rangeOperator').clearValidators();
	}

	getOperator(valor: string) {
		let keyValue = '';
		Object.keys(SeatConfigurationOperator).forEach(key => {
			if (key === valor) {
				keyValue = SeatConfigurationOperator[key];
			}
		});
		return keyValue;
	}

	getType(valor: ParametersTypeConfiguration) {
		let keyValue = '';
		Object.keys(ParametersTypeConfiguration).forEach(key => {
			if (key === valor) {
				keyValue = ParametersTypeConfiguration[key];
			}
		});
		return keyValue;
	}

	save() {
		const parameterCreate: Parameter[] = [];
		if (SeatConfigurationOperator[this.parametersOptions.value.operador] === SeatConfigurationOperator.BETWEEN) {
			if (this.parametersOptions.value.rangeOperator.maxLimit < this.parametersOptions.value.rangeOperator.minLimit) {
				this.confirmService.confirm({
					title: 'Error',
					message: 'El máximo es mayor que el minimo',
					showcancel: false
				});
				return;
			}
		}

		if (this.parametersOptions.value.typeFilter === 'COMPANY_SIZE') {
			let det;
			if (this.parametersOptions.value.operador === 'BETWEEN') {
				det = this.parameters.find(x =>
					x.type === this.parametersOptions.value.typeFilter &&
					x.description === this.parametersOptions.value.descriptionFilter &&
					x.operators === this.parametersOptions.value.operador &&
					x.value === this.parametersOptions.value.rangeOperator.minLimit &&
					x.valueMax === this.parametersOptions.value.rangeOperator.maxLimit);
			} else {
				det = this.parameters.find(x =>
					x.type === this.parametersOptions.value.typeFilter &&
					x.description === this.parametersOptions.value.descriptionFilter &&
					x.operators === this.parametersOptions.value.operador &&
					x.value === this.parametersOptions.value.rangeOperator.minLimit);
			}
			if (det !== undefined) {
				this.confirmService.confirm({ title: 'Error', message: 'Operador ya existente para el tipo de parámetro seleccionado.', showcancel: false });
				return;
			}

		} else {
			if (this.data.isNew) {
				const det = this.parameters.find(x =>
					x.type === this.parametersOptions.value.typeFilter && x.description === this.parametersOptions.value.descriptionFilter);
				if (det !== undefined) {
					this.confirmService.confirm({ title: 'Error', message: 'Descripción ya existente para el tipo de parámetro seleccionado.', showcancel: false });
					return;
				}
			}
		}


		if (!this.data.isNew) {
			this.newParam = Parameter.CreateInstanceEdit(
				this.data.parameter.id,
				this.parametersOptions.value.descriptionFilter,
				this.parametersOptions.value.equivalenciaFilter,
				this.parametersOptions.value.typeFilter,
				this.data.parameter.order,
				this.parametersOptions.value.operador,
				this.parametersOptions.value.rangeOperator.minLimit,
				this.parametersOptions.value.rangeOperator.maxLimit
			);
		} else {
			this.newParam = Parameter.CreateInstance(
				this.parametersOptions.value.descriptionFilter,
				this.parametersOptions.value.equivalenciaFilter,
				this.parametersOptions.value.typeFilter,
				0,
				this.parametersOptions.value.operador,
				this.parametersOptions.value.rangeOperator.minLimit,
				this.parametersOptions.value.rangeOperator.maxLimit
			);
		}
		this.dialogRef.close(this.newParam);
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
