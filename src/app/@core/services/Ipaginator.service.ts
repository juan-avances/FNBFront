import { Observable } from 'rxjs';
import { JsonResult } from '../models/jsonresult.model';
import { PrimeTableResponse } from '../models/prime-table.model';
import { EnviromentService } from './enviroment.service';

export interface IPaginatorService {
  _enviromentService: EnviromentService;
  getAll(paginator: any): Observable<JsonResult<PrimeTableResponse>>;
  updateState(id: number, status: boolean): Observable<JsonResult<any>>;
  delete(id: number): Observable<JsonResult<any>>;
  add(rowData: any);
}
