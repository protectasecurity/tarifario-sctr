import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Brand } from "app/shared/models/brand.model";
import { SeatsRestriction, SeatType, SubGroups } from "app/shared/models/class.model";
import { PersonType, PersonTypeEnum } from "app/shared/models/person-type.model";
import { RiskGroup } from "app/shared/models/risk-group.model";
import { SeatConfigurationOperator } from "app/shared/models/seat-configuration.model";
import { Use } from "app/shared/models/use.model";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { RiskGroupOptionsComponent } from "../../container/risk-group-options/risk-group-options.component";

@Component({
	selector: 'risk-group-detail',
	templateUrl: './risk-group-detail.component.html',
	styleUrls: ['./risk-group-detail.component.scss']
})
export class RiskGroupDetailComponent implements OnInit, OnChanges {
	groupId: string = '';
	riskGroupForm: FormGroup;
	displayedColumns: string[] = ['clase', 'asientos', 'marcasmodelos', 'acciones'];
	dataSource = new MatTableDataSource<SubGroups>();
	enabledBotonAceptar: boolean = false;
	subGroups: SubGroups[] = [];
	disabledDescripcionEdition: boolean = true;
	disabledUseControl: boolean = false;
	grupoDescripcion: string = '';
	grupoDescripcionDB: string = '';
	isEditing: boolean = false;
	recalculate: boolean = false;
	checked = false;

	@Input()
	uses: Use[];
	@Input()
	isClone: boolean = false;
	@Input()
	personTypes: PersonType[];
	@Input()
	riskGroup: RiskGroup;
	@Output()
	updateSave: EventEmitter<RiskGroup> = new EventEmitter<RiskGroup>();


