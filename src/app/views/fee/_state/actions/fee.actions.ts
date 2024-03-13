import { Action } from "@ngrx/store";
import { Zone } from "app/views/zones/models/zone.model";
import { Brand } from "../../../../shared/models/brand.model";
import { Model } from "../../../../shared/models/model.model";
import { IPersonType } from "../../../../shared/models/person-type.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import { Fee, IFeeSearch } from "../../models/fee.model";
import { IMatrixChannelGroup, TariffMatrix } from "../../models/tariffmatrix.model";
import { RiskGroup } from "./../../../../shared/models/risk-group.model";
import { Use } from "./../../../../shared/models/use.model";
import { IPlateSearch } from "./../../models/fee.model";

export enum FeeActionTypes {
	Load = '[Fee] Load',
	LoadComplete = '[Fee] Load Complete',
	LoadFee = '[Fee] Load Fee',
	LoadFeeComplete = '[Fee] Load Fee Complete',
	CreateFee = '[Fee] Create Fee',
	CreateFeeCompleted = '[Fee] Create Fee Completed',
	UpdateFee = '[Fee] Update  Fee',
	UpdateFeeCompleted = '[Fee] Update Fee Completed',
	DeleteFee = '[Fee] Delete Fee',
	DeleteFeeCompleted = '[Fee] Delete Fee Completed',
	LoadUses = '[Fee] Load Uses',
	LoadUsesComplete = '[Fee] Load Uses Complete',
	LoadRiskgroups = '[Risk] Load Riskgroups',
	LoadRiskgroupsComplete = '[Risk] Load Riskgroups Complete',
	LoadZones = '[Fee] Load Zones',
	LoadZonesCompleted = '[Fee] Load Zones Completed',
	HandledErrors = '[Fee] Handled Error',
	LoadFeeUpdates = '[Fee] Load Fee Updates',
	LoadFeeUpdatesComplete = '[Fee] Load Fee Updates Complete',
	LoadChannelGroup = '[Fee] Load ChannelGroup',
	LoadChannelGroupComplete = '[Fee] Load ChannelGroup Completed',
	LoadDepartments = '[Fee] Load Departments',
	LoadDepartmentsComplete = '[Fee] Load Departments Completed',
	LoadPersonTypes = '[Fee] Load PersonTypes',
	LoadPersonTypesComplete = '[Fee] Load PersonTypes Completed',
	LoadClassesByUse = '[Risk] Load Classes by Use',
	LoadClassesByUseComplete = '[Risk] Load Classes by Use Complete',
	LoadBrandsByClass = '[Risk] Load BrandsByClass',
	LoadBrandsByClassComplete = '[Risk] Load BrandsByClass Complete',
	LoadModelByBrandsByClass = '[Risk] Load Models by Brands and Class',
	LoadModelByBrandsByClassComplete = '[Risk] Load Models by Brands and Class Complete',
	LoadFeeSearch = '[Fee] Load Fee by search',
	LoadFeeSearchComplete = '[Fee] Load Fee by search Complete',
	LoadPlateSearch = '[Fee] Load Plate by search',
	LoadPlateSearchComplete = '[Fee] Load Plate by search Complete'
}

// Obtener Listado de tarifas
export class Load implements Action {
	readonly type = FeeActionTypes.Load;
	constructor() { }
}
export class LoadComplete implements Action {
	readonly type = FeeActionTypes.LoadComplete;
	constructor(public payload: Fee[]) { }
}

// Obtener Listado de tarifas
export class LoadFee implements Action {
	readonly type = FeeActionTypes.LoadFee;
	constructor(public payload: string, public date: string) { }
}
export class LoadFeeComplete implements Action {
	readonly type = FeeActionTypes.LoadFeeComplete;
	constructor(public payload: Fee) { }
}

export class LoadFeeUpdates implements Action {
	readonly type = FeeActionTypes.LoadFeeUpdates;
	constructor(public payload: string) { }
}
export class LoadFeeUpdatesComplete implements Action {
	readonly type = FeeActionTypes.LoadFeeUpdatesComplete;
	constructor(public payload: string[]) { }
}

// Obtener Listado de usos
export class LoadUses implements Action {
	readonly type = FeeActionTypes.LoadUses;
	constructor() { }
}
export class LoadUsesComplete implements Action {
	readonly type = FeeActionTypes.LoadUsesComplete;
	constructor(public payload: Use[]) { }
}

// Obtener Listado de usos
export class LoadRiskgroups implements Action {
	readonly type = FeeActionTypes.LoadRiskgroups;
	constructor() { }
}
export class LoadRiskgroupsComplete implements Action {
	readonly type = FeeActionTypes.LoadRiskgroupsComplete;
	constructor(public payload: RiskGroup[]) { }
}

