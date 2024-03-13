import { Action } from "@ngrx/store";
import { Parameter } from "../../models/parameter.model";

export enum ParameterActionTypes {
	LoadParameters = '[Parameter] Load Parameters',
	LoadParametersComplete = '[Parameter] Load Parameters Complete',
	AddParameter = '[Parameter] Add Parameter',
	AddParameterComplete = '[Parameter] Add Parameter Complete',
	DeleteParameter = '[Parameter] Delete Parameter',
	DeleteParameterComplete = '[Parameter] Delete Parameter Complete',
	UpdateParameter = '[Parameter] Update Parameter ',
	UpdateParameterComplete = '[Parameter] Update Parameter Complete',
	HandledErrors = '[Parameter] Handled Error'
}

export class LoadParameters implements Action {
	readonly type = ParameterActionTypes.LoadParameters;
	constructor() { }
}
export class LoadParametersComplete implements Action {
	readonly type = ParameterActionTypes.LoadParametersComplete;
	constructor(public payload: Parameter[]) { }
}
export class AddParameterComplete implements Action {
	readonly type = ParameterActionTypes.AddParameterComplete;
	constructor() { }
}
export class AddParameter implements Action {
	readonly type = ParameterActionTypes.AddParameter;
	constructor(public payload: Parameter[]) { }
}
export class DeleteParameterComplete implements Action {
	readonly type = ParameterActionTypes.DeleteParameterComplete;
	constructor() { }
}
export class DeleteParameter implements Action {
	readonly type = ParameterActionTypes.DeleteParameter;
	constructor(public payload: string) { }
}
export class UpdateParameterComplete implements Action {
	readonly type = ParameterActionTypes.UpdateParameterComplete;
	constructor() { }
}
export class UpdateParameter implements Action {
	readonly type = ParameterActionTypes.UpdateParameter;
	constructor(public payload: Parameter) { }
}

export class HandledErrors implements Action {
	readonly type = ParameterActionTypes.HandledErrors;
	constructor(public payload: string) { }
}

export type Actions =
	| LoadParameters
	| LoadParametersComplete
	| AddParameter
	| AddParameterComplete
	| DeleteParameter
	| DeleteParameterComplete
	| UpdateParameter
	| UpdateParameterComplete;
