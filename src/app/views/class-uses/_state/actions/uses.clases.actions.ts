import { Action } from "@ngrx/store";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from "../../../../shared/models/use.model";
import { Class } from "./../../../../shared/models/class.model";

export enum UsesClassActionTypes {
	/* 	Load = '[ClassUsesModule] Load',
		LoadComplete = '[ClassUsesModule] Load Complete',*/
	UpdateUseSelected = '[ClassUsesModule] Update Use Selected',
	HandledErrors = '[ClassUsesModule] Handled Error',
	LoadUses = '[ClassUsesModule] Load Uses',
	LoadUsesComplete = '[ClassUsesModule] Load Complete Uses',
	/*	LoadPersonType = '[ClassUsesModule] Load Person Type',
	LoadPersonTypeComplete = '[ClassUsesModule] Load Person Type Complete', */
	LoadClasses = '[ClassUsesModule] Load Classes',
	LoadClassesComplete = '[ClassUsesModule] Load Complete Classes',
	LoadUseClasses = '[ClassUsesModule] Load Use Classes',
	LoadUseClassesComplete = '[ClassUsesModule] Load Use Classes Complete',
	CreateUseClasses = '[ClassUsesModule] Create Relationship Between Use and Classes',
	CreateUseClassesComplete = '[ClassUsesModule] Create Relationship Between Use and Classes Complete',
	UpdateUseClassState = '[ClassUsesModule] Update State Use Class',
	UpdateUseClassStateComplete = '[ClassUsesModule] Update State Use Class Complete',
	DeleteUseClass = '[ClassUsesModule] Delete Use Class',
	DeleteUseClassComplete = '[ClassUsesModule] Delete Use Class Complete',
	/* 	LoadBrandsByClass = '[ClassUsesModule] Load BrandsByClass',
		LoadBrandsByClassComplete = '[ClassUsesModule] Load BrandsByClass Complete',
		LoadModelByBrandsByClass = '[ClassUsesModule] Load Models by Brands and Class',
		LoadModelByBrandsByClassComplete = '[ClassUsesModule] Load Models by Brands and Class Complete',
		ReorderRiskGroup = '[ClassUsesModule] Reorder Risk Group',
		ReorderRiskGroupCompleted = '[ClassUsesModule] Reorder Risk Group Completed',
		CreateRiskGroup = '[ClassUsesModule] Create Risk Group',
		CreateRiskGroupCompleted = '[ClassUsesModule] Create Risk Group Completed',
		UpdateRiskGroup = '[ClassUsesModule] Update Risk Group',
		UpdateRiskGroupCompleted = '[ClassUsesModule] Update Risk Group Completed',
		ShowAlert = '[ClassUsesModule] Show Alert',
		ShowAlertCompleted = '[ClassUsesModule] Show Completed',
		GetRiskGroup = '[ClassUsesModule] Get Risk',
		GetRiskGroupCompleted = '[ClassUsesModule] Get Risk Completed',
		SetDefaultRiskGroup = '[ClassUsesModule] Set Default Risk Completed',
		Delete = '[ClassUsesModule] Delete',
		DeleteComplete = '[ClassUsesModule] DeleteComplete Complete',
		LoadFees = '[ClassUsesModule] LoadFees',
		LoadFeesComplete = '[ClassUsesModule] Load Fees Complete' */
}
/* export class SetDefaultRiskGroup implements Action {
	readonly type = UsesClassActionTypes.SetDefaultRiskGroup;
	constructor() { }
}
export class GetRiskGroup implements Action {
	readonly type = UsesClassActionTypes.GetRiskGroup;
	constructor(public groupId: string) { }
}
export class GetRiskGroupCompleted implements Action {
	readonly type = UsesClassActionTypes.GetRiskGroupCompleted;
	constructor(public payload: RiskGroup) { }
}
export class ShowAlert implements Action {
	readonly type = UsesClassActionTypes.ShowAlert;
	constructor(public title: string, public message: string, public status: string) { }
}
export class ShowAlertCompleted implements Action {
	readonly type = UsesClassActionTypes.ShowAlertCompleted;
	constructor() { }
}
export class Load implements Action {
	readonly type = UsesClassActionTypes.Load;
	constructor() { }
}
export class LoadComplete implements Action {
	readonly type = UsesClassActionTypes.LoadComplete;
	constructor(public payload: RiskGroup[]) { }
}

export class LoadFees implements Action {
	readonly type = UsesClassActionTypes.LoadFees;
	constructor() { }
}
export class LoadFeesComplete implements Action {
	readonly type = UsesClassActionTypes.LoadFeesComplete;
	constructor(public payload: Fee[]) { }
}

export class LoadPersonType implements Action {
	readonly type = UsesClassActionTypes.LoadPersonType;
	constructor() { }
}
export class LoadPersonTypeComplete implements Action {
	readonly type = UsesClassActionTypes.LoadPersonTypeComplete;
	constructor(public payload: IPersonType[]) { }
} */
export class LoadClasses implements Action {
	readonly type = UsesClassActionTypes.LoadClasses;
	constructor() { }
}
export class LoadClassesComplete implements Action {
	readonly type = UsesClassActionTypes.LoadClassesComplete;
	constructor(public payload: Class[]) { }
}
/* export class ReorderRiskGroup implements Action {
	readonly type = UsesClassActionTypes.ReorderRiskGroup;
	constructor(public payload: RiskGroup) { }
}
export class ReorderRiskGroupCompleted implements Action {
	readonly type = UsesClassActionTypes.ReorderRiskGroupCompleted;
	constructor() { }
} */
export class LoadUses implements Action {
	readonly type = UsesClassActionTypes.LoadUses;
	constructor() { }
}
export class LoadUsesComplete implements Action {
	readonly type = UsesClassActionTypes.LoadUsesComplete;
	constructor(public payload: Use[]) { }
}
export class UpdateUseSelected implements Action {
	readonly type = UsesClassActionTypes.UpdateUseSelected;
	constructor(public payload: string) { }
}
export class HandledErrors implements Action {
	readonly type = UsesClassActionTypes.HandledErrors;
	constructor(public payload: string) { }
}
export class LoadUseClasses implements Action {
	readonly type = UsesClassActionTypes.LoadUseClasses;
	constructor() {}
}
export class LoadUseClassesComplete implements Action {
	readonly type = UsesClassActionTypes.LoadUseClassesComplete;
	constructor(public payload: UseClass[]) {}
}
export class CreateUseClasses implements Action {
	readonly type = UsesClassActionTypes.CreateUseClasses;
	constructor(public payload: UseClass) {}
}
export class CreateUseClassesComplete implements Action {
	readonly type = UsesClassActionTypes.CreateUseClassesComplete;
	constructor(public payload: any) {}
}
export class UpdateUseClassState implements Action {
	readonly type = UsesClassActionTypes.UpdateUseClassState;
	constructor(public payload: any) {}
}
export class UpdateUseClassStateComplete implements Action {
	readonly type = UsesClassActionTypes.UpdateUseClassStateComplete;
	constructor() {}
}
export class DeleteUseClass implements Action {
	readonly type = UsesClassActionTypes.DeleteUseClass;
	constructor(public payload: string) {}
}
export class DeleteUseClassComplete implements Action {
	readonly type = UsesClassActionTypes.DeleteUseClassComplete;
	constructor() {}
}

