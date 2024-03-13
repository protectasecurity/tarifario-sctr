import { Action } from '@ngrx/store';
import { Agent } from '../../models/Agent';
import { Channel } from '../../models/Channels';
import { Customer } from '../../models/Customer';
import { ManageChannelGroup } from '../../models/ManageChannelGroup';
import { Fee } from './../../../fee/models/fee.model';
import { Class } from '../../../../shared/models/class.model';
import { Use } from '../../../../shared/models/use.model';


export enum ChannelActionTypes {
	LoadUses = '[ClassUsesModule] Load Uses',
	LoadUsesComplete = '[ClassUsesModule] Load Complete Uses',
	LoadClasses = '[ClassUsesModule] Load Classes',
	LoadClassesComplete = '[ClassUsesModule] Load Complete Classes',
	LoadChannels = '[Channel] Load Channels',
	LoadChannelsComplete = '[Channel] Load Channels Complete',
	SetDefaultChannelGroup = '[Channel] Set Default Channel Group',
	GetChannelGroup = '[Channel] Get Channel Group',
	GetChannelGroupComplete = '[Channel] Get Channel Group Complete',
	LoadBrokers = '[Channel] Load Brokers',
	LoadBrokersComplete = '[Channel] Load Brokers Complete',
	LoadMiddlemen = '[Channel] Load Middlemen',
	LoadMiddlemenComplete = '[Channel] Load Middlemen Complete',
	LoadSalesPoint = '[Channel] Load SalesPoint',
	LoadSalesPointComplete = '[Channel] Load SalesPoint Complete',
	UpdateBrokerSearchText = '[Channel] Update Broker Search Text',
	UpdateMiddlemenSearchText = '[Channel] Update Middlemen Search Text',
	AddChannelGroup = '[Channel] Add Channel Group',
	AddChannelGroupComplete = '[Channel] Add Channel Group Complete',
	DeleteChannelGroup = '[Channel] Delete Channel Group',
	DeleteChannelGroupComplete = '[Channel] Delete Channel Group Complete',
	UpdateChannelGroup = '[Channel] Update Channel Group',
	UpdateChannelGroupComplete = '[Channel] Update Channel Group Complete',
	GetCustomerByName = '[Customer] Get Customer by Name',
	GetCustomerByNameComplete = '[Customer] Get Customer by Name Complete',
	SetCustomerByDefault = '[Customer] Set Customer By Default',
	LoadFeeCollection = '[Channel] Load FeeCollection',
	LoadFeeCollectionComplete = '[Channel] Load FeeCollection Complete',
	HandledErrors = '[Channel] Handled Error'
}

export class LoadClasses implements Action {
	readonly type = ChannelActionTypes.LoadClasses;
	constructor() { }
}

export class LoadClassesComplete implements Action {
	readonly type = ChannelActionTypes.LoadClassesComplete;
	constructor(public payload: Class[]) { }
}

export class LoadUses implements Action {
	readonly type = ChannelActionTypes.LoadUses;
	constructor() { }
}

export class LoadUsesComplete implements Action {
	readonly type = ChannelActionTypes.LoadUsesComplete;
	constructor(public payload: Use[]) { }
}

