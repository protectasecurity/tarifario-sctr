import * as moment from 'moment';
/* import { IFeeZone } from './fee.model'; */
import { Use } from '../../../shared/models/use.model';
import { Zone } from '../../zones/models/zone.model';
import { RiskGroup } from './../../../shared/models/risk-group.model';
import { ILinkedChannel, TariffMatrix } from './tariffmatrix.model';

export enum FeeType {
	BASE = 'BASE',
	SPECIAL = 'CANAL',
	CAMPAIGN = 'CAMPAÑA'
}

export interface IPlateSearch {
	vehicleUse: IPlateBase;
	vehicleClass: IPlateBase;
	vehicleBrand: IPlateBase;
	vehicleModel: IPlateBase;
	vehicleVersion: IPlateBase;
	seatNumber: string;
}
export interface IPlateBase {
	id: string;
	description: string;
}

export interface IPlateSearch {
	vehicleUse: IPlateBase;
	vehicleClass: IPlateBase;
	vehicleBrand: IPlateBase;
	vehicleModel: IPlateBase;
	vehicleVersion: IPlateBase;
	seatNumber: string;
}

export interface IFeeSearch {
	type: string;
	target: string;
	description: string;
	premium: IFeePremium;
	brokerCommission: IFeeCommissionDetail;
	middlemanCommission: IFeeCommissionDetail;
	pointOfSaleCommission: IFeeCommissionDetail;
}

export interface IFeePremium {
	fisico: number;
	fisicoRenovacion: number;
	digital: number;
	digitalRenovacion: number;
}

export interface IFeeCommissionDetail {
	standardCommission: number;
	digitalCommission: number;
	renewalStandardCommission: number;
	renewalDigitalCommission: number;
	standardGrossUpCommission: number;
	digitalGrossUpCommission: number;
}

export interface IFeeCommission {
	channelGroupId: string;
	brokerCommission: IFeeCommissionDetail;
	middlemanCommission: IFeeCommissionDetail;
	pointOfSaleCommission: IFeeCommissionDetail;
}

export interface IFeeZoneValue {
	idZone: string;
	premium: IFeePremium;
	commission: IFeeCommission[];
	status: number;
}

export interface IFeeRisk {
	id: string;
	vehicleUse: Use;
	fullDescription: string;
	description: string;
	feeZone: IFeeZoneValue[];
	isActive: boolean;
	indice: number;
	origin: boolean;
}
export interface IDerivedChild {
	id: string;
	type: string;
	startDate: string;
	endDate: string;
	description: string;
	currency: string;
	target: string;
	riskGroups: any[];
	details: any[];
	areaGroups: any[];
}

export interface IFeeZone extends Zone {
	status: number;
}

export class Fee {
	idTarifa: string;
	type: string;
	startDate: string;
	endDate: string;
	effectDate: string;
	updatedAt: string;
	state: boolean;
	asociated: boolean;
	description: string;
	currency: string;
	target: string;
	zones: IFeeZone[];
	rows: IFeeRisk[];
	riskGroups: RiskGroup[];
	linkedchannels: ILinkedChannel[];
	derivedChilds: IDerivedChild[];
	mainParent: IDerivedChild;
	premiumbase: boolean;

	constructor(data: any) {
		this.idTarifa = data.idTarifa;
		this.type = data.type;
		this.startDate = data.startDate;
		this.endDate = data.endDate;
		this.updatedAt = data.updatedAt;
		this.state = data.state;
		this.asociated = data.asociated;
		this.description = data.description;
		this.currency = data.currency;
		this.target = data.target;
		this.zones = data.zones;
		this.rows = data.rows;
		this.riskGroups = data.riskGroups;
		this.effectDate = data.effectDate;
		this.linkedchannels = data.linkedchannels;
		this.derivedChilds = data.derivedChilds;
		this.premiumbase = data.premiumbase;
		this.mainParent = data.mainParent;
	}

	static mapFromResponse(data: any): Fee {
		return new Fee(data);
	}

