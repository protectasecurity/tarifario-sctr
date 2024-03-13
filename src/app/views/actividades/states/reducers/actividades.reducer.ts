import { ParameterReducer } from "../../../parameters/state/reducers/parameter.reducer";
import { Actividades } from "../../models/Actividades";
import * as actividadesActions from "../action/actividades.actions";
import { Parameter } from './../../../parameters/models/parameter.model';


export interface ActividadesReducer {
	actividad: Actividades[];
	param: Parameter[];
}

const inititalActividadesReducer: ActividadesReducer = {
	actividad: [],
	param: [],
};

export function ActividadReducer(init = inititalActividadesReducer, action: actividadesActions.Actions) {
	switch (action.type) {
		case actividadesActions.ActividadesActionTypes.LoadActividades: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.LoadParameter: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.LoadActividadesComplete: {
			return {
				...init,
				actividad: action.payload
			};
		}
		case actividadesActions.ActividadesActionTypes.LoadParameterComplete: {
			return {
				...init,
				param: action.payload
			};
		}
		case actividadesActions.ActividadesActionTypes.UpdateActividades: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.UpdateActividadesComplete: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.AddActividades: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.AddActividadesComplete: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.DeleteActividades: {
			return init;
		}
		case actividadesActions.ActividadesActionTypes.DeleteActividadesComplete: {
			return init;
		}
		default: {
			return init;
		}
	}
}
export const getActividades = (params: ActividadesReducer) => params.actividad;
export const getParameter = (params: ActividadesReducer) => params.param;
