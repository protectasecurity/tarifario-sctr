import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromFeeReducer from "./fee.reducer";
import * as fromFee from "./fee.reducer";

export interface FeeState {
	fees: fromFeeReducer.State;
}

export const reducers: ActionReducerMap<FeeState> = {
	fees: fromFeeReducer.FeeReducer
};

export const getFeeModuleState = createFeatureSelector<FeeState>('fee');

export const getFeeState = createSelector(
	getFeeModuleState,
	state => state.fees
);

// Selectores
export const getItems = createSelector(
	getFeeState,
	fromFee.getItems
);

export const getIsLoadingItems = createSelector(
	getFeeState,
	fromFee.getIsLoadingItems
);

export const getItem = createSelector(
	getFeeState,
	fromFee.getItem
);

export const getItemUpdate = createSelector(
	getFeeState,
	fromFee.getItemUpdate
);

export const getUses = createSelector(
	getFeeState,
	fromFee.getUses
);
export const getRiskGroups = createSelector(
	getFeeState,
	fromFee.getRiskGroups
);
export const getZones = createSelector(
	getFeeState,
	fromFee.getZones
);
export const getChannelGroup = createSelector(
	getFeeState,
	fromFee.getChannelGroup
);
export const getDepartments = createSelector(
	getFeeState,
	fromFee.getDepartments
);
export const getPersonTypes = createSelector(
	getFeeState,
	fromFee.getPersonTypes
);
export const getClassesByUse = createSelector(
	getFeeState,
	fromFee.getClassesByUse
);
export const getBrandsByClass = createSelector(
	getFeeState,
	fromFee.getBrandsByClass
);
export const getModelsByBrandsByClass = createSelector(
	getFeeState,
	fromFee.getModelsByBrandsByClass
);
export const getFeeSearch = createSelector(
	getFeeState,
	fromFee.getFeeSearch
);
export const getPlateSearch = createSelector(
	getFeeState,
	fromFee.getPlateSearch
);
