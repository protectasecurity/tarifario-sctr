import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { getFeeState } from "../../../fee/_state/reducers";
import * as fromFee from "../../../fee/_state/reducers/fee.reducer";
import * as fromMatrizReducer from "./matriz.reducer";

export interface MatrizState {
	matriz: fromMatrizReducer.State;
}

export const reducers: ActionReducerMap<MatrizState> = {
	matriz: fromMatrizReducer.MatrizReducer
};

export const getMatrizModuleState = createFeatureSelector<MatrizState>("matriz");

export const getMatrizState = createSelector(
	getMatrizModuleState,
	state => state.matriz
);

export const getItem = createSelector(
	getMatrizState,
	fromMatrizReducer.getItem
);
export const getItems = createSelector(
	getMatrizState,
	fromMatrizReducer.getItems
);
export const updateMatriz = createSelector(
	getMatrizState,
	fromMatrizReducer.updateMatriz
);
export const updatesMatriz = createSelector(
	getMatrizState,
	fromMatrizReducer.updatesMatriz
);
export const getZones = createSelector(
	getMatrizState,
	fromMatrizReducer.getZones
);
export const getActividades = createSelector(
	getMatrizState,
	fromMatrizReducer.getActividades
);
export const getParameter = createSelector(
	getMatrizState,
	fromMatrizReducer.getParameter
);
export const getDepartments = createSelector(
	getMatrizState,
	fromMatrizReducer.getDepartments
);
export const getChannelGroup = createSelector(
	getMatrizState,
	fromMatrizReducer.getChannelGroup
);
export const getEffectDate = createSelector(
	getMatrizState,
	fromMatrizReducer.getEffectDate
);
export const getPremiun = createSelector(
	getMatrizState,
	fromMatrizReducer.getPremiun
);

