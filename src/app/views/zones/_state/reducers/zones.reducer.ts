import { Ubigeo } from '../../models/ubigeo.model';
import { Zone } from '../../models/zone.model';
import * as ZonesActions from '../actions/zones.actions';

export interface State {
	items: Zone[];
	locations: Ubigeo[];
	isLoadingItems: boolean;
	Zone: Zone;
}

const initialState: State = {
	items: [],
	locations: [],
	isLoadingItems: false,
	Zone: null
};

export function ZoneReducer(state = initialState, action: ZonesActions.Actions): State {
	switch (action.type) {
		case ZonesActions.ZonesActionTypes.Load: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case ZonesActions.ZonesActionTypes.LoadComplete: {
			return {
				...state,
				isLoadingItems: false,
				items: action.payload
			};
		}
		case ZonesActions.ZonesActionTypes.LoadLocations: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case ZonesActions.ZonesActionTypes.LoadLocationsComplete: {
			return {
				...state,
				isLoadingItems: false,
				locations: action.payload
			};
		}
		case ZonesActions.ZonesActionTypes.CreateZoneMasiveInit: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case ZonesActions.ZonesActionTypes.CreateZoneMasiveComplete: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case ZonesActions.ZonesActionTypes.ReorderZoneInit: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case ZonesActions.ZonesActionTypes.ReorderZoneComplete: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case ZonesActions.ZonesActionTypes.HandleErrors: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case ZonesActions.ZonesActionTypes.GetZoneById: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case ZonesActions.ZonesActionTypes.GetZoneByIdComplete: {
			return {
				...state,
				isLoadingItems: false,
				Zone: action.payload
			};
		}
		case ZonesActions.ZonesActionTypes.SetDefaultZone: {
			return {
				...state,
				isLoadingItems: false,
				Zone: null
			};
		}
		default: {
			return state;
		}
	}
}

export const getItems = (state: State) => state.items;
export const getLocations = (state: State) => state.locations;
export const getZoneById = (state: State) => state.Zone;
export const getIsLoadingItems = (state: State) => state.isLoadingItems;
