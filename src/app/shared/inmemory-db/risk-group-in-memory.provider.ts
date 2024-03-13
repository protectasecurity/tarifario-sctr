import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskGroup } from '../models/risk-group.model';
import { RiskGroupProvider } from '../services/risk-group/risk-group.provider';

@Injectable()
export class RiskGroupInMemoryProvider implements RiskGroupProvider {
	private riskGroups: RiskGroup[];

	private riskGroupCollection = [
		// {
		// 	id: '1',
		// 	isActive: true,
		// 	isBase: true,
		// 	personType: 'BASE',
		// 	personType: null,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Automóvil Excepto modelos especiales',
		// 	order: 1
		// },
		// {
		// 	id: '2',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: false,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Automóvil Modelos especiales',
		// 	order: 2
		// },
		// {
		// 	id: '3',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Station Wagon excepto modelos especiales',
		// 	order: 3
		// },
		// {
		// 	id: '4',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Station Wagon  modelos especiales',
		// 	order: 4
		// },
		// {
		// 	id: '5',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Rural hasta 9 asientos excepto modelos especiales',
		// 	order: 5
		// },
		// {
		// 	id: '6',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Rural mayor a 9 asientos excepto modelos especiales',
		// 	order: 6
		// },
		// {
		// 	id: '7',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Rural modelos especiales (3)',
		// 	order: 7
		// },
		// {
		// 	id: '8',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Pick Up excepto modelos especiales',
		// 	order: 8
		// },
		// {
		// 	id: '9',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta panel',
		// 	order: 9
		// },
		// {
		// 	id: '10',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 1, description: 'Particular', order: 1, isActive: true },
		// 	classGroups: null,
		// 	description: 'Motocicleta y Cuatrimoto',
		// 	order: 10
		// },
		// {
		// 	id: '11',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 10, description: 'Taxi', order: 2, isActive: true },
		// 	classGroups: null,
		// 	description: 'Automóvil Excepto modelos especiales',
		// 	order: 1
		// },
		// {
		// 	id: '12',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 10, description: 'Taxi', order: 2, isActive: true },
		// 	classGroups: null,
		// 	description: 'Automóvil Modelos especiales',
		// 	order: 2
		// },
		// {
		// 	id: '13',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isBase: true,
		// 	isActive: true,
		// 	use: { id: 10, description: 'Taxi', order: 2, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Station Wagon',
		// 	order: 3
		// },
		// {
		// 	id: '14',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 10, description: 'Taxi', order: 2, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Rural hasta 9 asientos',
		// 	order: 4
		// },
		// {
		// 	id: '15',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 4, description: 'Carga', order: 3, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camión Baranda persona natural',
		// 	order: 1
		// },
		// {
		// 	id: '16',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 4, description: 'Carga', order: 3, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camión Cisterna, Furgón y Volquete- persona natural',
		// 	order: 2
		// },
		// {
		// 	id: '17',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 4, description: 'Carga', order: 3, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camión Baranda, Cisterna, Furgón y Volquete- Persona Jurídica (RUC 20)',
		// 	order: 3
		// },
		// {
		// 	id: '18',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 4, description: 'Carga', order: 3, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta Pick Up',
		// 	order: 4
		// },
		// {
		// 	id: '19',
		// 	type: 'BASE',
		// 	personType: null,
		// 	isActive: true,
		// 	isBase: true,
		// 	use: { id: 4, description: 'Carga', order: 3, isActive: true },
		// 	classGroups: null,
		// 	description: 'Camioneta panel',
		// 	order: 5
		// }
	];

	constructor() {
		this.riskGroups = this.riskGroupCollection;
		this.set();
	}

	getById(riskGroupId: string): Observable<RiskGroup> {
		this.get();
		return new Observable(observer => {
			const val = this.riskGroups.filter(value => value.id === riskGroupId)[0];
			observer.next(val);
			observer.complete();
		});
	}

	list(): Observable<RiskGroup[]> {
		this.get();
		return new Observable(observer => {
			observer.next(this.riskGroups);
			observer.complete();
		});
	}

	create(value: RiskGroup): void {
		this.get();
		// value.id = Math.floor(Math.random() * 10000001);
		this.riskGroups.push(value);
		this.set();
	}
	reorder(value: RiskGroup[], userSelectedId: string): Observable<Response> {
		this.get();
		for (let index = 0; index < value.length; index++) {
			value[index].order = index + 1;
		}
		const newList = this.riskGroups.filter(itemRisk => itemRisk.vehicleUse.id !== userSelectedId);
		this.riskGroups = newList.concat(value);
		this.set();
		return new Observable<Response>();
	}
	private set(): void {
		try {
			localStorage.setItem('RG', JSON.stringify(this.riskGroups));
		} catch (e) {
			console.error('Error saving to localStorage', e);
		}
	}

	private get() {
		try {
			this.riskGroups = JSON.parse(localStorage.getItem('RG'));
		} catch (e) {
			console.error('Error getting data from localStorage', e);
		}
	}
}
