import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fee } from '../../views/fee/models/fee.model';
import { FeeProvider } from '../services/fee/fee.provider';

@Injectable()
export class FeeInMemoryProvider implements FeeProvider {
	private tarifa: Fee = null;
	/* private tarifa: Fee = {
		idTarifa: '1000',
		description: 'Tarifario 2018',
		type: 'BASE',
		startDate: 'new Date()',
		endDate: 'new Date()',
		effectDate: 'new Date()',
		state: true,
		asociated: false,
		currency: 'PEN',
		zones: [
			{
				id: '3926',
				description: 'Lima - Callao',

				active: true,
				used: false,
				ubigeos: [],
				indice: 1,
				isActive: 0
			},
			{
				id: '2625',
				description: 'Ancash',

				active: true,
				used: false,
				ubigeos: [],
				indice: 3,
				isActive: 0
			},
			{
				id: '2812',
				description: 'Apurimac',

				active: true,
				used: false,
				ubigeos: [],
				indice: 4,
				isActive: 0
			},
			{
				id: '2900',
				description: 'Arequipa',

				active: true,
				used: false,
				ubigeos: [],
				indice: 5,
				isActive: 0
			},
			{
				id: '3020',
				description: 'Ayacucho',

				active: true,
				used: false,
				ubigeos: [],
				indice: 6,
				isActive: 0
			}
		],
		rows: [
			{
				id: '1',
				use: { id: 1, description: 'Particular', order: 1, isActive: true },
				description: 'Automóvil Excepto modelos especiales',
				feeZone: [
					{
						idZone: '3926',
						premium: {
							fisico: 100,
							fisicoRenovacion: 200,
							digital: 300,
							digitalRenovacion: 400
						},
						commission: {
							commission: 1000
						},
						isActive: 0
					},
					{
						idZone: '2625',
						premium: {
							fisico: 101,
							fisicoRenovacion: 201,
							digital: 301,
							digitalRenovacion: 401
						},
						commission: {
							commission: 2000
						},
						isActive: 0
					},
					{
						idZone: '2812',
						premium: {
							fisico: 102,
							fisicoRenovacion: 202,
							digital: 302,
							digitalRenovacion: 402
						},
						commission: {
							commission: 1
						},
						isActive: 0
					},
					{
						idZone: '2900',
						premium: {
							fisico: 103,
							fisicoRenovacion: 203,
							digital: 303,
							digitalRenovacion: 403
						},
						commission: {
							commission: 1
						},
						isActive: 0
					},
					{
						idZone: '3020',
						premium: {
							fisico: 104,
							fisicoRenovacion: 204,
							digital: 304,
							digitalRenovacion: 404
						},
						commission: {
							commission: 1
						},
						isActive: 0
					}
				],
				isActive: true,
				indice: 1
			}
		]
	}; */

	get(): Observable<Fee> {
		return new Observable(observer => {
			observer.next(this.tarifa);
			observer.complete();
		});
	}
}
