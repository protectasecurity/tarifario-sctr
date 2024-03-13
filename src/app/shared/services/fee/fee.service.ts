import { Inject, Injectable } from '@angular/core';
import { Fee } from 'app/views/fee/models/fee.model';
import { Observable } from 'rxjs';
import { FeeInMemoryProvider } from '../../inmemory-db/fee-in-memory.provider';
import { FeeProvider } from './fee.provider';

@Injectable()
export class FeeService {
	constructor(@Inject(FeeInMemoryProvider) private feeProvider: FeeProvider) {}

	get(): Observable<Fee> {
		return this.feeProvider.get();
	}
}
