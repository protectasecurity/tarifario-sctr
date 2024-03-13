import { Action } from "@ngrx/store";
import { Actividades } from "../../../actividades/models/Actividades";
import { FeeActionTypes } from "../../../fee/_state/actions/fee.actions";
import { Parameter } from "../../../parameters/models/parameter.model";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import { Zone } from "../../../zones/models/zone.model";
import { IMatrixChannelGroup, MatrizRiesgo } from "../../models/matriz.model";


export enum MatrizActionsType {
	Load = '[Matriz] Load',
	LoadM = '[Matriz] Load Matriz',
	CreateMatriz = '[Matriz] Create Matriz',
	CreateMatrizCompleted = '[Matriz] Create Completed Matriz',
	LoadComplete = '[Matriz] Load Complete',
	LoadCompleteM = '[Matriz] Load Complete Matriz',
	LoadMatriz = '[Matriz] Load Object Matriz',
	LoadMatrizComplete = '[Matriz] Load Complete Object Matriz',
	LoadMatrizUpdates = '[Matriz] Load Update Object Matriz',
	LoadMatrizUpdatesComplete = '[Matriz] Load Update Complete Object Matriz',
	LoadUpdatesMatriz = '[Matriz] Load Updates Object Matriz',
	LoadUpdatesMatrizComplete = '[Matriz] Load Updates Complete Object Matriz',
	DeleteMatriz = '[Matriz] Load Delete Object Matriz',
	DeleteMatrizCompleted = '[Matriz] Load Delete Complete Object Matriz',
	LoadChannelGroup = '[Matriz] Load ChannelGroup',
	LoadChannelGroupComplete = '[Matriz] Load ChannelGroup Completed',
	LoadZones = '[Matriz] Load Zones',
	LoadDepartments = '[Matriz] Load Departments',
	LoadDepartmentsComplete = '[Matriz] Load Departments Completed',
	LoadParameters = '[Matriz] Load Parameters',
	LoadZonesCompleted = '[Matriz] Load Zones Completed',
	LoadParametersComplete = '[Matriz] Load Parameters Completed',
	LoadActividades = '[Matriz] Load Actividades',
	LoadGetPremiun = '[Matriz] Load Get Premiun',
	LoadGetPremiunComplete = '[Matriz] Load Get Premiun Completed',
	LoadActividadesCompleted = '[Matriz] Load Actividades Completed',
	LoadEffectDate = '[Matriz] Load EffectDate',
	LoadEffectDateCompleted = '[Matriz] Load EffectDate Completed',
	HandledErrors = '[Matriz] Handled Error',
}

export class CreateMatriz {
	readonly type = MatrizActionsType.CreateMatriz;
	constructor(public payload: MatrizRiesgo) { }
}

export class CreateMatrizCompleted {
	readonly type = MatrizActionsType.CreateMatrizCompleted;
	constructor() { }
}
export class LoadM implements Action {
	readonly type = MatrizActionsType.LoadM;
	constructor() { }
}
export class LoadCompleteM implements Action {
	readonly type = MatrizActionsType.LoadCompleteM;
	constructor(public payload: MatrizRiesgo[]) { }
}

// Obtener Listado de tarifas
export class LoadMatriz implements Action {
	readonly type = MatrizActionsType.LoadMatriz;
	constructor(public payload: string, public date: string) { }
}
export class LoadMatrizComplete implements Action {
	readonly type = MatrizActionsType.LoadMatrizComplete;
	constructor(public payload: MatrizRiesgo) { }
}

export class LoadMatrizUpdates implements Action {
	readonly type = MatrizActionsType.LoadMatrizUpdates;
	constructor(public payload: MatrizRiesgo) { }
}
export class LoadMatrizUpdatesComplete implements Action {
	readonly type = MatrizActionsType.LoadMatrizUpdatesComplete;
	constructor(public payload: MatrizRiesgo[]) { }
}