/* export class LoadBrandsByClass implements Action {
	readonly type = UsesClassActionTypes.LoadBrandsByClass;
	constructor(public payload: string) { }
}
export class LoadBrandsByClassComplete implements Action {
	readonly type = UsesClassActionTypes.LoadBrandsByClassComplete;
	constructor(public payload: Brand[]) { }
}

export class LoadModelByBrandsByClass implements Action {
	readonly type = UsesClassActionTypes.LoadModelByBrandsByClass;
	constructor(public classId: string, public brandId: string) { }
}
export class LoadModelByBrandsByClassComplete implements Action {
	readonly type = UsesClassActionTypes.LoadModelByBrandsByClassComplete;
	constructor(public payload: Model[]) { }
}

export class CreateRiskGroup implements Action {
	readonly type = UsesClassActionTypes.CreateRiskGroup;
	constructor(public payload: RiskGroup) { }
}
export class CreateRiskGroupCompleted implements Action {
	readonly type = UsesClassActionTypes.CreateRiskGroupCompleted;
	constructor(public payload: any) { }
}

export class UpdateRiskGroup implements Action {
	readonly type = UsesClassActionTypes.UpdateRiskGroup;
	constructor(public payload: RiskGroup) { }
}
export class UpdateRiskGroupCompleted implements Action {
	readonly type = UsesClassActionTypes.UpdateRiskGroupCompleted;
	constructor(public payload: any) { }
}
export class Delete implements Action {
	readonly type = UsesClassActionTypes.Delete;
	constructor(public groupId: string) { }
} */

export type Actions =
	/* 	| Load
		| LoadComplete*/
	UpdateUseSelected
	| LoadUses
	| LoadUsesComplete
	/* 	| ReorderRiskGroup
		| ReorderRiskGroupCompleted */
	| HandledErrors
	| LoadClasses
	| LoadClassesComplete
	| LoadUseClasses
	| LoadUseClassesComplete
	| CreateUseClasses
	| CreateUseClassesComplete
	| UpdateUseClassState
	| UpdateUseClassStateComplete
	| DeleteUseClass
	| DeleteUseClassComplete
	/* | LoadPersonType
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
	| LoadFeesComplete */;
