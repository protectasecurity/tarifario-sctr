/* import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IModel, Model } from '../models/models.models';
import { ModelProvider } from '../services/models/models.provider';

@Injectable()
export class ModelInMemoryProvider implements ModelProvider {
	private models: Model[] = [
		{ id: 1, description: 'RAV4', descriptionBrand: '', brand: { id: 1, description: 'TOYOTA' } },
		{ id: 2, description: 'YARIS', descriptionBrand: '', brand: { id: 1, description: 'TOYOTA' } },
		{ id: 3, description: 'TUCSON', descriptionBrand: '', brand: { id: 2, description: 'HYUNDAI' } },
		{ id: 4, description: 'SANTA FE', descriptionBrand: '', brand: { id: 2, description: 'HYUNDAI' } },
		{ id: 5, description: 'RIO', descriptionBrand: '', brand: { id: 3, description: 'KIA' } },
		{ id: 6, description: 'SPORTAGE', descriptionBrand: '', brand: { id: 3, description: 'KIA' } },
		{ id: 7, description: 'MONTECARLO', descriptionBrand: '', brand: { id: 4, description: 'CHEVY' } },
		{ id: 8, description: 'AVEO', descriptionBrand: '', brand: { id: 4, description: 'CHEVY' } },
		{ id: 9, description: 'BELEAR', descriptionBrand: '', brand: { id: 4, description: 'CHEVY' } }
	];

	getById(classId: number, branchId: number, modelId: number): Observable<IModel> {
		return new Observable(observer => {
			const val = this.models.filter(value => value.id === modelId)[0];
			observer.next(val);
			observer.complete();
		});
	}

	list(clazzId: number, branchId: number): Observable<IModel> {
		return new Observable(observer => {
			this.models
				.filter(x => (x.brand.id = branchId))
				.forEach(value => {
					observer.next(value);
				});
			observer.complete();
		});
	}
}
 */
