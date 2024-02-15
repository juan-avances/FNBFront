import { PrimeTable } from '../models/prime-table.model';
import { Table } from 'primeng/table';
import { Observable, Subscriber } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';

export interface IFeatureListService {
  // getConfigTable(): PrimeTable;
  init(table: Table): PrimeTable;
  initAsync(table: Table): Observable<any>;
  callbackInitAsync(observer: Subscriber<any>);
  loadLazy(event: LazyLoadEvent);
  refreshGrid(dataTable: Table);
  redirectRegister(id?: number);
  delete(id: number);
  updateStatus(id: number, state: boolean);
}
