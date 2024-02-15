import { PrimeTableEditable, EditInlinePrimeTable } from '../models/prime-table.model';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Service } from './service.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { FeatureListConfig } from '../models/feature-list.model';
import { Observable, Subscriber } from 'rxjs';
import { IFeatureListServiceEditable } from './Ifeature-list-editable.service';
import { EMPTY } from 'rxjs';
import { IPaginatorService } from './Ipaginator.service';

export abstract class FeatureListServiceEditable<TEntity> implements IFeatureListServiceEditable {
  protected dataEntidad: EditInlinePrimeTable | PrimeTableEditable;
  protected dataTable: Table;

  constructor(public _config: FeatureListConfig, public _entidadService: IPaginatorService, public _router: Router) {}

  abstract getConfigTable(): EditInlinePrimeTable | PrimeTableEditable;

  init(table: Table): EditInlinePrimeTable | PrimeTableEditable {
    this.dataTable = table;
    return (this.dataEntidad = this.getConfigTable());
  }

  initAsync(table: Table): Observable<any> {
    this.init(table);

    return this.callbackInitAsync();
  }

  callbackInitAsync(): Observable<any> {
    return EMPTY;
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntidad.columnas, globalFilter: '' }, event);

    this._entidadService.getAll(primerNgFilter).subscribe(resp => {
      if (resp.valid) {
        this.dataEntidad.data = resp.data.entities;
        this.dataEntidad.totalRegistros = resp.data.count;
      }
    });
  }
  refreshGrid(dataTable: Table) {
    this.loadLazy({
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: dataTable.rows,
      sortField: dataTable.sortField,
      sortOrder: dataTable.sortOrder
    });
  }

  redirectRegister(id?: number) {
    if (!id) {
      this._router.navigate([`${this._config.urlEdit}`]);
    } else {
      this._router.navigate([`${this._config.urlEdit}`, id]);
    }
  }

  updateStatus(id: number, state: boolean) {
    this._entidadService.updateState(id, state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  saveElement(rowData: any) {
    swal({
      title: 'Implementar saveElement',
      type: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000
    });
  }

  delete(id: number): EditInlinePrimeTable | PrimeTableEditable {
    swal({
      title: `${this._config.nombre}`,
      text: `¿Estás seguro de eliminar el ${this._config.nombre.toLocaleLowerCase()}?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this._entidadService.delete(id).subscribe(response => {
          if (response.valid) {
            this.refreshGrid(this.dataTable);
            swal({
              title: `Se eliminó satisfactoriamente el ${this._config.nombre.toLocaleLowerCase()}`,
              type: 'success',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: this._entidadService._enviromentService.timeOutNotifications
            });
          } else {
            swal({
              title: `${response.message}`,
              type: 'warning',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: this._entidadService._enviromentService.timeOutNotifications
            });
          }
        });
      }
    });
    return this.dataEntidad;
  }
  deleteLocalValue(id: number) {
    this.dataEntidad = this.dataEntidad.data.filter(function(value) {
      return value.id !== id;
    });
  }
}
