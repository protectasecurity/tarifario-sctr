import { Fee } from 'app/views/fee/models/fee.model';
import { Observable } from 'rxjs';

export interface FeeProvider {
	get(): Observable<Fee>;
}
