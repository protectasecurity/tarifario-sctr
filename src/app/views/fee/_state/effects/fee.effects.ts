import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BrandService } from "../../../../shared/services/brand/brand.service";
import { ClassService } from "../../../../shared/services/class/class.service";
import { ModelService } from "../../../../shared/services/model/model.service";
import { PersonTypeService } from "../../../../shared/services/person-type/person-type.service";
import { RiskGroupService } from "../../../../shared/services/risk-group/risk-group.service";
import { UseClassService } from "../../../../shared/services/use-class/use-class.service";
import { UseService } from "../../../../shared/services/use/use.service";
import { FeeService } from "../../fee.service";
import * as feeActions from "../actions/fee.actions";
import { ChannelService } from "./../../../manage-channel/services/channel.service";
import { ZoneService } from "./../../../zones/zone.service";

@Injectable()
export class FeeEffects {
	constructor(
		private feeService: FeeService,
		private useService: UseService,
		private riskgroupService: RiskGroupService,
		private zoneService: ZoneService,
		private channelService: ChannelService,
		private personTypeService: PersonTypeService,
		private classService: ClassService,
		private brandService: BrandService,
		private modelService: ModelService,
		private actions$: Actions,
		private router: Router,
		private useClassService: UseClassService
	) { }

	@Effect()
	getFee$ = this.actions$.pipe(
		ofType<feeActions.LoadFee>(feeActions.FeeActionTypes.LoadFee),
		switchMap(action =>
			this.feeService.getFee(action.payload, action.date).pipe(
				map(fee => new feeActions.LoadFeeComplete(fee)),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	);

	@Effect()
	getFeeUpdates$ = this.actions$.pipe(
		ofType<feeActions.LoadFee>(feeActions.FeeActionTypes.LoadFeeUpdates),
		switchMap(action =>
			this.feeService.getFeeUpdates(action.payload).pipe(
				map(fee => new feeActions.LoadFeeUpdatesComplete(fee)),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	);

	@Effect()
	getFees$ = this.actions$.pipe(
		ofType<feeActions.Load>(feeActions.FeeActionTypes.Load),
		switchMap(() => this.feeService.getFees()),
		map(mzones => new feeActions.LoadComplete(mzones)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getUses$ = this.actions$.pipe(
		ofType<feeActions.LoadUses>(feeActions.FeeActionTypes.LoadUses),
		switchMap(() => this.useService.getUses()),
		map(uses => new feeActions.LoadUsesComplete(uses)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getRiskGroups$ = this.actions$.pipe(
		ofType<feeActions.LoadRiskgroups>(feeActions.FeeActionTypes.LoadRiskgroups),
		switchMap(() => this.riskgroupService.list()),
		map(rg => new feeActions.LoadRiskgroupsComplete(rg)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getRegist$ = this.actions$.pipe(
		ofType<feeActions.LoadPlateSearch>(feeActions.FeeActionTypes.LoadPlateSearch),
		map(action => action.regist),
		switchMap((regist) => this.feeService.searchRegist(regist)),
		map(rg => new feeActions.LoadPlateSearchComplete(rg)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getZones$ = this.actions$.pipe(
		ofType<feeActions.LoadZones>(feeActions.FeeActionTypes.LoadZones),
		switchMap(() => this.zoneService.getZones()),
		map(mzones => new feeActions.LoadZonesCompleted(mzones)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getChannelGroup$ = this.actions$.pipe(
		ofType<feeActions.LoadChannelGroup>(feeActions.FeeActionTypes.LoadChannelGroup),
		switchMap(() => this.channelService.listMatrixChannel()),
		map(channels => new feeActions.LoadChannelGroupComplete(channels)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	createfee$ = this.actions$.pipe(
		ofType<feeActions.CreateFee>(feeActions.FeeActionTypes.CreateFee),
		map(action => action.payload),
		switchMap(newFee =>
			this.feeService.createFee(newFee).pipe(
				map(() => new feeActions.CreateFeeCompleted()),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	);

	/* 	@Effect({ dispatch: false })
	createfeeCompleted$ = this.actions$.pipe(
		ofType<feeActions.CreateFeeCompleted>(feeActions.FeeActionTypes.CreateFeeCompleted),
		switchMap(() => this.router.navigate(['/fee']))
	); */

	@Effect()
	updatefee$ = this.actions$.pipe(ofType<feeActions.UpdateFee>(feeActions.FeeActionTypes.UpdateFee),
		map(action => action.payload),
		switchMap(newFee =>
			this.feeService.updateFee(newFee).pipe(
				map(() => new feeActions.UpdateFeeCompleted()),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	);

	/* 	@Effect({ dispatch: false })
	updatefeeCompleted$ = this.actions$.pipe(
		ofType<feeActions.UpdateFeeCompleted>(feeActions.FeeActionTypes.UpdateFeeCompleted),
		switchMap(() => this.router.navigate(['/fee']))
	); */

	/* 	@Effect()
	deletefee$ = this.actions$.pipe(
		ofType<feeActions.DeleteFee>(feeActions.FeeActionTypes.DeleteFee),
		map(action => action.payload),
		switchMap(newFee =>
			this.feeService.deleteFee(newFee).pipe(
				map(() => new feeActions.DeleteFeeCompleted()),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	); */

	@Effect()
	deletefee$ = this.actions$.pipe(
		ofType<feeActions.DeleteFee>(feeActions.FeeActionTypes.DeleteFee),
		map(action => action.payload),
		switchMap(id =>
			this.feeService.deleteFee(id).pipe(
				map(() => new feeActions.DeleteFeeCompleted()),
				map(() => new feeActions.Load()),
				catchError(error => {
					return observableOf(new feeActions.HandledErrors(error));
				})
			)
		)
	);
	// this.router.navigate(['/fee/list'])
	@Effect({ dispatch: false })
	deletefeeCompleted$ = this.actions$.pipe(
		ofType<feeActions.UpdateFeeCompleted>(feeActions.FeeActionTypes.UpdateFeeCompleted),
		switchMap(() => new Promise((res) => {
			setTimeout(() => {
				this.router.navigate(['/fee/list']);
			}, 5000);
		}))
	);

	@Effect()
	getDepartments$ = this.actions$.pipe(
		ofType<feeActions.LoadDepartments>(feeActions.FeeActionTypes.LoadDepartments),
		switchMap(() => this.zoneService.getLocations()),
		map(departments => new feeActions.LoadDepartmentsComplete(departments)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);
	@Effect()
	getPersonTypes$ = this.actions$.pipe(
		ofType<feeActions.LoadPersonTypes>(feeActions.FeeActionTypes.LoadPersonTypes),
		switchMap(() => this.personTypeService.list()),
		map(personTypes => new feeActions.LoadPersonTypesComplete(personTypes)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);
	@Effect()
	getClassesByUse$ = this.actions$.pipe(
		ofType<feeActions.LoadClassesByUse>(feeActions.FeeActionTypes.LoadClassesByUse),
		switchMap(action => this.useClassService.getClassesByIdUse(action.payload)),
		map(classes => new feeActions.LoadClassesByUseComplete(classes)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);
	@Effect()
	getBrandsByClass$ = this.actions$.pipe(
		ofType<feeActions.LoadBrandsByClass>(feeActions.FeeActionTypes.LoadBrandsByClass),
		map(action => action.payload),
		switchMap(classId => this.brandService.getBrandsByClass(classId)),
		map(brands => new feeActions.LoadBrandsByClassComplete(brands)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	getModelsByBrandsByClass$ = this.actions$.pipe(
		ofType<feeActions.LoadModelByBrandsByClass>(feeActions.FeeActionTypes.LoadModelByBrandsByClass),
		switchMap(action => this.modelService.getModelsByBrandsByClass(action.classId, action.brandId)),
		map(models => new feeActions.LoadModelByBrandsByClassComplete(models)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);

	@Effect()
	searchFee$ = this.actions$.pipe(
		ofType<feeActions.LoadFeeSearch>(feeActions.FeeActionTypes.LoadFeeSearch),
		switchMap(query => this.feeService.searchFee(query)),
		map(data => new feeActions.LoadFeeSearchComplete(data)),
		catchError(error => {
			return observableOf(new feeActions.HandledErrors(error));
		})
	);
}
