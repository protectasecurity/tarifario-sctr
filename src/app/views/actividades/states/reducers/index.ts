import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import * as actividadReducer from '../reducers/actividades.reducer';


export interface ActividadesState {
	actividad: actividadReducer.ActividadesReducer;
}

export const reducers: ActionReducerMap<ActividadesState> = {
	actividad: actividadReducer.ActividadReducer
};


export const getActividadesModuleState = createFeatureSelector<ActividadesState>('actividades');
export const getActividadesState = createSelector(
	getActividadesModuleState,
	state => state.actividad
);

export const getActividad = createSelector(
	getActividadesState,
	actividadReducer.getActividades
);
export const getParameter = createSelector(
	getActividadesState,
	actividadReducer.getParameter
);
