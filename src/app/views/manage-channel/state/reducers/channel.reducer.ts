import { sortArray } from 'app/shared/helpers/utils';
import { Agent } from '../../models/Agent';
import { Channel } from '../../models/Channels';
import { Customer } from '../../models/Customer';
import { ManageChannelGroup } from '../../models/ManageChannelGroup';
import * as channelActions from '../actions/channel.actions';
import { Fee } from './../../../fee/models/fee.model';
import { LoadFeeCollectionComplete } from './../actions/channel.actions';
import { Class } from '../../../../shared/models/class.model';
import { Use } from '../../../../shared/models/use.model';

export interface State {
	classes: Class[];
	uses: Use[];
	channels: Channel[];
	brokers: Agent[];
	middlemen: Agent[];
	brokerSearchText: string;
	middlemanSearchText: string;
	channelGroup: ManageChannelGroup;
	customers: Customer[];
	salespoint: Customer[];
	feeCollection: Fee[];
}
const initialState: State = {
	classes: [],
	uses: [],
	channels: [],
	brokers: [],
	middlemen: [],
	brokerSearchText: '',
	middlemanSearchText: '',
	channelGroup: new ManageChannelGroup(),
	customers: [],
	salespoint: [],
	feeCollection: []
};
export function ChannelReducer(state = initialState, action: channelActions.Actions): State {
	switch (action.type) {
		case channelActions.ChannelActionTypes.LoadClasses: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadClassesComplete: {
			return {
				...state,
				classes: action.payload
			};
		}
		case channelActions.ChannelActionTypes.LoadUses: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadUsesComplete: {
			return {
				...state,
				uses: action.payload
			};
		}
		case channelActions.ChannelActionTypes.LoadChannels: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadChannelsComplete: {
			return {
				...state,
				channels: action.payload
			};
		}
		case channelActions.ChannelActionTypes.UpdateChannelGroup: {
			return state;
		}
		case channelActions.ChannelActionTypes.UpdateChannelGroupComplete: {
			return state;
		}
		case channelActions.ChannelActionTypes.GetChannelGroup: {
			return state;
		}
		case channelActions.ChannelActionTypes.GetChannelGroupComplete: {
			return {
				...state,
				channelGroup: action.payload
			};
		}
		case channelActions.ChannelActionTypes.GetCustomerByName: {
			return state;
		}
		case channelActions.ChannelActionTypes.GetCustomerByNameComplete: {
			const customers = sortArray(action.payload, 'description', 1);
			return {
				...state,
				customers: customers
			};
		}
		case channelActions.ChannelActionTypes.SetDefaultChannelGroup: {
			return {
				...state,
				channelGroup: new ManageChannelGroup()
			};
		}
		case channelActions.ChannelActionTypes.SetCustomerByDefault: {
			return {
				...state,
				customers: []
			};
		}
		case channelActions.ChannelActionTypes.AddChannelGroup: {
			return state;
		}
		case channelActions.ChannelActionTypes.AddChannelGroupComplete: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadBrokers: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadBrokersComplete: {
			const brokers = sortArray(action.payload, 'description', 1);
			return {
				...state,
				brokers: brokers
			};
		}
		case channelActions.ChannelActionTypes.LoadMiddlemen: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadMiddlemenComplete: {
			const middlemen = sortArray(action.payload, 'description', 1);
			return {
				...state,
				middlemen: middlemen
			};
		}
		case channelActions.ChannelActionTypes.LoadSalesPoint: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadSalesPointComplete: {
			const salespoint = sortArray(action.payload, 'description', 1);
			return {
				...state,
				salespoint: salespoint
			};
		}
		case channelActions.ChannelActionTypes.UpdateBrokerSearchText: {
			return {
				...state,
				brokerSearchText: action.payload
			};
		}
		case channelActions.ChannelActionTypes.UpdateMiddlemenSearchText: {
			return {
				...state,
				middlemanSearchText: action.payload
			};
		}
		case channelActions.ChannelActionTypes.DeleteChannelGroup: {
			return state;
		}
		case channelActions.ChannelActionTypes.DeleteChannelGroupComplete: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadFeeCollection: {
			return state;
		}
		case channelActions.ChannelActionTypes.LoadFeeCollectionComplete: {
			return {
				...state,
				feeCollection: action.payload
			};
		}
		default: {
			return state;
		}
	}
}
export const getClasses = (state: State) => state.classes;
export const getUses = (state: State) => state.uses;
export const getChannels = (state: State) => state.channels;
export const getBrokers = (state: State) => state.brokers;
export const getMiddlemen = (state: State) => state.middlemen;
export const getSalesPoint = (state: State) => state.salespoint;
export const getBrokerSearchText = (state: State) => state.brokerSearchText;
export const getMiddlemanSearchText = (state: State) => state.middlemanSearchText;
export const getChannelGroup = (state: State) => state.channelGroup;
export const getCustomers = (state: State) => state.customers;
export const getFeeCollection = (state: State) => state.feeCollection;
