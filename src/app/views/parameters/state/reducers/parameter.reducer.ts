import { sortArray } from 'app/shared/helpers/utils';
import { Parameter } from "../../models/parameter.model";
import * as paramActions from '../actions/parameter.actions';

export interface ParameterReducer {
	param: Parameter[];
}

const initialParameterReducer: ParameterReducer = {
	param: [],
};

export function ParamReducer(init = initialParameterReducer, action: paramActions.Actions): ParameterReducer {
	switch (action.type) {
		case paramActions.ParameterActionTypes.LoadParameters: {
			return init;
		}
		case paramActions.ParameterActionTypes.LoadParametersComplete: {
			return {
				...init,
				param: action.payload
			};
		}
		case paramActions.ParameterActionTypes.UpdateParameter: {
			return init;
		}
		case paramActions.ParameterActionTypes.UpdateParameterComplete: {
			return init;
		}
		case paramActions.ParameterActionTypes.AddParameter: {
			return init;
		}
		case paramActions.ParameterActionTypes.AddParameterComplete: {
			return init;
		}
		case paramActions.ParameterActionTypes.DeleteParameter: {
			return init;
		}
		case paramActions.ParameterActionTypes.DeleteParameterComplete: {
			return init;
		}
		default: {
			return init;
		}
	}
}

export const getParameters = (params: ParameterReducer) => params.param;

