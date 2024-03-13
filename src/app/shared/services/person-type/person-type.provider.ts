import { Observable } from "rxjs";
import { IPersonType } from "../../models/person-type.model";

export interface PersonTypeProvider {
  list(): Observable<IPersonType[]>;
  getById(personTypeId: number): Observable<IPersonType>;
}
