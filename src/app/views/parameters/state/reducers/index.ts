import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as paramReducer from '../reducers/parameter.reducer';


export interface ParamState {
	parameters: paramReducer.ParameterReducer;
}

export const reducers: ActionReducerMap<ParamState> = {
	parameters: paramReducer.ParamReducer
};

export const getParamsModuleState = createFeatureSelector<ParamState>('parametros');
export const getParamsState = createSelector(
	getParamsModuleState,
	state => state.parameters
);

export const getParameters = createSelector(
	getParamsState,
	paramReducer.getParameters
);
