import { sortArray } from 'app/shared/helpers/utils';
import { Class } from '../../../../shared/models/class.model';
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from '../../../../shared/models/use.model';
import { Agent } from '../../models/Agent';
import { ChannelAgent } from '../../models/ChannelAgent';
import { Filter } from '../../models/Filter';
import { Restriction } from '../../models/Restriction';
import * as moduleAction from '../actions/channel.restriction.actions';

export interface State {
	channelAgents: ChannelAgent[];
	agents: Agent[];
	restrictionsOfChannel: Restriction[];
	restrictions: Restriction[];
	classes: UseClass[];
	uses: Use[];
	filter: Filter;
	selectedChannel: ChannelAgent;
}

const initialState: State = {
	channelAgents: [],
	agents: [],
	restrictionsOfChannel: [],
	restrictions: [],
	classes: [],
	uses: [],
	filter: Filter.CreateInstance(''),
	selectedChannel: null
}

export function reducerChannelRestriction(state = initialState, action: moduleAction.Actions): State {
	switch (action.type) {
		case moduleAction.ChannelRestrictionActionType.LoadSelectedChannelAgents: {
			return {
				...state,
				selectedChannel: action.payload
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadChannelAgents: {
			return {
				...state,
				channelAgents: action.payload
			};
		}
		case moduleAction.ChannelRestrictionActionType.SetFilter: {
			return {
				...state,
				filter: Filter.CreateInstance(action.payload.description)
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadAgents: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.LoadAgentsComplete: {
			const agents = sortArray(action.payload, 'description', 1);
			return {
				...state,
				agents: agents
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadRestrictions: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.LoadRestrictionsComplete: {
			return {
				...state,
				selectedChannel: null,
				restrictionsOfChannel: [],
				restrictions: action.payload
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadRestrictionsOfChannel: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.LoadRestrictionsOfChannelComplete: {
			return {
				...state,
				restrictionsOfChannel: action.payload
			};
		}
		case moduleAction.ChannelRestrictionActionType.AddRestriction: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.AddRestrictionComplete: {
			return {
				...state,
				restrictionsOfChannel: [...state.restrictionsOfChannel, action.payload]
			};
		}
		case moduleAction.ChannelRestrictionActionType.UpdateRestriction: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.UpdateRestrictionComplete: {
			const list1 = state.restrictionsOfChannel.filter(item => item.id !== action.payload.id);
			return {
				...state,
				restrictionsOfChannel: [...list1, action.payload]
			};
		}
		case moduleAction.ChannelRestrictionActionType.DeleteRestriction: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.DeleteRestrictionComplete: {
			return {
				...state,
				restrictions: state.restrictions.filter(item => item.id !== action.payload.id),
				restrictionsOfChannel: state.restrictionsOfChannel.filter(item => item.id !== action.payload.id)
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadUses: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.LoadUsesComplete: {
			const uses = sortArray(action.payload, 'description', 1);
			return {
				...state,
				uses: uses
			};
		}
		/*case moduleAction.ChannelRestrictionActionType.LoadClasses: {
			return state;
		}
		case moduleAction.ChannelRestrictionActionType.LoadClassesComplete: {
			const classes = sortArray(action.payload, 'description', 1);
			return {
				...state,
				classes: classes
			};
		}*/
		case moduleAction.ChannelRestrictionActionType.LoadClassesByUse: {
			return {
				...state,
				classes: []
			};
		}
		case moduleAction.ChannelRestrictionActionType.LoadClassesByUseComplete: {
			const classes = sortArray(action.payload, 'description', 1);
			return {
				...state,
				classes: classes
			};
		}
		default:
			return state;
	}
}

export const getClasses = (state: State) => state.classes;
export const getUses = (state: State) => state.uses;
export const getChannelAgents = (state: State) => state.channelAgents;
export const getRestrictionsOfChannel = (state: State) => state.restrictionsOfChannel;
export const getRestrictions = (state: State) => state.restrictions;
export const getAgents = (state: State) => state.agents;
export const getFilter = (state: State) => state.filter;
export const getSelectedChannel = (state: State) => state.selectedChannel;
export const getClassesByUse = (state: State) => state.classes;