	modificationAllowed: boolean;
	constructor(private fb: FormBuilder, public router: Router, public cd: ChangeDetectorRef, private dialog: MatDialog,
		private confirmService: AppConfirmService, private permits: AccessMaping) {
		this.buildRiskGroupForm();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.riskGroup && changes.riskGroup.currentValue) {
			this.verifyEdition(changes.riskGroup.currentValue);
		}
		if (changes.uses && changes.uses.currentValue) {
			this.uses = changes.uses.currentValue;
			this.common();
		} else {
			if (this.uses.length > 0) {
				this.common();
			}
		}
	}
	common = () => {
		if (this.riskGroup !== null) {
			if (this.riskGroup.vehicleUse !== undefined) {
				if (this.riskGroup.vehicleUse.id) {
					const selectedUse = this.uses.find(x => Number(x.id) === Number(this.riskGroup.vehicleUse.id));
					this.riskGroupForm.get('uso').setValue(selectedUse);
				}
			}
		}
	};
	ngOnInit() {
		this.modificationAllowed = this.permits.ShouldDo(AppModules.risk_group, EActions.modification);
	}
	buildRiskGroupForm() {
		this.riskGroupForm = this.fb.group({
			uso: ['', [Validators.required]],
			personType: ['', []]
		});
		this.grupoDescripcion = '';
		this.grupoDescripcionDB = '';
		this.subGroups = [];
	}

	verifyEdition(item: RiskGroup): void {
		if (!item.id) {
			return;
		}
		this.isEditing = true;
		this.groupId = item.id;
		// const selectedUse = this.uses.find(x => Number(x.id) === Number(item.vehicleUse.id));
		let selectedPersonType = null;
		if (item.personType) {
			switch (item.personType) {
				case PersonTypeEnum.NATURAL:
					selectedPersonType = this.personTypes.find(x => x.id.toString() === '1');
					break;
				case PersonTypeEnum.JURIDIC:
					selectedPersonType = this.personTypes.find(x => x.id.toString() === '2');
					break;
				default:
					selectedPersonType = null;
					break;
			}
		}

		// this.riskGroupForm.get('uso').setValue(selectedUse);
		this.riskGroupForm.get('personType').setValue(selectedPersonType);

		/* 	this.riskGroupForm = this.fb.group({
				uso: [selectedUse, [Validators.required]],
				personType: [selectedPersonType]
			}); */
		this.grupoDescripcion = item.description;
		this.grupoDescripcionDB = item.description;

		for (let index = 0; index < item.subGroups.length; index++) {
			const element = item.subGroups[index];
			if (element.vehicleGroup !== undefined) {
				if (element.vehicleGroup !== null) {
					if (element.vehicleGroup.filters) {
						for (let idx = 0; idx < element.vehicleGroup.filters.length; idx++) {
							const marcamodelo = element.vehicleGroup.filters[idx];
							for (let idxM = 0; idxM < marcamodelo.segmentedModels.length; idxM++) {
								const modelo = marcamodelo.segmentedModels[idxM];
								modelo.brand = new Brand();
								modelo.brand.id = marcamodelo.brandId;
								modelo.brand.description = marcamodelo.brandDescription;
							}
						}
					}
				}
			}
		}

		this.subGroups = item.subGroups;

		this.disableDescription(this.subGroups);
		this.refreshTable(this.subGroups);
		this.disabledUseControl = this.isClone ? false : true;
		this.cd.detectChanges();
	}

	refreshTable(subGroups: SubGroups[]) {
		if (subGroups) {
			this.enabledBotonAceptar = subGroups.length > 0;
			this.disabledUseControl = this.isClone ? false : subGroups.length > 0;
		} else {
			this.enabledBotonAceptar = false;
			this.disabledUseControl = this.isClone ? false : true;
		}

		this.dataSource = new MatTableDataSource(subGroups);
	}
	delete(index: number) {
		this.subGroups.splice(index, 1);
		this.enabledBotonAceptar = this.subGroups.length > 0;
		this.refreshTable(this.subGroups);
		if (!this.isEditing) {
			this.calculateDescription(this.subGroups);
		}
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
	concatenateBrandsAndModels(row: any): string {
		const abc = row.vehicleGroup;
		if (!abc) {
			return '';
		}
		const groupByBrandSort = abc.filters.sort(function (a, b) {
			const nameA = a.brandId,
				nameB = b.brandId;
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});

		const isExc = row.isExclusionVehicleGroup ? '(EXCLUIDO) ' : '';
		const output = isExc + groupByBrandSort.map(x => x.segmentedModels.map(y => y.brand.description + '-' + y.description)).join(', ');
		// return vehicleGroup.filters.map(x => x.segmentedModels.map(y => y.description)).join(', ');
		return output;
	}

	disableDescription(sg: SubGroups[]) {
		const records = sg.filter(subgroup => subgroup.vehicleGroup || subgroup.seatsRestriction);
		// 		this.disabledDescripcionEdition = records.length === 0;
		this.disabledDescripcionEdition = false;
	}
	cleanChk() {
		this.checked = false;
	}

	calculateDescription(sg: SubGroups[]): string {
		const descriptions: string[] = [];
		let personType: string = !this.riskGroupForm.value.personType ? '' : this.getPersonType(this.riskGroupForm.value.personType);
		personType = personType.length > 0 ? `Tipo de persona: ${personType}\n` : '';
		this.disableDescription(sg);
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
		this.grupoDescripcion = `${personType} ${descriptions.filter(x => x !== '').join(', \n')}`.toString().trim();
		return this.grupoDescripcion;
	}



	changeTypePerson() {
		if (!this.isEditing) {
			this.calculateDescription(this.subGroups);
		}
	}
	addDetail(detail: SubGroups = null, isNew: boolean = true) {
		if (!this.riskGroupForm.valid) {
			this.riskGroupForm.reset();
			return;
		}

		const dialogRef = this.dialog.open(RiskGroupOptionsComponent, {
			width: '617px',
			height: '585px',
			data: { data: JSON.parse(JSON.stringify(detail)) , uso: this.riskGroupForm.get("uso").value}
		});

		dialogRef.afterClosed().subscribe((subGroup: SubGroups) => {
			if (!subGroup) {
				return;
			}

			const duplicatedCase = this.subGroups.filter(x => x.vehicleClass.id.toString() === subGroup.vehicleClass.id.toString());

			if (subGroup.vehicleGroup !== null) {
				if (subGroup.vehicleGroup.filters !== null) {
					const filterOrigin = subGroup.vehicleGroup.filters;
					const filterEnd = [];
					for (let index = 0; index < filterOrigin.length; index++) {
						const element = filterOrigin[index];

						const fnd = filterEnd.find(x => x.brandId === element.brandId);
						if (fnd) {
							for (let idxMo = 0; idxMo < element.segmentedModels.length; idxMo++) {
								const elemMo = element.segmentedModels[idxMo];
								const xxx = fnd.segmentedModels.find(x => x.id === elemMo.id);
								if (xxx === undefined) {
									fnd.segmentedModels.push(elemMo); // = fnd.segmentedModels.concat(element.segmentedModels);
								}
							}
						} else {
							filterEnd.push(element);
						}
					}
					subGroup.vehicleGroup.filters = filterEnd;
				}
			}

			if (isNew && duplicatedCase.length > 0) {
				const data = {};
				data['title'] = 'Error';
				data['message'] = 'No se puede duplicar la clase.';
				this.confirmService.confirm(data);
				return false;
			}
			if (duplicatedCase.length > 0) {
				const newSubGroup = SubGroups.CreateInstance(
					subGroup.vehicleClass,
					subGroup.vehicleGroup,
					subGroup.seatsRestriction,
					subGroup.isExclusionVehicleGroup,
					true
				);

				this.subGroups = this.subGroups.filter(x => x.vehicleClass.id.toString() !== subGroup.vehicleClass.id.toString());
				this.subGroups.push(newSubGroup);
				this.refreshTable(this.subGroups);
				if (!this.isEditing) {
					this.calculateDescription(this.subGroups);
				}
				return;
			}

			this.subGroups.push(subGroup);
			this.refreshTable(this.subGroups);
			if (!this.isEditing) {
				this.calculateDescription(this.subGroups);
			}
		});
	}
	edit(row: SubGroups) {
		this.addDetail(row, false);
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
					this.router.navigate(['/risk-group']);
				}
			});
	}

	selectItem(event: any) {
		if (event.checked) {
			this.calculateDescription(this.subGroups);
		} else {
			this.grupoDescripcion = this.grupoDescripcionDB;
		}
	}

	saveRiskGroup() {
		const customRiskGroup: RiskGroup = RiskGroup.CreateInstance(
			this.getOrder(),
			this.grupoDescripcion,
			this.riskGroupForm.value.uso,
			this.getPersonTypesave(this.riskGroupForm.value.personType),
			this.subGroups
		);

		if (!this.hasSubgroups()) {
			return;
		}

		if (this.groupId) {
			customRiskGroup.id = this.groupId;
		}
		this.updateSave.emit(customRiskGroup);
	}

	getOrder(): number {
		if (this.groupId) {
			return this.riskGroup.order;
		}
		return 0;
	}
	getPersonType(personType: any): string {
		if (personType) {
			return personType.id === 1 ? 'NATURAL' : 'JURIDICA (RUC 20)';
		}
		return PersonTypeEnum.ALL;
	}

	getPersonTypesave(personType: any): string {
		if (personType) {
			return personType.id === 1 ? PersonTypeEnum.NATURAL : PersonTypeEnum.JURIDIC;
		}
		return PersonTypeEnum.ALL;
	}

	hasSubgroups(): boolean {
		if (this.subGroups === undefined || this.subGroups.length === 0) {
			const data = {};
			data['title'] = 'Error';
			data['message'] = 'No existen clases seleccionadas';
			this.confirmService.confirm(data);
			return false;
		}
		return true;
	}
}
