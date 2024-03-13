import { Action } from '@ngrx/store';
import { MatrizRiesgo } from "../../../matriz/models/matriz.model";
import { Fee } from './../../../fee/models/fee.model';

export enum DashboardActionTypes {
	LoadFee = '[Dashboard] Load Fee',
	LoadFeeComplete = '[Dashboard] Load Fee Complete',
	LoadMatriz = '[Dashboard] Load Matriz',
	LoadMatrizComplete = '[Dashboard] Load Matriz Complete',
	HandledErrors = '[Dashboard] Handled Error'
}

// Obtener Listado de tarifas
export class LoadFee implements Action {
	readonly type = DashboardActionTypes.LoadFee;
	constructor() {}
}
export class LoadFeeComplete implements Action {
	readonly type = DashboardActionTypes.LoadFeeComplete;
	constructor(public payload: Fee[]) {}
}

export class LoadMatriz implements Action {
	readonly type = DashboardActionTypes.LoadMatriz;
	constructor() {}
}
export class LoadMatrizComplete implements Action {
	readonly type = DashboardActionTypes.LoadMatrizComplete;
	constructor(public payload: MatrizRiesgo[]) {}
}

export class HandledErrors implements Action {
	readonly type = DashboardActionTypes.HandledErrors;
	constructor(public payload: string) {}
}

export type Actions = LoadFee | LoadFeeComplete | LoadMatriz | LoadMatrizComplete | HandledErrors;
