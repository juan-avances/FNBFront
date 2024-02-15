import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { Router } from '@angular/router';
import { FeatureListService } from '../../../../@core/services/feature-list.service';
import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { AliadoComercial } from '../../../../models/aliadoComercial.model';

import { AliadoComercialService } from '../../../backend/aliadoComercial.service';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AliadoComercialListadoService {
  // dataTable: Table;
  // dataAliado: PrimeTable;
  // aliado: AliadoComercial;
  // estadoCarga: string;
  // protected dataEntidad: PrimeTable;

  constructor(
    public _aliadoComercialService: AliadoComercialService,
    public _router: Router,
    public _global: GlobalService
  ) {
    // super(
    //   new FeatureListConfig('commercialally', '/commercial-ally-form'),
    //   _aliadoComercialService,
    //   _router
    // );
  }

  callbackInitAsync(): Observable<any> {
    // return this._aliadoComercialService.initList().pipe(
    //   map(response => {
    //     if (response.valid) {
    //       return response.data;
    //     }
    //   })
    // );
    return null;
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => true,
          click: p => this.goEditMode(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: true,
        showIndex: true,
        showEdit: true,
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
          field: 'ruc',
          header: 'RUC',
          order: false,
          search: true
        },
        {
          field: 'businessName',
          header: 'Nombre comercial',
          order: false,
          search: true
        }
      ]
    };
  }

  goEditMode(id: number) {
    this._router.navigate(['commercial-ally-form', id]);
  }
}
