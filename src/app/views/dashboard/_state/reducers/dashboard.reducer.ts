import { MatrizRiesgo } from "../../../matriz/models/matriz.model";
import * as dashboardActions from '../actions/dashboard.actions';
import { Fee } from './../../../fee/models/fee.model';

export interface State {
	items: Fee[];
	matriz: MatrizRiesgo[];
}

const initialState: State = {
	items: [],
	matriz: []
};

export function DasboardReducer(state = initialState, action: dashboardActions.Actions): State {
	switch (action.type) {
		case dashboardActions.DashboardActionTypes.LoadFee: {
			return {
				...state
			};
		}
		case dashboardActions.DashboardActionTypes.LoadMatriz: {
			return {
				...state
			};
		}
		case dashboardActions.DashboardActionTypes.LoadFeeComplete: {
			return {
				...state,
				items: action.payload
			};
		}
		case dashboardActions.DashboardActionTypes.LoadMatrizComplete: {
			return {
				...state,
				matriz: action.payload
			};
		}
		default: {
			return state;
		}
	}
}

export const getFees = (state: State) => state.items;
export const getMatrices = (state: State) => state.matriz;
