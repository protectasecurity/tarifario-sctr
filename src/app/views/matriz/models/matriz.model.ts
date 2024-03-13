import * as moment from "moment";
import { Actividades } from "../../actividades/models/Actividades";
import { IFeeZoneValue } from "../../fee/models/fee.model";
import { Parameter } from "../../parameters/models/parameter.model";
import { Zone } from "../../zones/models/zone.model";

export enum RamoEnumType {
	HEALTH = "Salud",
	PENSION = "Pension"
}

export enum BranchEnumType {
	TO50 = "De 1 a 50",
	MORE50 = "Mas de 50"
}

export enum CollEnumType {
	HIGH = "Alto",
	MEDIUM = "Medio",
	LOW = "Bajo",
	FLAT = "Flat"
}

export interface IMatrizRisk {
	id: string;
	description: string;
	feeZone: IFeeZoneValue[];
	isActive: boolean;
	indice: number;
}

export interface IMatrizValues {
	riesgo: number;
	comercial: number;

}

export interface IMatrizZone extends Zone {
	status: number;
}

export interface IMatrizWorkerValue {
	idWorker: string;
	valores: IMatrizValues;
	status: number;
}

export interface IMatrizRisk {
	id: string;
	description: string;
	prima: number;
	isActive: boolean;
	indice: number;
	matrizWorker: IMatrizWorkerValue[];

}

export interface IMatrizActividades extends Actividades {
	status: number;
}

export interface IMatrizParamaters extends Parameter {
	status: number;
}

export class ILinkedChannel {
	startDate: string;
	endDate: string;
	commission: string;
	distribution: string;
	discount: string;
	fieldsId: string;
	channelGroup: IMatrixChannelGroup;
	parameters: ParameterStatus[];
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
export class IMatrixChannel {
	id: string;
	description: string;
	isActive: boolean;
	agents: IMatrixAgent[];
}
export class IMatrixAgent {
	id: string;
	description: string;
	type: string;
}

export class ParameterStatus {
	id: string;
	description: string;
	isActive: boolean;
}

export class MatrizRiesgo {
	id: string;
	description: string;
	type: string;
	startDate: string;
	endDate: string;
	effectDate: string;
	currency: string;
	updatedAt: string;
	originTariffMatrix: any;
	isActive: boolean;
	areaGroups: Zone[];
	activityGroups: Actividades[];
	parameters: Parameter[];
	risks: Risk[];
	derivedTariffMatrices: any[];
	linkedChannelGroups: ILinkedChannel[];

	constructor(data: any) {
		this.id = data.id;
		this.isActive = data.isActive;
		this.parameters = data.parameters;
		this.description = data.description;
		this.type = data.type;
		this.startDate = data.startDate;
		this.endDate = data.endDate ? data.endDate : null;
		this.effectDate = data.effectDate;
		this.currency = data.currency;
		this.areaGroups = data.areaGroups;
		this.activityGroups = data.activityGroups;
		this.risks = data.risks;
		this.updatedAt = data.updatedAt;
		this.originTariffMatrix = data.originTariffMatrix ? data.originTariffMatrix : null;
		this.derivedTariffMatrices = data.derivedTariffMatrices ? data.derivedTariffMatrices : [];
		this.linkedChannelGroups = data.linkedChannelGroups;

	}

	static mapFromResponse(data: any): MatrizRiesgo {
		return new MatrizRiesgo(data);
	}

	static mapFromMatrixResponse(data: any): MatrizRiesgo {
		const newData = <any>{};
		newData.id = data.id;
		newData.isActive = data.isActive;
		newData.parameters = data.parameters;
		newData.description = data.description;
		newData.type = data.type;
		newData.startDate = moment(new Date(data.startDate), "DD/MM/YYYY");
		newData.endDate = data.endDate ? moment(new Date(data.endDate), "DD/MM/YYYY") : null;
		newData.effectDate = data.effectDate ? moment(new Date(data.effectDate), "DD/MM/YYYY") : null;
		newData.currency = data.currency;
		newData.derivedTariffMatrices = data.derivedTariffMatrices ? data.derivedTariffMatrices : [];
		newData.risks = data.risks;
		newData.updatedAt = data.updatedAt;
		newData.originTariffMatrix = data.originTariffMatrix ? data.originTariffMatrix : null;
		newData.linkedChannelGroups = data.linkedChannelGroups === undefined ? [] : data.linkedChannelGroups;

		const zones = [];
		const actividades = [];

		if (data.areaGroups !== undefined) {
			for (let idx = 0; idx < data.areaGroups.length; idx++) {
				const zone = data.areaGroups[idx];
				zones.push({
					id: zone.id,
					description: zone.description,
					active: true,
					used: false,
					locations: zone.locations,
					indice: zone.indice,
					status: 1
				});
			}
		}
		if (data.activityGroups !== undefined) {
			for (let idx = 0; idx < data.activityGroups.length; idx++) {
				const act = data.activityGroups[idx];
				actividades.push({
					id: act.id,
					description: act.description,
					group: act.group,
					groupId: act.groupId,
					order: act.order,
					isUsed: false,
					isDelimiter: act.isDelimiter,
					isSelfManaging: act.isSelfManaging,
					isActive: act.isActive,
					discount: act.discount,
					factor: act.factor,
					status: 1
				});
			}
		}

		newData.areaGroups = zones;
		newData.activityGroups = actividades;

		return new MatrizRiesgo(newData);
	}
}

export class Appraisals {
	commercialAppraisal: number;
	riskAppraisal: number;
	workerTypeId: string;

	constructor(commercialAppraisal: any, riskAppraisal: any, workerTypeId: string) {
		this.commercialAppraisal = commercialAppraisal;
		this.riskAppraisal = riskAppraisal;
		this.workerTypeId = workerTypeId;
	}
}

export class Risk {
	id: string;
	activityId: string;
	areaGroupId: string;
	fieldsId: string;
	minimumPremium: number;
	minimumPremiumEndoso: number;
	enterpriseSizeId: string;
	appraisals: Appraisals[];
	order: number;
}


