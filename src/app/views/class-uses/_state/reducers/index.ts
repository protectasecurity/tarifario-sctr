import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRiskReducer from "../reducers/uses.clases.reducer";

export interface UsesClasesState {
	risk: fromRiskReducer.State;
}
export const reducers: ActionReducerMap<UsesClasesState> = {
	risk: fromRiskReducer.UsesClasesReducer
};
export const getRiskModuleState = createFeatureSelector<UsesClasesState>('class-uses');
export const getRiskState = createSelector(
	getRiskModuleState,
	state => state.risk
);

export const getUses = createSelector(
	getRiskState,
	fromRiskReducer.getUses
);

export const getClasses = createSelector(
	getRiskState,
	fromRiskReducer.getClasses
);

export const getUseClasses = createSelector(
	getRiskState,
	fromRiskReducer.getUseClasses
	);