	static mapFromMatrixResponse(data: any): Fee {
		const newData = <any>{};
		newData.idTarifa = data.id;
		newData.type = data.type;
		newData.startDate = moment(data.startDate).format('DD/MM/YYYY');
		newData.endDate = data.endDate ? moment(data.endDate).format('DD/MM/YYYY') : null;
		newData.updatedAt = data.updatedAt;
		newData.effectDate = data.effectDate;
		newData.state = data.isActive;
		newData.asociated = data.derivedTariffMatrices === undefined ? false : data.derivedTariffMatrices.length === 0 ? false : true;
		newData.description = data.description;
		newData.currency = data.currency;
		newData.target = data.target;
		newData.riskGroups = data.riskGroups;
		newData.linkedchannels = data.linkedChannelGroups === undefined ? [] : data.linkedChannelGroups;
		newData.derivedChilds = data.derivedTariffMatrices === undefined ? [] : data.derivedTariffMatrices;
		newData.mainParent = data.originTariffMatrix;
		newData.premiumbase = data.originTariffMatrix != null ? true : false;

		const zoneCollValue: Array<IFeeZoneValue> = [];
		const zonesColl: IFeeZone[] = [];

		if (data.areaGroups !== undefined) {
			for (let idx = 0; idx < data.areaGroups.length; idx++) {
				const zone = data.areaGroups[idx];
				zone.status = 1;
				zonesColl.push({
					id: zone.id,
					description: zone.description,
					active: true,
					used: true,
					locations: zone.locations,
					indice: idx,
					status: 1
				});
				zoneCollValue.push({
					idZone: zone.id,
					premium: {
						fisico: 0,
						fisicoRenovacion: 0,
						digital: 0,
						digitalRenovacion: 0
					},
					commission: [],
					status: 0
				});
			}

			if (newData.premiumbase) {
				if (data.originTariffMatrix) {
					if (data.originTariffMatrix.areaGroups) {
						for (let idy = 0; idy < data.originTariffMatrix.areaGroups.length; idy++) {
							const zone = data.originTariffMatrix.areaGroups[idy];
							const xxx = zonesColl.find(x => x.id === zone.id);
							if (xxx === undefined) {
								zone.status = 0;
								zonesColl.push({
									id: zone.id,
									description: zone.description,
									active: true,
									used: true,
									locations: zone.locations,
									indice: idy,
									status: 0
								});

								zoneCollValue.push({
									idZone: zone.id,
									premium: {
										fisico: 0,
										fisicoRenovacion: 0,
										digital: 0,
										digitalRenovacion: 0
									},
									commission: [],
									status: 0
								});
							}
						}
					}
				}
			}
		}

		const rowDetails: IFeeRisk[] = [];

		if (data.details !== undefined) {
			for (let index = 0; index < data.details.length; index++) {
				const matrixZone = data.details[index];
				const rGF = data.riskGroups.find(xx => xx.id === matrixZone.riskGroupId);
				const findRG = rowDetails.find(x => x.id === matrixZone.riskGroupId);
				if (findRG === undefined) {
					rowDetails.push({
						id: matrixZone.riskGroupId,
						vehicleUse: rGF.vehicleUse,
						fullDescription: 'michi',
						description: rGF.description.replace(/\n/g, ' '),
						feeZone: JSON.parse(JSON.stringify(zoneCollValue)),
						isActive: true,
						indice: index,
						origin: false
					});
				}
			}
			if (newData.premiumbase) {
				if (data.originTariffMatrix) {
					if (data.originTariffMatrix.details) {
						for (let index = 0; index < data.originTariffMatrix.details.length; index++) {
							const matrixZone = data.originTariffMatrix.details[index];
							const rGF = data.originTariffMatrix.riskGroups.find(xx => xx.id === matrixZone.riskGroupId);
							const findRG = rowDetails.find(x => x.id === matrixZone.riskGroupId);
							if (findRG === undefined) {
								rowDetails.push({
									id: matrixZone.riskGroupId,
									vehicleUse: rGF.vehicleUse,
									fullDescription: 'michi',
									description: rGF.description.replace(/\n/g, ' '),
									feeZone: JSON.parse(JSON.stringify(zoneCollValue)),
									isActive: false,
									indice: index,
									origin: true
								});
							}
						}
					}
				}
			}
		}
		for (let index = 0; index < rowDetails.length; index++) {
			const element = rowDetails[index];
			for (let idx = 0; idx < element.feeZone.length; idx++) {
				const detailZone = element.feeZone[idx];
				const findPremium = data.details.find(x => x.riskGroupId === element.id && x.areaGroupId === detailZone.idZone);
				if (findPremium !== undefined) {
					detailZone.premium.fisico = findPremium.standardPremium;
					detailZone.premium.digital = findPremium.digitalPremium;
					detailZone.premium.fisicoRenovacion = findPremium.renewalStandardPremium;
					detailZone.premium.digitalRenovacion = findPremium.renewalDigitalPremium;
					detailZone.commission = findPremium.commissions;
				} else {
					if (newData.premiumbase) {
						if (data.originTariffMatrix) {
							if (data.originTariffMatrix.details) {
								const findPremiumOrigin = data.originTariffMatrix.details.find(
									x => x.riskGroupId === element.id && x.areaGroupId === detailZone.idZone
								);
								if (findPremiumOrigin !== undefined) {
									detailZone.premium.fisico = findPremiumOrigin.standardPremium;
									detailZone.premium.digital = findPremiumOrigin.digitalPremium;
									detailZone.premium.fisicoRenovacion = findPremiumOrigin.renewalStandardPremium;
									detailZone.premium.digitalRenovacion = findPremiumOrigin.renewalDigitalPremium;
									detailZone.commission = [];
								}
							}
						}
					}
				}
			}
		}
		newData.zones = zonesColl;
		newData.rows = rowDetails;
		return new Fee(newData);
	}
}
