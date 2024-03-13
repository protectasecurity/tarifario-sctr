import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChannelReducer from '../reducers/channel.reducer';

export interface ChannelState {
	channel: fromChannelReducer.State;
}
export const reducers: ActionReducerMap<ChannelState> = {
	channel: fromChannelReducer.ChannelReducer
};

export const getChannelModuleState = createFeatureSelector<ChannelState>('channel');
export const getChannelState = createSelector(
	getChannelModuleState,
	state => state.channel
);

export const getUses = createSelector(
	getChannelState,
	fromChannelReducer.getUses
);
export const getClasses = createSelector(
	getChannelState,
	fromChannelReducer.getClasses
);
export const getChannels = createSelector(
	getChannelState,
	fromChannelReducer.getChannels
);
export const getBrokers = createSelector(
	getChannelState,
	fromChannelReducer.getBrokers
);
export const getMiddlemen = createSelector(
	getChannelState,
	fromChannelReducer.getMiddlemen
);
export const getBrokerSearchText = createSelector(
	getChannelState,
	fromChannelReducer.getBrokerSearchText
);
export const getMiddlemanSearchText = createSelector(
	getChannelState,
	fromChannelReducer.getMiddlemanSearchText
);
export const getChannelGroup = createSelector(
	getChannelState,
	fromChannelReducer.getChannelGroup
);
export const getCustomers = createSelector(
	getChannelState,
	fromChannelReducer.getCustomers
);
export const getSalesPoint = createSelector(
	getChannelState,
	fromChannelReducer.getSalesPoint
);
export const brokerItemsVisible = createSelector(
	getBrokers,
	getBrokerSearchText,
	(items, searchTerm) => {
		return (items = items.filter(item => item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || !searchTerm));
	}
);
export const middlemanItemsVisible = createSelector(
	getMiddlemen,
	getMiddlemanSearchText,
	(items, searchTerm) => {
		return (items = items.filter(item => item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || !searchTerm));
	}
);
export const getFeeCollection = createSelector(
	getChannelState,
	fromChannelReducer.getFeeCollection
);
