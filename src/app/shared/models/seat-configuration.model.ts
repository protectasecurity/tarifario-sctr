export enum SeatConfigurationOperator {
	GREATER_OR_EQUAL = '(>=) Mayor o igual a ',
	GREATER = '(>) Mayor a',
	EQUAL = '(=) Igual a',
	MINOR_OR_EQUAL = '(<=) Menor o igual a ',
	MINOR = '(<) Menor a',
	BETWEEN = '(<>) Entre'
}

export class SeatConfiguration {
	minvalue: number;
	maxvalue: number;
	operator: SeatConfigurationOperator;
}
