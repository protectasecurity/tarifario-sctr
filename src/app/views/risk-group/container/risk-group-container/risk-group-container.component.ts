import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SeatsRestriction } from 'app/shared/models/class.model';
import { SeatConfigurationOperator } from 'app/shared/models/seat-configuration.model';
import { Use } from 'app/shared/models/use.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Observable } from 'rxjs';
import { IPersonType } from '../../../../shared/models/person-type.model';
import { RiskGroup } from '../../../../shared/models/risk-group.model';
import * as riskActions from '../../_state/actions/risk.actions';
import { GetRiskGroup, SetDefaultRiskGroup } from '../../_state/actions/risk.actions';
import * as fromReducer from '../../_state/reducers';
import { SeatType } from './../../../../shared/models/class.model';
import { RiskGroupDetailComponent } from './../../components/risk-group-detail/risk-group-detail.component';
import { isNullOrUndefined } from 'util';

@Component({
	selector: 'app-risk-group-container',
	templateUrl: './risk-group-container.component.html',
	styleUrls: ['./risk-group-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RiskGroupContainerComponent implements OnInit {
	uses$: Observable<Use[]> = this.store.select(fromReducer.getUses);
	personTypes$: Observable<IPersonType[]> = this.store.select(fromReducer.getPersonTypes);
	riskGroup$: Observable<RiskGroup> = this.store.select(fromReducer.getRiskGroupItem);
	isCloneItem: boolean = false;
	allRiskGroups$: Observable<RiskGroup[]> = this.store.select(fromReducer.getItems);
	allRiskGroups: RiskGroup[];
	isEditing: boolean = false;
	isLoadRiskGroup: boolean = false;
	@ViewChild(RiskGroupDetailComponent) private cmpRiskGroupDetailComponent: RiskGroupDetailComponent;



	constructor(private store: Store<fromReducer.RiskState>, private confirmService: AppConfirmService, private activatedRoute: ActivatedRoute) {
		this.store.dispatch(new riskActions.LoadUses());
		this.store.dispatch(new riskActions.LoadPersonType());
		this.store.dispatch(new riskActions.Load());
	}

	ngOnInit() {
		this.verifyEdition(this.activatedRoute.snapshot.params['groupId'], this.activatedRoute.snapshot.params['isClone']);

		this.allRiskGroups$.subscribe((value: RiskGroup[]) => {
			this.allRiskGroups = value;
		});
	}

	verifyEdition(id: string, isClone: boolean) {
		if (id) {
			this.isEditing = true;
			this.store.dispatch(new GetRiskGroup(id));
			this.riskGroup$.subscribe(value => {
				if (value !== null) {
					this.isLoadRiskGroup = value.vehicleUse !== undefined;
				}
			});
			if (isClone) {
				this.isCloneItem = true;
				this.isEditing = false;
			}
		} else {
			this.store.dispatch(new SetDefaultRiskGroup());
		}
	}

	readyToShow(): boolean {
		return (this.isEditing && this.isLoadRiskGroup || this.isCloneItem && this.isLoadRiskGroup) ||
			(!this.isEditing && !this.isCloneItem && !this.isLoadRiskGroup);
	}
	save(riskGroup: RiskGroup) {
		const existDescription = this.allRiskGroups.some(element => riskGroup.id && element.id !== riskGroup.id &&
			element.description.toString().trim() === riskGroup.description.toString().trim());
		if (existDescription) {
			this.confirmService.confirm({ title: 'Validación', message: 'La descripción ingresada ya existe.', showcancel: false });
			return;
		}

		let mainModel = RiskGroup.Create(riskGroup);
		riskGroup.subGroups.map(item => item.vehicleClass.id = item.vehicleClass.id + '');
		if (!this.isEditing || this.isCloneItem) {
			mainModel = RiskGroup.CreateModel(riskGroup);
		}
		mainModel.subGroups.map(sub => sub.recordAdded = true);
		riskGroup.subGroups.sort((x, y) => parseInt(x.vehicleClass.id, 10) - parseInt(y.vehicleClass.id, 10));
		const existsClone = this.allRiskGroups.some(el => RiskGroup.isCloneDetail(mainModel, el, this.isEditing, this.isCloneItem));

		if (existsClone) {
			this.confirmService.confirm({ title: 'Validación', message: 'Ya existe un grupo de riesgo con el mismo detalle.', showcancel: false });
			return;
		} else {
			let mensaje = '¿Está seguro de guardar el grupo de riesgo?';
			if (this.isCloneItem) {
				mensaje = '¿Está seguro de guardar el grupo de riesgo (clonado)?';
			}
			this.confirmService
				.confirm({
					title: 'Confirmación',
					message: mensaje,
					showcancel: true
				})
				.subscribe(x => {
					if (x === true) {
						if (this.isCloneItem) {
							this.store.dispatch(new riskActions.CreateRiskGroup(riskGroup));
							return;
						}
						if (riskGroup.id) {
							this.store.dispatch(new riskActions.UpdateRiskGroup(riskGroup));
						} else {
							this.store.dispatch(new riskActions.CreateRiskGroup(riskGroup));
						}
					}
				});
		}
	}
}
