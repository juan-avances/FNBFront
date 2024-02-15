import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTableEditable, EditInlinePrimeTable } from '../../../../@core/models/prime-table.model';
import { CorreoService } from '../../../backend.service.index';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';
import { Correo } from 'src/app/models/correo.model';
import { map } from 'rxjs/operators';
import { FeatureListServiceEditable } from '../../../../@core/services/feature-list-editable.service';
import { AgregarProductoComponent } from 'src/app/pages/operaciones/financiamientos/agregar-producto/agregar-producto.component';

@Injectable({
  providedIn: 'root'
})
export class CorreoMantenimientoService extends FeatureListServiceEditable<Correo> {
  dataTable: Table;
  dataUsuario: EditInlinePrimeTable;
  protected dataEntidad: EditInlinePrimeTable;

  constructor(public _correoService: CorreoService, public _router: Router) {
    super(new FeatureListConfig('Correo', '/email'), _correoService, _router);
  }

  callbackInitAsync(): Observable<any> {
    return this._correoService.initList().pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  agregar(rowData: Correo) {
    this._correoService.add(rowData).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
        swal({
          title: `Se guardó satisfactoriamente el ${this._config.nombre.toLocaleLowerCase()}`,
          type: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: this._entidadService._enviromentService.timeOutNotifications
        });
      } else {
        swal({
          title: response.message,
          type: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    });
  }

  actualizar(rowData: Correo) {
    this._correoService.update(rowData.id, rowData).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
        swal({
          title: `Se guardó satisfactoriamente el ${this._config.nombre.toLocaleLowerCase()}`,
          type: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: this._entidadService._enviromentService.timeOutNotifications
        });
      } else {
        swal({
          title: response.message,
          type: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    });
  }
  saveElement(rowData: Correo) {
    rowData.estado = 1;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(rowData.email)) {
      if (Number.isInteger(rowData.id)) {
        this.actualizar(rowData);
      } else {
        rowData.id = 0;
        this.agregar(rowData);
      }
    } else {
      swal({
        title: `Ingrese un correo electrónico válido`,
        type: 'info',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: this._entidadService._enviromentService.timeOutNotifications
      });
    }
  }

  getConfigTable(): PrimeTableEditable {
    return {
      totalRegistros: 0,
      search: false,
      canAdd: true,
      canCheck: false,
      canDelete: true,
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false,
          order: true,
          editable: false,
          controlInput: 'input',
          controlOutput: 'div'
        },
        {
          field: 'email',
          header: 'Correo Electrónico',
          search: false,
          visible: true,
          order: false,
          editable: true,
          controlInput: 'input',
          controlOutput: 'div'
        }
      ]
    };
  }
}
