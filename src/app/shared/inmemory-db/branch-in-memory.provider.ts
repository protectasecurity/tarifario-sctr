import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';
import { BranchProvider } from '../services/brand/branch.provider';

/* @Injectable()
export class BranchInMemoryProvider implements BranchProvider {
	private branches: Brand[] = [
		{ id: 1, description: 'TOYOTA' },
		{ id: 2, description: 'HYUNDAI' },
		{ id: 3, description: 'KIA' },
		{ id: 4, description: 'CHEVY' }
	];

	getById(classId: number, branchId: number): Observable<Brand> {
		return new Observable(observer => {
			const val = this.branches.filter(value => value.id === branchId)[0];
			observer.next(val);
			observer.complete();
		});
	}

	list(clazzId: number): Observable<Brand> {
		return new Observable(observer => {
			this.branches.forEach(value => {
				observer.next(value);
			});
			observer.complete();
		});
	}
}
 */
