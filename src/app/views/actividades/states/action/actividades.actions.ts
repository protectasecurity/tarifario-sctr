import { Parameter } from './../../../parameters/models/parameter.model';
import { Action } from "@ngrx/store";
import { Actividades } from "../../models/Actividades";


export enum ActividadesActionTypes {
	LoadActividades = '[Actividades] Load Actividades',
	LoadActividadesComplete = '[Actividades] Load Actividades Complete',
	LoadParameter = '[Actividades] Load Parameter',
	LoadParameterComplete = '[Actividades] Load Parameter Complete',
	AddActividades = '[Actividades] Add Actividades',
	AddActividadesComplete = '[Actividades] Add Actividades Complete',
	DeleteActividades = '[Actividades] Delete Actividades',
	DeleteActividadesComplete = '[Actividades] Delete Actividades Complete',
	UpdateActividades = '[Actividades] Update Actividades ',
	UpdateActividadesComplete = '[Actividades] Update Actividades Complete',
	HandledErrors = '[Actividades] Handled Error'
}

export class LoadActividades implements Action {
	readonly type = ActividadesActionTypes.LoadActividades;
	constructor() { }
}
export class LoadActividadesComplete implements Action {
	readonly type = ActividadesActionTypes.LoadActividadesComplete;
	constructor(public payload: Actividades[]) { }
}
export class AddActividadesComplete implements Action {
	readonly type = ActividadesActionTypes.AddActividadesComplete;
	constructor() { }
}
export class AddActividades implements Action {
	readonly type = ActividadesActionTypes.AddActividades;
	constructor(public payload: Actividades[]) { }
}
export class DeleteActividadesComplete implements Action {
	readonly type = ActividadesActionTypes.DeleteActividadesComplete;
	constructor() { }
}
export class DeleteActividades implements Action {
	readonly type = ActividadesActionTypes.DeleteActividades;
	constructor(public payload: string) { }
}
export class UpdateActividadesComplete implements Action {
	readonly type = ActividadesActionTypes.UpdateActividadesComplete;
	constructor() { }
}
export class UpdateActividades implements Action {
	readonly type = ActividadesActionTypes.UpdateActividades;
	constructor(public payload: Actividades) { }
}

export class HandledErrors implements Action {
	readonly type = ActividadesActionTypes.HandledErrors;
	constructor(public payload: string) { }
}

export class LoadParameter implements Action {
	readonly type = ActividadesActionTypes.LoadParameter;
	constructor() { }
}
export class LoadParameterComplete implements Action {
	readonly type = ActividadesActionTypes.LoadParameterComplete;
	constructor(public payload: Parameter[]) { }
}

export type Actions =
	| LoadActividades
	| LoadActividadesComplete
	| AddActividades
	| AddActividadesComplete
	| DeleteActividades
	| DeleteActividadesComplete
	| UpdateActividades
	| UpdateActividadesComplete | LoadParameter | LoadParameterComplete;
