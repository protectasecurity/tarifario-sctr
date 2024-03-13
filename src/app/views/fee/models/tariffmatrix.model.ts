import { SubGroups } from '../../../shared/models/class.model';
import { RiskGroup } from '../../../shared/models/risk-group.model';
import { Use } from '../../../shared/models/use.model';
import { Ubigeo } from '../../../views/zones/models/ubigeo.model';
import { Zone } from '../../../views/zones/models/zone.model';

/* import { Use } from '../../../shared/models/use.model';
import { Zone } from '../../zones/models/zone.model';
 */

export class IAreaGroup {
	id: string;
	description: string;
	isActive: boolean;
	isUsed: boolean;
	departments: Ubigeo[];
	order: number;
}
export class IRiskGroup {
	id: string;
	isBase: boolean;
	order: number;
	indice: number;
	isActive: boolean;
	isUsed: boolean;
	description: string;
	vehicleUse: Use;
	personType: string;
	subGroups: SubGroups[];
}
export class ICommissionsDetail {
	standardCommission: number;
	digitalCommission: number;
	renewalStandardCommission: number;
	renewalDigitalCommission: number;
	standardGrossUpCommission: number;
	digitalGrossUpCommission: number;
}
export class ICommissions {
	channelGroupId: string;
	brokerCommission: ICommissionsDetail;
	middlemanCommission: ICommissionsDetail;
	pointOfSaleCommission: ICommissionsDetail;
}
export interface ITariffMatrixItem {
	riskGroupId: string;
	areaGroupId: string;
	standardPremium: number;
	digitalPremium: number;
	renewalStandardPremium: number;
	renewalDigitalPremium: number;
	commissions: ICommissions[];
}

export class IMatrixAgent {
	id: string;
	description: string;
	type: string;
	coreType: string;
}

export class IMatrixChannel {
	id: string;
	description: string;
	isActive: boolean;
	agents: IMatrixAgent[];
}

export class IMatrixChannelGroup {
	id: string;
	description: string;
	isActive: boolean;
	channels: IMatrixChannel[];

	constructor(data: any) {
		this.id = data.id;
		this.description = data.description;
		this.isActive = data.isActive;
		this.channels = data.channels;
	}

	static mapFromResponse(data: any): IMatrixChannelGroup {
		return new IMatrixChannelGroup(data);
	}
}

export class ILinkedChannel {
	startDate: string;
	endDate: string;
	allowStandardTariff: boolean;
	allowDigitalTariff: boolean;
	allowRenewalStandardTariff: boolean;
	allowRenewalDigitalTariff: boolean;
	channelGroup: IMatrixChannelGroup;
}
export class TariffMatrix {
	id: string;
	type: string;
	startDate: string;
	isActive: boolean;
	endDate: string;
	hasEndDate: boolean;
	effectDate: string;
	description: string;
	currency: string;
	target: string;
	areaGroups: IAreaGroup[];
	riskGroups: RiskGroup[];
	details: ITariffMatrixItem[];
	originTariffMatrix: string;
	derivedTariffMatrices: TariffMatrix[];
	linkedChannelGroups: ILinkedChannel[];

	constructor(data: any) {
		if (data) {
			this.type = data.type;
			this.startDate = data.startDate;
			this.endDate = data.endDate;
			this.isActive = data.isActive;
			this.description = data.description;
			this.currency = data.currency;
			this.target = data.target;
			this.areaGroups = data.areaGroups;
			this.riskGroups = data.riskGroups;
			this.details = data.details;
			this.effectDate = null;
			this.derivedTariffMatrices = data.derivedTariffMatrices;
			this.linkedChannelGroups = null;
		}
	}

	static mapFromResponse(data: any): TariffMatrix {
		return new TariffMatrix(data);
	}
}
