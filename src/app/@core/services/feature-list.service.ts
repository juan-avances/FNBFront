import { PrimeTable } from '../models/prime-table.model';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/primeng';
import { FeatureListConfig } from '../models/feature-list.model';
import { Observable } from 'rxjs';
import { IFeatureListService } from './Ifeature-list.service';
import { EMPTY } from 'rxjs';
import { IPaginatorService } from './Ipaginator.service';

export abstract class FeatureListService<TEntity> implements IFeatureListService {
  protected dataEntidad: PrimeTable;
  protected dataTable: Table;
  public ready: boolean;

  filters: any;
  constructor(public _config: FeatureListConfig, 
    public _entidadService: IPaginatorService, public _router: Router) { }

  abstract getConfigTable(): PrimeTable;

  init(table: Table): PrimeTable {
   

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

  async loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntidad.columnas, globalFilter: '' }, event);

      if (this.ready) {
        let response = await this._entidadService.getAll(primerNgFilter).toPromise();

        if (response.valid) {  
          this.dataEntidad.data = response.data.entities;
          this.dataEntidad.totalRegistros = response.data.count;  
        } 
    }    
  }

  refreshGrid(dataTable: Table) {

    this.loadLazy({
      filters: this.filters != undefined ? this.filters : {},
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

        this.filters = this.dataTable.filters;
        this.refreshGrid(this.dataTable);
      }
    });
  }

  delete(id: number) {
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
  }
}
