import { Action } from '@ngrx/store';
import { Class } from '../../../../shared/models/class.model';
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from '../../../../shared/models/use.model';
import { Agent } from '../../models/Agent';
import { ChannelAgent } from '../../models/ChannelAgent';
import { Filter } from '../../models/Filter';
import { Restriction } from '../../models/Restriction';

export enum ChannelRestrictionActionType {
	LoadChannelAgents = '[ChannelRestriction] Load Channel Agents',
	LoadSelectedChannelAgents = '[ChannelRestriction] Load Selected Channel Agents',
	SetFilter = '[ChannelRestriction] Set Filter',
	LoadAgents = '[ChannelRestriction] Load Agents',
	LoadAgentsComplete = '[ChannelRestriction] Load Agents Complete',
	LoadRestrictions = '[ChannelRestriction] Load Restrictions',
	LoadRestrictionsComplete = '[ChannelRestriction] Load Restrictions Complete',
	LoadRestrictionsOfChannel = '[ChannelRestriction] Load Restrictions Of Selected Channel',
	LoadRestrictionsOfChannelComplete = '[ChannelRestriction] Load Restrictions Of Selected Channel Complete',
	AddRestriction = '[ChannelRestriction] Add Restriction',
	AddRestrictionComplete = '[ChannelRestriction] Add Restriction Complete',
	UpdateRestriction = '[ChannelRestriction] Update Restriction',
	UpdateRestrictionComplete = '[ChannelRestriction] Update Restriction Complete',
	DeleteRestriction = '[ChannelRestriction] Delete Restriction',
	DeleteRestrictionComplete = '[ChannelRestriction] Delete Restriction Complete',
	LoadUses = '[ChannelRestriction] Load Uses',
	LoadUsesComplete = '[ChannelRestriction] Load Complete Uses',
	LoadClasses = '[ChannelRestriction] Load Classes',
	LoadClassesByUse = '[ChannelRestriction] Load Classes By Use',
	LoadClassesByUseComplete = '[ChannelRestriction] Load Classes By Use Complete',
	LoadClassesComplete = '[ChannelRestriction] Load Complete Classes',
	HandledErrors = '[ChannelRestriction] Load Brokers'
}

export class LoadChannelAgents implements Action {
	readonly type = ChannelRestrictionActionType.LoadChannelAgents;
	constructor(public payload: ChannelAgent[]) { }
}

export class LoadSelectedChannelAgents implements Action {
	readonly type = ChannelRestrictionActionType.LoadSelectedChannelAgents;
	constructor(public payload: ChannelAgent) { }
}

export class SetFilter implements Action {
	readonly type = ChannelRestrictionActionType.SetFilter;
	constructor(public payload: Filter) { }
}

export class LoadAgents implements Action {
	readonly type = ChannelRestrictionActionType.LoadAgents;
	constructor(public payload: string) { }
}

export class LoadAgentsComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadAgentsComplete;
	constructor(public payload: Agent[]) { }
}

export class LoadRestrictions implements Action {
	readonly type = ChannelRestrictionActionType.LoadRestrictions;
	constructor() { }
}

export class LoadRestrictionsComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadRestrictionsComplete;
	constructor(public payload: Restriction[]) { }
}

export class LoadRestrictionsOfChannel implements Action {
	readonly type = ChannelRestrictionActionType.LoadRestrictionsOfChannel;
	constructor(public payload: string) { }
}

export class LoadRestrictionsOfChannelComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadRestrictionsOfChannelComplete;
	constructor(public payload: Restriction[]) { }
}

export class AddRestriction implements Action {
	readonly type = ChannelRestrictionActionType.AddRestriction;
	constructor(public payload: Restriction) { }
}

export class AddRestrictionComplete implements Action {
	readonly type = ChannelRestrictionActionType.AddRestrictionComplete;
	constructor(public payload: Restriction) { }
}

export class UpdateRestriction implements Action {
	readonly type = ChannelRestrictionActionType.UpdateRestriction;
	constructor(public payload: Restriction) { }
}

export class UpdateRestrictionComplete implements Action {
	readonly type = ChannelRestrictionActionType.UpdateRestrictionComplete;
	constructor(public payload: Restriction) { }
}

export class DeleteRestriction implements Action {
	readonly type = ChannelRestrictionActionType.DeleteRestriction;
	constructor(public payload: string) { }
}

export class DeleteRestrictionComplete implements Action {
	readonly type = ChannelRestrictionActionType.DeleteRestrictionComplete;
	constructor(public payload: Restriction) { }
}

export class LoadUses implements Action {
	readonly type = ChannelRestrictionActionType.LoadUses;
	constructor() { }
}

export class LoadUsesComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadUsesComplete;
	constructor(public payload: Use[]) { }
}

export class LoadClasses implements Action {
	readonly type = ChannelRestrictionActionType.LoadClasses;
	constructor() { }
}

export class LoadClassesByUse implements Action {
	readonly type = ChannelRestrictionActionType.LoadClassesByUse;
	constructor(public payload: string) { }
}
export class LoadClassesByUseComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadClassesByUseComplete;
	constructor(public payload: UseClass[]) { }
}

export class LoadClassesComplete implements Action {
	readonly type = ChannelRestrictionActionType.LoadClassesComplete;
	constructor(public payload: Class[]) { }
}

export class HandledErrors implements Action {
	readonly type = ChannelRestrictionActionType.HandledErrors;
	constructor(public payload: string) { }
}

export type Actions =
	| LoadChannelAgents
	| LoadSelectedChannelAgents
	| SetFilter
	| LoadAgents
	| LoadAgentsComplete
	| LoadRestrictionsOfChannel
	| LoadRestrictionsOfChannelComplete
	| LoadRestrictions
	| LoadRestrictionsComplete
	| AddRestriction
	| AddRestrictionComplete
	| UpdateRestriction
	| UpdateRestrictionComplete
	| DeleteRestriction
	| DeleteRestrictionComplete
	| LoadUses
	| LoadUsesComplete
	| LoadClasses
	| LoadClassesComplete
	| LoadClassesByUse
	| LoadClassesByUseComplete
	| HandledErrors
	;






