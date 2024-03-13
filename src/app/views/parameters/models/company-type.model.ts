export enum ParametersTypeConfiguration {
	COMMISSION = 'Comisión',
	PRODUCTIVITY_GOAL = 'Meta de Productividad',
	FIELD = 'Ramo',
	REWARD = 'Recompensa',
	COMPANY_SIZE = 'Tamaño de Empresa',
	WORKER_TYPE = 'Tipo de trabajador'
}

export class ParametersType {
	type: ParametersTypeConfiguration;
}