// Obtener Listado de usos
export class LoadZones implements Action {
	readonly type = FeeActionTypes.LoadZones;
	constructor() { }
}
export class LoadZonesCompleted implements Action {
	readonly type = FeeActionTypes.LoadZonesCompleted;
	constructor(public payload: Zone[]) { }
}

export class CreateFee implements Action {
	readonly type = FeeActionTypes.CreateFee;
	constructor(public payload: TariffMatrix) { }
}
export class CreateFeeCompleted implements Action {
	readonly type = FeeActionTypes.CreateFeeCompleted;
	constructor() { }
}
export class UpdateFee implements Action {
	readonly type = FeeActionTypes.UpdateFee;
	constructor(public payload: TariffMatrix) { }
}
export class UpdateFeeCompleted implements Action {
	readonly type = FeeActionTypes.UpdateFeeCompleted;
	constructor() { }
}
export class DeleteFee implements Action {
	readonly type = FeeActionTypes.DeleteFee;
	constructor(public payload: string) { }
}
export class DeleteFeeCompleted implements Action {
	readonly type = FeeActionTypes.DeleteFeeCompleted;
	constructor() { }
}
export class HandledErrors implements Action {
	readonly type = FeeActionTypes.HandledErrors;
	constructor(public payload: string) { }
}
export class LoadChannelGroup implements Action {
	readonly type = FeeActionTypes.LoadChannelGroup;
	constructor() { }
}
export class LoadChannelGroupComplete implements Action {
	readonly type = FeeActionTypes.LoadChannelGroupComplete;
	constructor(public payload: IMatrixChannelGroup[]) { }
}
export class LoadDepartments implements Action {
	readonly type = FeeActionTypes.LoadDepartments;
	constructor() { }
}
export class LoadDepartmentsComplete implements Action {
	readonly type = FeeActionTypes.LoadDepartmentsComplete;
	constructor(public payload: Ubigeo[]) { }
}
export class LoadPersonTypes implements Action {
	readonly type = FeeActionTypes.LoadPersonTypes;
	constructor() { }
}
export class LoadPersonTypesComplete implements Action {
	readonly type = FeeActionTypes.LoadPersonTypesComplete;
	constructor(public payload: IPersonType[]) { }
}
export class LoadClassesByUse implements Action {
	readonly type = FeeActionTypes.LoadClassesByUse;
	constructor(public payload: string) { }
}
export class LoadClassesByUseComplete implements Action {
	readonly type = FeeActionTypes.LoadClassesByUseComplete;
	constructor(public payload: UseClass[]) { }
}
export class LoadBrandsByClass implements Action {
	readonly type = FeeActionTypes.LoadBrandsByClass;
	constructor(public payload: string) { }
}
export class LoadBrandsByClassComplete implements Action {
	readonly type = FeeActionTypes.LoadBrandsByClassComplete;
	constructor(public payload: Brand[]) { }
}

export class LoadModelByBrandsByClass implements Action {
	readonly type = FeeActionTypes.LoadModelByBrandsByClass;
	constructor(public classId: string, public brandId: string) { }
}
export class LoadModelByBrandsByClassComplete implements Action {
	readonly type = FeeActionTypes.LoadModelByBrandsByClassComplete;
	constructor(public payload: Model[]) { }
}
export class LoadFeeSearch implements Action {
	readonly type = FeeActionTypes.LoadFeeSearch;
	constructor(public query: any) { }
}
export class LoadFeeSearchComplete implements Action {
	readonly type = FeeActionTypes.LoadFeeSearchComplete;
	constructor(public payload: IFeeSearch[]) { }
}
export class LoadPlateSearch implements Action {
	readonly type = FeeActionTypes.LoadPlateSearch;
	constructor(public regist: any) { }
}
export class LoadPlateSearchComplete implements Action {
	readonly type = FeeActionTypes.LoadPlateSearchComplete;
	constructor(public payload: IPlateSearch) { }
}
export type Actions =
	| Load
	| LoadComplete
	| HandledErrors
	| LoadFee
	| LoadFeeComplete
	| LoadUses
	| LoadUsesComplete
	| LoadRiskgroups
	| LoadRiskgroupsComplete
	| LoadZones
	| LoadZonesCompleted
	| CreateFee
	| CreateFeeCompleted
	| UpdateFee
	| UpdateFeeCompleted
	| DeleteFee
	| DeleteFeeCompleted
	| LoadFeeUpdates
	| LoadFeeUpdatesComplete
	| LoadChannelGroup
	| LoadChannelGroupComplete
	| LoadDepartments
	| LoadDepartmentsComplete
	| LoadPersonTypes
	| LoadPersonTypesComplete
	| LoadClassesByUse
	| LoadClassesByUseComplete
	| LoadBrandsByClass
	| LoadBrandsByClassComplete
	| LoadModelByBrandsByClass
	| LoadModelByBrandsByClassComplete
	| LoadFeeSearch
	| LoadFeeSearchComplete
	| LoadPlateSearch |
	LoadPlateSearchComplete;
