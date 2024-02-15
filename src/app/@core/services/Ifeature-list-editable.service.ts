import { EditInlinePrimeTable, PrimeTableEditable } from '../models/prime-table.model';
import { Table } from 'primeng/table';
import { Observable, Subscriber } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';

export interface IFeatureListServiceEditable {
  // getConfigTable(): PrimeTable;
  init(table: Table): EditInlinePrimeTable | PrimeTableEditable;
  initAsync(table: Table): Observable<any>;
  callbackInitAsync(observer: Subscriber<any>);
  loadLazy(event: LazyLoadEvent);
  refreshGrid(dataTable: Table);
  redirectRegister(id?: number);
  delete(id: number): EditInlinePrimeTable | PrimeTableEditable;
  updateStatus(id: number, state: boolean);
  saveElement(rowData: any);
}
