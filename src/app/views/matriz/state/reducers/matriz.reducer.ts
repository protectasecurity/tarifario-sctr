import { Actividades } from "../../../actividades/models/Actividades";
import * as feeActions from "../../../fee/_state/actions/fee.actions";
import { Parameter } from "../../../parameters/models/parameter.model";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import { Zone } from "../../../zones/models/zone.model";
import { IMatrixChannelGroup, MatrizRiesgo } from "../../models/matriz.model";
import * as matrizActions from "../actions/matriz.actions";


export interface State {
	zones: Zone[];
	actividades: Actividades[];
	parametros: Parameter[];
	item: MatrizRiesgo;
	items: MatrizRiesgo[];
	departments: Ubigeo[];
	channelgroup: IMatrixChannelGroup[];
	itemUpdates: MatrizRiesgo[];
	updates: string[];
	effectDate: any;
	searchPremiun: any;
	isLoadingItems: boolean;
}

const initialState: State = {
	zones: [],
	actividades: [],
	parametros: [],
	item: null,
	departments: [],
	items: [],
	itemUpdates: [],
	channelgroup: [],
	updates: [],
	effectDate: "",
	searchPremiun: [],
	isLoadingItems: false
};


export function MatrizReducer(state = initialState, action: matrizActions.Actions): State {
	switch (action.type) {
		case matrizActions.MatrizActionsType.LoadM: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadCompleteM: {
			return {
				...state,
				isLoadingItems: false,
				items: action.payload,
				item: null,
				itemUpdates: []
			};
		}
		case matrizActions.MatrizActionsType.LoadMatriz: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadMatrizComplete: {
			return {
				...state,
				isLoadingItems: false,
				item: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadMatrizUpdates: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadMatrizUpdatesComplete: {
			return {
				...state,
				isLoadingItems: false,
				itemUpdates: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadGetPremiun: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadGetPremiunComplete: {
			return {
				...state,
				isLoadingItems: false,
				searchPremiun: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadUpdatesMatriz: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadUpdatesMatrizComplete: {
			return {
				...state,
				isLoadingItems: false,
				updates: action.payload.sort()
			};
		}
		case matrizActions.MatrizActionsType.DeleteMatriz: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.DeleteMatrizCompleted: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case matrizActions.MatrizActionsType.LoadZones: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadDepartments: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadDepartmentsComplete: {
			return {
				...state,
				isLoadingItems: false,
				departments: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadParameters: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadParametersComplete: {
			return {
				...state,
				isLoadingItems: false,
				parametros: action.payload
			};
		}
		case matrizActions.MatrizActionsType.CreateMatriz: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.CreateMatrizCompleted: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case matrizActions.MatrizActionsType.LoadZonesCompleted: {
			return {
				...state,
				isLoadingItems: false,
				zones: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadActividades: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadChannelGroup: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadChannelGroupComplete: {
			return {
				...state,
				isLoadingItems: false,
				channelgroup: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadActividadesCompleted: {
			return {
				...state,
				isLoadingItems: false,
				actividades: action.payload
			};
		}
		case matrizActions.MatrizActionsType.LoadEffectDate: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case matrizActions.MatrizActionsType.LoadEffectDateCompleted: {
			return {
				...state,
				isLoadingItems: false,
				effectDate: action.payload
			};
		}
		default: {
			return state;
		}
	}
}

export const getZones = (state: State) => state.zones;
export const getActividades = (state: State) => state.actividades;
export const getItem = (state: State) => state.item;
export const getParameter = (state: State) => state.parametros;
export const getDepartments = (state: State) => state.departments;
export const getItems = (state: State) => state.items;
export const updateMatriz = (state: State) => state.items;
export const updatesMatriz = (state: State) => state.updates;
export const getChannelGroup = (state: State) => state.channelgroup;
export const getEffectDate = (state: State) => state.effectDate;
export const getPremiun = (state: State) => state.searchPremiun;
