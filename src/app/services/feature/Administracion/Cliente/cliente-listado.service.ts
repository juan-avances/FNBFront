import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { ClienteService } from '../../../backend.service.index';
import { Router } from '@angular/router';
import { FeatureListService } from '../../../../@core/services/feature-list.service';
import { Cliente } from '../../../../models/cliente.model';
import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { ProductoService } from '../../../backend/producto.service';
import { Producto } from '../../../../models/producto.model';
import swal from 'sweetalert2';
import { FinanciamientoService } from '../../../backend/financiamiento.service';
import { Financiamiento } from '../../../../models/financiamiento.model';
import { ClienteEdicionService } from './cliente-edicion.service';
import { saveAs } from 'file-saver';
import { GlobalService } from 'src/app/services/global.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteListadoService {
  // dataTable: Table;
  // dataUsuario: PrimeTable;
  // protected dataEntidad: PrimeTable;

  // lista: Producto[];
  // total: string = '0';

  constructor(
    public _clienteService: ClienteService,
    // public _productoService: ProductoService,
    // public _clienteEdicionServicio: ClienteEdicionService,
    // public _financiamientoService: FinanciamientoService,
    public _router: Router,
    public _global: GlobalService
  ) {
    // super(new FeatureListConfig('Cliente', '/cliente'), _clienteService, _router);
  }

  callbackInitAsync(): Observable<any> {
    return this._clienteService.initList().pipe(
      map(response => {
        if (response.valid) {
          return response.data;
 
        }
      })
    );
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => this._global.validarPermiso('EDICLI'),
          click: p => this.goEditMode(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        //showChangeState: this._global.validarPermiso('ACTDESCLI'),
        showIndex: true,
        showEdit: this._global.validarPermiso('EDICLI'),
        accionesWidth: 7
      },
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'nombreTipoDocumento',
          header: 'Tipo Documento',
          order: false
        },
        {
          field: 'tipoDocumento',
          header: 'Tipo Documento',
          visible: false
        },
        {
          field: 'nroDocumento',
          header: 'Nº Documento',
          order: false
        },
        {
          field: 'cliente',
          header: 'Cliente',
          order: false
        },
        {
          field: 'lineaCreditoActualizada',
          header: 'Linea de Crédito Actual',
          order: false
        }
      ]
    } as PrimeTable;
  }

  goEditMode(motivoId: number) {
    this._router.navigate(['cliente', motivoId]);
  }
}
