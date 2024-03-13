import { Model } from 'app/shared/models/model.model';
import { Class } from '../../../../shared/models/class.model';
import { IPersonType } from '../../../../shared/models/person-type.model';
import { RiskGroup } from '../../../../shared/models/risk-group.model';
import { Use } from '../../../../shared/models/use.model';
import { UseClass } from "../../../../shared/models/use-class.model";
import * as riskActions from '../actions/risk.actions';
import { Brand } from './../../../../shared/models/brand.model';
import { Fee } from './../../../fee/models/fee.model';

export interface State {
	items: RiskGroup[];
	useSelected: string;
	uses: Use[];
	brands: Brand[];
	models: Model[];
	isReorderingRiskGroup: boolean;
	classes: UseClass[];
	personTypes: IPersonType[];
	isCreatingRiskGroup: boolean;
	riskGroupItem: RiskGroup;
	fees: Fee[];
}

const initialState: State = {
	items: [],
	useSelected: null,
	uses: [],
	brands: [],
	models: [],
	isReorderingRiskGroup: false,
	classes: [],
	personTypes: [],
	isCreatingRiskGroup: false,
	riskGroupItem: new RiskGroup(),
	fees: []
};
export function RiskReducer(state = initialState, action: riskActions.Actions): State {
	switch (action.type) {
		case riskActions.RiskActionTypes.GetRiskGroup: {
			return state;
		}
		case riskActions.RiskActionTypes.GetRiskGroupCompleted: {
			return {
				...state,
				riskGroupItem: action.payload
			};
		}
		case riskActions.RiskActionTypes.LoadFees: {
			return {
				...state
			};
		}
		case riskActions.RiskActionTypes.LoadFeesComplete: {
			return {
				...state,
				fees: action.payload
			};
		}
		case riskActions.RiskActionTypes.SetDefaultRiskGroup: {
			return {
				...state,
				riskGroupItem: null
			};
		}
		case riskActions.RiskActionTypes.Load: {
			return state;
		}
		case riskActions.RiskActionTypes.ShowAlert: {
			return state;
		}
		case riskActions.RiskActionTypes.ShowAlertCompleted: {
			return state;
		}
		/* case riskActions.RiskActionTypes.ReorderRiskGroup: {
			return {
				...state,
				isReorderingRiskGroup: true
			};
		} */
		case riskActions.RiskActionTypes.LoadPersonType: {
			return state;
		}
		case riskActions.RiskActionTypes.LoadPersonTypeComplete: {
			return {
				...state,
				personTypes: action.payload
			};
		}
		/*case riskActions.RiskActionTypes.LoadClasses: {
			return state;
		}
		case riskActions.RiskActionTypes.LoadClassesComplete: {
			return {
				...state,
				classes: action.payload
			};
		}*/
		case riskActions.RiskActionTypes.LoadClassesByUse: {
			return {
				...state,
				classes: []
			};
		}
		case riskActions.RiskActionTypes.LoadClassesByUseComplete: {
			return {
				...state,
				classes: action.payload
			};
		}
		/* case riskActions.RiskActionTypes.ReorderRiskGroupCompleted: {
			return {
				...state,
				isReorderingRiskGroup: false
			};
		} */
		case riskActions.RiskActionTypes.LoadComplete: {
			return {
				...state,
				items: action.payload.sort(function(a, b) {
					const nameA = a.vehicleUse.description.toLowerCase() + a.description.toLowerCase(),
						nameB = b.vehicleUse.description.toLowerCase() + b.description.toLowerCase();
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				})
			};
		}
		case riskActions.RiskActionTypes.UpdateUseSelected: {
			return {
				...state,
				useSelected: action.payload
			};
		}
		case riskActions.RiskActionTypes.LoadUses: {
			return state;
		}
		case riskActions.RiskActionTypes.LoadUsesComplete: {
			return {
				...state,
				uses: action.payload
			};
		}
		case riskActions.RiskActionTypes.LoadBrandsByClass: {
			return state;
		}
		case riskActions.RiskActionTypes.LoadBrandsByClassComplete: {
			return {
				...state,
				brands: action.payload
			};
		}
		case riskActions.RiskActionTypes.LoadModelByBrandsByClass: {
			return state;
		}
		case riskActions.RiskActionTypes.LoadModelByBrandsByClassComplete: {
			return {
				...state,
				models: action.payload
			};
		}
		case riskActions.RiskActionTypes.CreateRiskGroup: {
			return {
				...state,
				isCreatingRiskGroup: true
			};
		}
		case riskActions.RiskActionTypes.CreateRiskGroupCompleted: {
			return {
				...state,
				isCreatingRiskGroup: false
			};
		}
		default: {
			return state;
		}
	}
}
export const getIsCreatingRiskGroup = (state: State) => state.isCreatingRiskGroup;
export const getItems = (state: State) => state.items;
export const getUseSelected = (state: State) => state.useSelected;
export const getUses = (state: State) => state.uses;
export const getClasses = (state: State) => state.classes;
export const getPersonTypes = (state: State) => state.personTypes;
export const getBrandsByClass = (state: State) => state.brands;
export const getModelsByBrandsByClass = (state: State) => state.models;
export const getRiskGroupItem = (state: State) => state.riskGroupItem;
export const getFees = (state: State) => state.fees;
