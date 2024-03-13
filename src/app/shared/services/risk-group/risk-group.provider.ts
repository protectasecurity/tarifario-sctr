import { Observable } from 'rxjs';
import { RiskGroup } from '../../models/risk-group.model';

export interface RiskGroupProvider {
	create(value: RiskGroup): void;
	reorder(value: RiskGroup[], userSelectedId: string): Observable<Response>;
	list(): Observable<RiskGroup[]>;
	getById(riskGroupId: string): Observable<RiskGroup>;
}
