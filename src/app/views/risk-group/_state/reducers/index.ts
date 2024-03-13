import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRiskReducer from '../reducers/risk.reducer';
export interface RiskState {
	risk: fromRiskReducer.State;
}
export const reducers: ActionReducerMap<RiskState> = {
	risk: fromRiskReducer.RiskReducer
};
export const getRiskModuleState = createFeatureSelector<RiskState>('risk');
export const getRiskState = createSelector(
	getRiskModuleState,
	state => state.risk
);
export const getItems = createSelector(
	getRiskState,
	fromRiskReducer.getItems
);

export const getUseSelected = createSelector(
	getRiskState,
	fromRiskReducer.getUseSelected
);

export const getUses = createSelector(
	getRiskState,
	fromRiskReducer.getUses
);

export const getClassesByUse = createSelector(
	getRiskState,
	fromRiskReducer.getClasses
);
export const getPersonTypes = createSelector(
	getRiskState,
	fromRiskReducer.getPersonTypes
);
export const getBrandsByClass = createSelector(
	getRiskState,
	fromRiskReducer.getBrandsByClass
);
export const getModelsByBrandsByClass = createSelector(
	getRiskState,
	fromRiskReducer.getModelsByBrandsByClass
);

export const getIsCreatingRiskGroup = createSelector(
	getRiskState,
	fromRiskReducer.getIsCreatingRiskGroup
);
export const getRiskGroupItem = createSelector(
	getRiskState,
	fromRiskReducer.getRiskGroupItem
);
export const getFees = createSelector(
	getRiskState,
	fromRiskReducer.getFees
);
