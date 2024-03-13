import { Class } from "../../../../shared/models/class.model";
import { Use } from "../../../../shared/models/use.model";
import * as riskActions from "../actions/uses.clases.actions";

export interface UseClass {
	id: string;
	use: Use;
	clazz: Class;
	status: boolean;
}
export interface State {
	uses: Use[];
	classes: Class[];
	useClasses: UseClass [];
}

const initialState: State = {
	uses: [],
	classes: [],
	useClasses: []
};
export function UsesClasesReducer(state = initialState, action: riskActions.Actions): State {
	switch (action.type) {


		case riskActions.UsesClassActionTypes.LoadClasses: {
			return state;
		}
		case riskActions.UsesClassActionTypes.LoadClassesComplete: {
			return {
				...state,
				classes: action.payload
			};
		}
		case riskActions.UsesClassActionTypes.LoadUses: {
			return state;
		}
		case riskActions.UsesClassActionTypes.LoadUsesComplete: {
			return {
				...state,
				uses: action.payload
			};
		}
		case riskActions.UsesClassActionTypes.CreateUseClasses: {
			return state;
		}
		case riskActions.UsesClassActionTypes.CreateUseClassesComplete: {
			return state;
		}
		case riskActions.UsesClassActionTypes.UpdateUseClassState ||
		riskActions.UsesClassActionTypes.UpdateUseClassStateComplete: {
			return state;
		}
		case riskActions.UsesClassActionTypes.DeleteUseClass: {
			return state;
		}
		case riskActions.UsesClassActionTypes.DeleteUseClassComplete: {
			return state;
		}
		case riskActions.UsesClassActionTypes.LoadUseClasses: {
			return {
				...state,
				useClasses: []
			};
		}
		case riskActions.UsesClassActionTypes.LoadUseClassesComplete: {
			return {...state,
				useClasses: action.payload
			};
		}
		default: {
			return state;
		}
	}
}
export const getUses = (state: State) => state.uses;
export const getClasses = (state: State) => state.classes;
export const getUseClasses = (state: State) => state.useClasses;

