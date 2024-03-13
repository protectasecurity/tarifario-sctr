import { UseClass } from "../../../../shared/models/use-class.model";
import { Fee } from './../../../fee/models/fee.model';
import { Action } from '@ngrx/store';
import { Model } from 'app/shared/models/model.model';
import { IPersonType } from 'app/shared/models/person-type.model';
import { RiskGroup } from '../../../../shared/models/risk-group.model';
import { Use } from '../../../../shared/models/use.model';
import { Brand } from './../../../../shared/models/brand.model';
import { Class } from './../../../../shared/models/class.model';

export enum RiskActionTypes {
	Load = '[Risk] Load',
	LoadComplete = '[Risk] Load Complete',
	UpdateUseSelected = '[Risk] Update Use Selected',
	HandledErrors = '[Risk] Handled Error',
	LoadUses = '[Risk] Load Uses',
	LoadUsesComplete = '[Risk] Load Complete Uses',
	LoadPersonType = '[Risk] Load Person Type',
	LoadPersonTypeComplete = '[Risk] Load Person Type Complete',
	LoadClasses = '[Risk] Load Classes',
	LoadClassesComplete = '[Risk] Load Complete Classes',
	LoadClassesByUse = '[Risk] Load Classes by Use',
	LoadClassesByUseComplete = '[Risk] Load Complete Classes by Use',
	LoadBrandsByClass = '[Risk] Load BrandsByClass',
	LoadBrandsByClassComplete = '[Risk] Load BrandsByClass Complete',
	LoadModelByBrandsByClass = '[Risk] Load Models by Brands and Class',
	LoadModelByBrandsByClassComplete = '[Risk] Load Models by Brands and Class Complete',
	ReorderRiskGroup = '[Risk] Reorder Risk Group',
	ReorderRiskGroupCompleted = '[Risk] Reorder Risk Group Completed',
	CreateRiskGroup = '[Risk] Create Risk Group',
	CreateRiskGroupCompleted = '[Risk] Create Risk Group Completed',
	UpdateRiskGroup = '[Risk] Update Risk Group',
	UpdateRiskGroupCompleted = '[Risk] Update Risk Group Completed',
	ShowAlert = '[Risk] Show Alert',
	ShowAlertCompleted = '[Risk] Show Completed',
	GetRiskGroup = '[Risk] Get Risk',
	GetRiskGroupCompleted = '[Risk] Get Risk Completed',
	SetDefaultRiskGroup = '[Risk] Set Default Risk Completed',
	Delete = '[Risk] Delete',
	DeleteComplete = '[Risk] DeleteComplete Complete',
	LoadFees = '[Risk] LoadFees',
	LoadFeesComplete = '[Risk] Load Fees Complete'
}
export class SetDefaultRiskGroup implements Action {
	readonly type = RiskActionTypes.SetDefaultRiskGroup;
	constructor() {}
}
export class GetRiskGroup implements Action {
	readonly type = RiskActionTypes.GetRiskGroup;
	constructor(public groupId: string) {}
}
export class GetRiskGroupCompleted implements Action {
	readonly type = RiskActionTypes.GetRiskGroupCompleted;
	constructor(public payload: RiskGroup) {}
}
export class ShowAlert implements Action {
	readonly type = RiskActionTypes.ShowAlert;
	constructor(public title: string, public message: string, public status: string) {}
}
export class ShowAlertCompleted implements Action {
	readonly type = RiskActionTypes.ShowAlertCompleted;
	constructor() {}
}
export class Load implements Action {
	readonly type = RiskActionTypes.Load;
	constructor() {}
}
export class LoadComplete implements Action {
	readonly type = RiskActionTypes.LoadComplete;
	constructor(public payload: RiskGroup[]) {}
}

export class LoadFees implements Action {
	readonly type = RiskActionTypes.LoadFees;
	constructor() {}
}
export class LoadFeesComplete implements Action {
	readonly type = RiskActionTypes.LoadFeesComplete;
	constructor(public payload: Fee[]) {}
}

