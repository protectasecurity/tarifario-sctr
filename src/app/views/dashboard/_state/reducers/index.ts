import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDashboardReducer from './dashboard.reducer';

export interface DashboardState {
	fees: fromDashboardReducer.State;
}
export const reducers: ActionReducerMap<DashboardState> = {
	fees: fromDashboardReducer.DasboardReducer
};

export const getDashboardModuleState = createFeatureSelector<DashboardState>('dashboard');

export const getDashboardState = createSelector(
	getDashboardModuleState,
	state => state.fees
);

// Selectores
export const getItems = createSelector(
	getDashboardState,
	fromDashboardReducer.getFees
);
export const getMatrices = createSelector(
	getDashboardState,
	fromDashboardReducer.getMatrices
);
