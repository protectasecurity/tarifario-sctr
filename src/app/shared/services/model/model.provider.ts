import { Observable } from "rxjs";
import { IModel } from "../../models/model.model";

export interface ModelProvider {
  list(clazzId: number, branchId): Observable<IModel>;
  getById(classId: number, branchId: number, modelId: number): Observable<IModel>;
}
