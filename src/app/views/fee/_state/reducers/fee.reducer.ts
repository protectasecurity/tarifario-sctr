import { Zone } from "app/views/zones/models/zone.model";
import { Brand } from "../../../../shared/models/brand.model";
import { Model } from "../../../../shared/models/model.model";
import { IPersonType } from "../../../../shared/models/person-type.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Ubigeo } from "../../../zones/models/ubigeo.model";
import { Fee, IFeeSearch } from "../../models/fee.model";
import * as feeActions from "../actions/fee.actions";
import { RiskGroup } from "./../../../../shared/models/risk-group.model";
import { Use } from "./../../../../shared/models/use.model";
import { IPlateSearch } from "./../../models/fee.model";
import { IMatrixChannelGroup } from "./../../models/tariffmatrix.model";

export interface State {
	items: Fee[];
	item: Fee;
	itemUpdates: string[];
	uses: Use[];
	riskgroups: RiskGroup[];
	zones: Zone[];
	isLoadingItems: boolean;
	channelgroup: IMatrixChannelGroup[];
	departments: Ubigeo[];
	personTypes: IPersonType[];
	classes: UseClass[];
	brands: Brand[];
	models: Model[];
	feeSearch: IFeeSearch[];
	plate: IPlateSearch;
}

const initialState: State = {
	items: [],
	item: null,
	itemUpdates: [],
	uses: [],
	riskgroups: [],
	zones: [],
	isLoadingItems: false,
	channelgroup: [],
	departments: [],
	personTypes: [],
	classes: [],
	brands: [],
	models: [],
	feeSearch: [],
	plate: null,
};

export function FeeReducer(state = initialState, action: feeActions.Actions): State {
	switch (action.type) {
		case feeActions.FeeActionTypes.Load: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadComplete: {
			return {
				...state,
				isLoadingItems: false,
				items: action.payload,
				item: null,
				itemUpdates: []
			};
		}
		case feeActions.FeeActionTypes.LoadFee: {
			return {
				...state,
				isLoadingItems: true,
			};
		}
		case feeActions.FeeActionTypes.LoadFeeComplete: {
			return {
				...state,
				isLoadingItems: false,
				item: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadFeeUpdates: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadFeeUpdatesComplete: {
			return {
				...state,
				isLoadingItems: false,
				itemUpdates: action.payload.sort()
			};
		}
		case feeActions.FeeActionTypes.LoadUses: {
			return {
				...state,
				feeSearch: [],
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadUsesComplete: {
			return {
				...state,
				classes: [],
				isLoadingItems: false,
				uses: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadRiskgroups: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadRiskgroupsComplete: {
			return {
				...state,
				isLoadingItems: false,
				riskgroups: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadZones: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadZonesCompleted: {
			return {
				...state,
				isLoadingItems: false,
				zones: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadChannelGroup: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadChannelGroupComplete: {
			return {
				...state,
				isLoadingItems: false,
				channelgroup: action.payload
			};
		}
		case feeActions.FeeActionTypes.CreateFee: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.CreateFeeCompleted: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case feeActions.FeeActionTypes.DeleteFee: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.DeleteFeeCompleted: {
			return {
				...state,
				isLoadingItems: false
			};
		}
		case feeActions.FeeActionTypes.LoadChannelGroup: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadChannelGroupComplete: {
			return {
				...state,
				isLoadingItems: false,
				channelgroup: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadDepartments: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadDepartmentsComplete: {
			return {
				...state,
				isLoadingItems: false,
				departments: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadPersonTypes: {
			return {
				...state,
				isLoadingItems: true
			};
		}
		case feeActions.FeeActionTypes.LoadPersonTypesComplete: {
			return {
				...state,
				isLoadingItems: false,
				personTypes: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadClassesByUse: {
			return {
				...state,
			classes: []
			};
		}
		case feeActions.FeeActionTypes.LoadClassesByUseComplete: {
			return {
				...state,
				classes: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadBrandsByClass: {
			return {
				...state,
				brands: [],
				models: []
			};
		}
		case feeActions.FeeActionTypes.LoadBrandsByClassComplete: {
			return {
				...state,
				brands: action.payload,
				models: []
			};
		}
		case feeActions.FeeActionTypes.LoadModelByBrandsByClass: {
			return state;
		}
		case feeActions.FeeActionTypes.LoadModelByBrandsByClassComplete: {
			return {
				...state,
				models: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadFeeSearch: {
			return { ...state };
		}
		case feeActions.FeeActionTypes.LoadFeeSearchComplete: {
			return {
				...state,
				feeSearch: action.payload
			};
		}
		case feeActions.FeeActionTypes.LoadPlateSearch: {
			return { ...state };
		}
		case feeActions.FeeActionTypes.LoadPlateSearchComplete: {
			return {
				...state,
				plate: action.payload
			};
		}
		default: {
			return state;
		}
	}
}

export const getItem = (state: State) => state.item;
export const getItemUpdate = (state: State) => state.itemUpdates;
export const getItems = (state: State) => state.items;
export const getIsLoadingItems = (state: State) => state.isLoadingItems;
export const getUses = (state: State) => state.uses;
export const getRiskGroups = (state: State) => state.riskgroups;
export const getZones = (state: State) => state.zones;
export const getChannelGroup = (state: State) => state.channelgroup;
export const getDepartments = (state: State) => state.departments;
export const getPersonTypes = (state: State) => state.personTypes;
export const getClassesByUse = (state: State) => state.classes;
export const getBrandsByClass = (state: State) => state.brands;
export const getModelsByBrandsByClass = (state: State) => state.models;
export const getFeeSearch = (state: State) => state.feeSearch;
export const getPlateSearch = (state: State) => state.plate;
