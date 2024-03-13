import { Observable } from 'rxjs';
import { Brand } from '../../models/brand.model';

export interface BranchProvider {
	list(clazzId: number): Observable<Brand>;
	getById(classId: number, branchId: number): Observable<Brand>;
}
