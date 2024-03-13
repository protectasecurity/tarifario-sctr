import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromModuleReducer from './channel.restriction.reducers';


export interface ChannelRestrictionState {
	channelRestriction: fromModuleReducer.State;
}

export const reducers: ActionReducerMap<ChannelRestrictionState> = {
	channelRestriction: fromModuleReducer.reducerChannelRestriction
};

export const getChannelRestrictionModuleState = createFeatureSelector<ChannelRestrictionState>('channel-restriction');
export const getChannelRestrictionState = createSelector(
	getChannelRestrictionModuleState,
	state => state.channelRestriction
);

export const getChannelAgents = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getChannelAgents
);

export const getAgents = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getAgents
);

export const getFilter = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getFilter
);

export const getSelectedChannel = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getSelectedChannel
);

export const getRestrictions = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getRestrictions
);

export const getRestrictionsOfChannel = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getRestrictionsOfChannel
);

export const getUses = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getUses
);

export const getClasses = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getClasses
);

export const getClassesByUse = createSelector(
	getChannelRestrictionState,
	fromModuleReducer.getClassesByUse
);