export class LoadPersonType implements Action {
	readonly type = RiskActionTypes.LoadPersonType;
	constructor() {}
}
export class LoadPersonTypeComplete implements Action {
	readonly type = RiskActionTypes.LoadPersonTypeComplete;
	constructor(public payload: IPersonType[]) {}
}
export class LoadClasses implements Action {
	readonly type = RiskActionTypes.LoadClasses;
	constructor() {}
}
export class LoadClassesComplete implements Action {
	readonly type = RiskActionTypes.LoadClassesComplete;
	constructor(public payload: Class[]) {}
}
export class LoadClassesByUse implements Action {
	readonly type = RiskActionTypes.LoadClassesByUse;
	constructor(public payload: string) {}
}
export class LoadClassesByUseComplete implements Action {
	readonly type = RiskActionTypes.LoadClassesByUseComplete;
	constructor(public payload: UseClass[]) {}
}
export class ReorderRiskGroup implements Action {
	readonly type = RiskActionTypes.ReorderRiskGroup;
	constructor(public payload: RiskGroup) {}
}
export class ReorderRiskGroupCompleted implements Action {
	readonly type = RiskActionTypes.ReorderRiskGroupCompleted;
	constructor() {}
}
export class LoadUses implements Action {
	readonly type = RiskActionTypes.LoadUses;
	constructor() {}
}
export class LoadUsesComplete implements Action {
	readonly type = RiskActionTypes.LoadUsesComplete;
	constructor(public payload: Use[]) {}
}
export class UpdateUseSelected implements Action {
	readonly type = RiskActionTypes.UpdateUseSelected;
	constructor(public payload: string) {}
}
export class HandledErrors implements Action {
	readonly type = RiskActionTypes.HandledErrors;
	constructor(public payload: string) {}
}

export class LoadBrandsByClass implements Action {
	readonly type = RiskActionTypes.LoadBrandsByClass;
	constructor(public payload: string) {}
}
export class LoadBrandsByClassComplete implements Action {
	readonly type = RiskActionTypes.LoadBrandsByClassComplete;
	constructor(public payload: Brand[]) {}
}

export class LoadModelByBrandsByClass implements Action {
	readonly type = RiskActionTypes.LoadModelByBrandsByClass;
	constructor(public classId: string, public brandId: string) {}
}
export class LoadModelByBrandsByClassComplete implements Action {
	readonly type = RiskActionTypes.LoadModelByBrandsByClassComplete;
	constructor(public payload: Model[]) {}
}

export class CreateRiskGroup implements Action {
	readonly type = RiskActionTypes.CreateRiskGroup;
	constructor(public payload: RiskGroup) {}
}
export class CreateRiskGroupCompleted implements Action {
	readonly type = RiskActionTypes.CreateRiskGroupCompleted;
	constructor(public payload: any) {}
}

export class UpdateRiskGroup implements Action {
	readonly type = RiskActionTypes.UpdateRiskGroup;
	constructor(public payload: RiskGroup) {}
}
export class UpdateRiskGroupCompleted implements Action {
	readonly type = RiskActionTypes.UpdateRiskGroupCompleted;
	constructor(public payload: any) {}
}
export class Delete implements Action {
	readonly type = RiskActionTypes.Delete;
	constructor(public groupId: string) {}
}

export type Actions =
	| Load
	| LoadComplete
	| UpdateUseSelected
	| LoadUses
	| LoadUsesComplete
	| ReorderRiskGroup
	| ReorderRiskGroupCompleted
	| HandledErrors
	| LoadClasses
	| LoadClassesComplete
	| LoadClassesByUse
	| LoadClassesByUseComplete
	| LoadPersonType
	| LoadPersonTypeComplete
	| LoadBrandsByClass
	| LoadBrandsByClassComplete
	| LoadModelByBrandsByClass
	| LoadModelByBrandsByClassComplete
	| CreateRiskGroup
	| CreateRiskGroupCompleted
	| UpdateRiskGroup
	| UpdateRiskGroupCompleted
	| ShowAlert
	| ShowAlertCompleted
	| GetRiskGroup
	| GetRiskGroupCompleted
	| SetDefaultRiskGroup
	| Delete
	| LoadFees
	| LoadFeesComplete;