export class SetCustomerByDefault implements Action {
	readonly type = ChannelActionTypes.SetCustomerByDefault;
	constructor() { }
}
export class SetDefaultChannelGroup implements Action {
	readonly type = ChannelActionTypes.SetDefaultChannelGroup;
	constructor() {
	}
}
export class LoadChannels implements Action {
	readonly type = ChannelActionTypes.LoadChannels;
	constructor() { }
}
export class LoadChannelsComplete implements Action {
	readonly type = ChannelActionTypes.LoadChannelsComplete;
	constructor(public payload: Channel[]) { }
}
export class GetChannelGroup implements Action {
	readonly type = ChannelActionTypes.GetChannelGroup;
	constructor(public groupId: string) { }
}
export class GetChannelGroupComplete implements Action {
	readonly type = ChannelActionTypes.GetChannelGroupComplete;
	constructor(public payload: ManageChannelGroup) { }
}
export class AddChannelGroup implements Action {
	readonly type = ChannelActionTypes.AddChannelGroup;
	constructor(public payload: ManageChannelGroup) { }
}
export class AddChannelGroupComplete implements Action {
	readonly type = ChannelActionTypes.AddChannelGroupComplete;
	constructor() { }
}
export class LoadBrokers implements Action {
	readonly type = ChannelActionTypes.LoadBrokers;
	constructor(public payload: string) { }
}
export class LoadBrokersComplete implements Action {
	readonly type = ChannelActionTypes.LoadBrokersComplete;
	constructor(public payload: Agent[]) { }
}
export class LoadMiddlemen implements Action {
	readonly type = ChannelActionTypes.LoadMiddlemen;
	constructor(public payload: string) { }
}
export class LoadMiddlemenComplete implements Action {
	readonly type = ChannelActionTypes.LoadMiddlemenComplete;
	constructor(public payload: Agent[]) { }
}
export class LoadSalesPoint implements Action {
	readonly type = ChannelActionTypes.LoadSalesPoint;
	constructor(public payload: string) { }
}
export class LoadSalesPointComplete implements Action {
	readonly type = ChannelActionTypes.LoadSalesPointComplete;
	constructor(public payload: Agent[]) { }
}
export class UpdateBrokerSearchText implements Action {
	readonly type = ChannelActionTypes.UpdateBrokerSearchText;
	constructor(public payload: string) { }
}
export class UpdateMiddlemenSearchText implements Action {
	readonly type = ChannelActionTypes.UpdateMiddlemenSearchText;
	constructor(public payload: string) { }
}
export class DeleteChannelGroup implements Action {
	readonly type = ChannelActionTypes.DeleteChannelGroup;
	constructor(public payload: string) { }
}
export class DeleteChannelGroupComplete implements Action {
	readonly type = ChannelActionTypes.DeleteChannelGroupComplete;
	constructor() { }
}
export class UpdateChannelGroup implements Action {
	readonly type = ChannelActionTypes.UpdateChannelGroup;
	constructor(public payload: ManageChannelGroup) { }
}
export class UpdateChannelGroupComplete implements Action {
	readonly type = ChannelActionTypes.UpdateChannelGroupComplete;
	constructor() { }
}
export class GetCustomerByName implements Action {
	readonly type = ChannelActionTypes.GetCustomerByName;
	constructor(public name: string) { }
}
export class GetCustomerByNameComplete implements Action {
	readonly type = ChannelActionTypes.GetCustomerByNameComplete;
	constructor(public payload: Customer[]) { }
}

export class LoadFeeCollection implements Action {
	readonly type = ChannelActionTypes.LoadFeeCollection;
	constructor() { }
}
export class LoadFeeCollectionComplete implements Action {
	readonly type = ChannelActionTypes.LoadFeeCollectionComplete;
	constructor(public payload: Fee[]) { }
}

export class HandledErrors implements Action {
	readonly type = ChannelActionTypes.HandledErrors;
	constructor(public payload: string) { }
}

export type Actions =
	| LoadUses
	| LoadUsesComplete
	| LoadClasses
	| LoadClassesComplete
	| LoadChannels
	| LoadChannelsComplete
	| LoadBrokers
	| LoadBrokersComplete
	| LoadMiddlemen
	| LoadMiddlemenComplete
	| LoadSalesPoint
	| LoadSalesPointComplete
	| UpdateBrokerSearchText
	| UpdateMiddlemenSearchText
	| AddChannelGroup
	| AddChannelGroupComplete
	| DeleteChannelGroup
	| DeleteChannelGroupComplete
	| GetChannelGroup
	| GetChannelGroupComplete
	| SetDefaultChannelGroup
	| UpdateChannelGroup
	| UpdateChannelGroupComplete
	| GetCustomerByName
	| GetCustomerByNameComplete
	| SetCustomerByDefault
	| LoadFeeCollection
	| LoadFeeCollectionComplete
	;
