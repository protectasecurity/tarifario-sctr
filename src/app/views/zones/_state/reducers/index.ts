import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromZoneReducer from './zones.reducer';

import * as fromZones from './zones.reducer';

export interface ZonesState {
	zones: fromZoneReducer.State;
}
export const reducers: ActionReducerMap<ZonesState> = {
	zones: fromZoneReducer.ZoneReducer
};

export const getZonesModuleState = createFeatureSelector<ZonesState>('zones');

export const getZonesState = createSelector(
	getZonesModuleState,
	state => state.zones
);

export const getItems = createSelector(
	getZonesState,
	fromZones.getItems
);

export const getIsLoadingItems = createSelector(
	getZonesState,
	fromZones.getIsLoadingItems
);

export const getLocations = createSelector(
	getZonesState,
	fromZones.getLocations
);

export const getZoneById = createSelector(
	getZonesState,
	fromZones.getZoneById
);