export class LoadUpdatesMatriz implements Action {
	readonly type = MatrizActionsType.LoadUpdatesMatriz;
	constructor(public payload: string) { }
}
export class LoadUpdatesMatrizComplete implements Action {
	readonly type = MatrizActionsType.LoadUpdatesMatrizComplete;
	constructor(public payload: string[]) { }
}

export class Load implements Action {
	readonly type = MatrizActionsType.Load;
	constructor() {}
}

export class LoadGetPremiun implements Action {
	readonly type = MatrizActionsType.LoadGetPremiun;
	constructor(public payload: any) {}
}

export class LoadGetPremiunComplete implements Action {
	readonly type = MatrizActionsType.LoadGetPremiunComplete;
	constructor(public payload: any[]) {}
}

export class LoadComplete implements Action {
	readonly type = MatrizActionsType.LoadComplete;
	constructor(public payload: any[]) {}
}
export class DeleteMatriz implements Action {
	readonly type = MatrizActionsType.DeleteMatriz;
	constructor(public payload: string) { }
}
export class DeleteMatrizCompleted implements Action {
	readonly type = MatrizActionsType.DeleteMatrizCompleted;
	constructor() { }
}

export class LoadParameters implements Action {
	readonly type = MatrizActionsType.LoadParameters;
	constructor() { }
}
export class LoadParametersComplete implements Action {
	readonly type = MatrizActionsType.LoadParametersComplete;
	constructor(public payload: Parameter[]) { }
}

export class LoadZones implements Action {
	readonly type = MatrizActionsType.LoadZones;
	constructor() {}
}
export class LoadZonesCompleted implements Action {
	readonly type = MatrizActionsType.LoadZonesCompleted;
	constructor(public payload: Zone[]) {}
}
export class LoadDepartments implements Action {
	readonly type = MatrizActionsType.LoadDepartments;
	constructor() { }
}
export class LoadDepartmentsComplete implements Action {
	readonly type = MatrizActionsType.LoadDepartmentsComplete;
	constructor(public payload: Ubigeo[]) { }
}
export class LoadActividades implements Action {
	readonly type = MatrizActionsType.LoadActividades;
	constructor() {}
}
export class LoadActividadesCompleted implements Action {
	readonly type = MatrizActionsType.LoadActividadesCompleted;
	constructor(public payload: Actividades[]) {}
}
export class LoadEffectDate implements Action {
	readonly type = MatrizActionsType.LoadEffectDate;
	constructor(public payload: string, public date: string) { }
}
export class LoadEffectDateCompleted implements Action {
	readonly type = MatrizActionsType.LoadEffectDateCompleted;
	constructor(public payload: any) {}
}
export class LoadChannelGroup implements Action {
	readonly type = MatrizActionsType.LoadChannelGroup;
	constructor() { }
}
export class LoadChannelGroupComplete implements Action {
	readonly type = MatrizActionsType.LoadChannelGroupComplete;
	constructor(public payload: IMatrixChannelGroup[]) { }
}
export class HandledErrors implements Action {
	readonly type = MatrizActionsType.HandledErrors;
	constructor(public payload: string) {}
}

export type Actions =
	| Load
	| LoadComplete
	| LoadM
	| CreateMatriz
	| CreateMatrizCompleted
	| LoadCompleteM
	| LoadMatriz
	| LoadMatrizComplete
	| LoadMatrizUpdates
	| LoadMatrizUpdatesComplete
	| LoadUpdatesMatriz
	| LoadUpdatesMatrizComplete
	| DeleteMatriz
	| DeleteMatrizCompleted
	| LoadZones
	| LoadZonesCompleted
	| LoadDepartments
	| LoadDepartmentsComplete
	| LoadParameters
	| LoadParametersComplete
	| LoadGetPremiun
	| LoadGetPremiunComplete
	| LoadActividades
	| LoadActividadesCompleted
	| LoadEffectDate
	| LoadEffectDateCompleted
	| LoadChannelGroup
	| LoadChannelGroupComplete
	|	HandledErrors;


