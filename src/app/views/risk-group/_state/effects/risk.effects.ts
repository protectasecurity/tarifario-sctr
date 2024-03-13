import { UseClassService } from "../../../../shared/services/use-class/use-class.service";
import { FeeService } from './../../../fee/fee.service';
import { LoadFee } from './../../../fee/_state/actions/fee.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ClassService } from '../../../../shared/services/class/class.service';
import { PersonTypeService } from '../../../../shared/services/person-type/person-type.service';
import { RiskGroupService } from '../../../../shared/services/risk-group/risk-group.service';
import { UseService } from '../../../../shared/services/use/use.service';
import * as riskActions from '../actions/risk.actions';
import * as fromRoot from '../reducers';
import { AlertService } from './../../../..//shared/services/alert/alert.service';
import { BrandService } from './../../../../shared/services/brand/brand.service';
import { ModelService } from './../../../../shared/services/model/model.service';

@Injectable()
export class RiskEffects {
	constructor(
		private riskGroupService: RiskGroupService,
		private useService: UseService,
		private classService: ClassService,
		private brandService: BrandService,
		private modelService: ModelService,
		private personTypeService: PersonTypeService,
		private actions$: Actions,
		private store: Store<fromRoot.RiskState>,
		private router: Router,
		private alertService: AlertService,
		private feeService: FeeService,
		private useClassService: UseClassService
	) {}

	@Effect()
	getRiskgROUP$ = this.actions$.pipe(
		ofType<riskActions.GetRiskGroup>(riskActions.RiskActionTypes.GetRiskGroup),
		switchMap(action => this.riskGroupService.getById(action.groupId)),
		map(riskGroup => new riskActions.GetRiskGroupCompleted(riskGroup)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);
	@Effect()
	getRisks$ = this.actions$.pipe(
		ofType<riskActions.Load>(riskActions.RiskActionTypes.Load),
		switchMap(() => this.riskGroupService.list()),
		map(riskGroups => new riskActions.LoadComplete(riskGroups)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	getFees$ = this.actions$.pipe(
		ofType<riskActions.LoadFees>(riskActions.RiskActionTypes.LoadFees),
		switchMap(() => this.feeService.getFees()),
		map(mzones => new riskActions.LoadFeesComplete(mzones)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	showAlert$ = this.actions$.pipe(
		ofType<riskActions.ShowAlert>(riskActions.RiskActionTypes.ShowAlert),
		map(action => {
			this.alertService.clear();
			this.alertService.push(action.title, action.message, action.status);
		}),
		map(
			() => new riskActions.ShowAlertCompleted(),
			catchError(error => {
				return observableOf(new riskActions.HandledErrors(error));
			})
		)
	);
	@Effect()
	getClassesByUse$ = this.actions$.pipe(
		ofType<riskActions.LoadClassesByUse>(riskActions.RiskActionTypes.LoadClassesByUse),
		switchMap(action => this.useClassService.getClassesByIdUse(action.payload)),
		map(classes => new riskActions.LoadClassesByUseComplete(classes)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);
	@Effect()
	getPersonTypes$ = this.actions$.pipe(
		ofType<riskActions.LoadPersonType>(riskActions.RiskActionTypes.LoadPersonType),
		switchMap(() => this.personTypeService.list()),
		map(personTypes => new riskActions.LoadPersonTypeComplete(personTypes)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	getUses$ = this.actions$.pipe(
		ofType<riskActions.LoadUses>(riskActions.RiskActionTypes.LoadUses),
		switchMap(() => this.useService.getUses()),
		switchMap(uses => [new riskActions.LoadUsesComplete(uses), new riskActions.UpdateUseSelected(uses.sort((a, b) => a.order - b.order)[0].id)]),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	reorderingRiskGroup$ = this.actions$.pipe(
		ofType<riskActions.ReorderRiskGroup>(riskActions.RiskActionTypes.ReorderRiskGroup),
		map(action => action.payload),
		switchMap(newFee =>
			this.riskGroupService.updateorder(newFee).pipe(
				map(() => new riskActions.ReorderRiskGroupCompleted()),
				catchError(error => {
					return observableOf(new riskActions.ReorderRiskGroupCompleted());
				})
			)
		)
	);

	@Effect()
	getBrandsByClass$ = this.actions$.pipe(
		ofType<riskActions.LoadBrandsByClass>(riskActions.RiskActionTypes.LoadBrandsByClass),
		map(action => action.payload),
		switchMap(classId => this.brandService.getBrandsByClass(classId)),
		map(brands => new riskActions.LoadBrandsByClassComplete(brands)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	getModelsByBrandsByClass$ = this.actions$.pipe(
		ofType<riskActions.LoadModelByBrandsByClass>(riskActions.RiskActionTypes.LoadModelByBrandsByClass),
		switchMap(action => this.modelService.getModelsByBrandsByClass(action.classId, action.brandId)),
		map(models => new riskActions.LoadModelByBrandsByClassComplete(models)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	createRiskGroup$ = this.actions$.pipe(
		ofType<riskActions.CreateRiskGroup>(riskActions.RiskActionTypes.CreateRiskGroup),
		withLatestFrom(this.store.select(fromRoot.getItems)),
		switchMap(([action, items]) => {
			const newRecord = action.payload;
			// const isThereDuplicated = items.filter(
			//     x =>
			//         x.description === newRecord.description
			//         //&& x.personType === newRecord.personType
			//         //&& x.subGroups.vehicleClass === newRecord.subGroups.vehicleClass
			//         && x.vehicleUse.id.toString() === newRecord.vehicleUse.id.toString()
			// );

			// if (isThereDuplicated.length > 0) {
			//     this.router.navigate(['/risk-group']);
			//     return [new riskActions.ShowAlert('Grupo de Riesgo: ', 'Se intento agregar un riesgo duplicado', 'success')]
			// }

			return this.riskGroupService.create(newRecord).pipe(
				switchMap(response => {
					this.router.navigate(['/risk-group']);
					return [
						new riskActions.ShowAlert('Grupo de Riesgo: ', 'Se ha creado un grupo de riesgo con éxito', 'success'),
						new riskActions.CreateRiskGroupCompleted(response)
					];
				})
			);
		}),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	updateRiskGroup$ = this.actions$.pipe(
		ofType<riskActions.UpdateRiskGroup>(riskActions.RiskActionTypes.UpdateRiskGroup),
		switchMap(action =>
			this.riskGroupService.update(action.payload).pipe(
				switchMap(response => {
					this.router.navigate(['/risk-group']);
					return [
						new riskActions.ShowAlert('Grupo de Riesgo: ', 'Se actualizó el grupo de riesgo con éxito', 'success'),
						new riskActions.UpdateRiskGroupCompleted(response)
					];
				})
			)
		),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	deleteRiskGroup$ = this.actions$.pipe(
		ofType<riskActions.Delete>(riskActions.RiskActionTypes.Delete),
		switchMap(action =>
			this.riskGroupService.delete(action.groupId).pipe(
				switchMap(() => {
					return [new riskActions.ShowAlert('Grupo de Riesgo: ', 'Se actualizó el grupo de riesgo con éxito', 'success'), new riskActions.Load()];
				})
			)
		),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);
}
