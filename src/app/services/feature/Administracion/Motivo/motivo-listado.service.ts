import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Motivo } from 'src/app/models/motivo.model';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import { FeatureListService } from 'src/app/@core/services/feature-list.service';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { FeatureListConfig } from 'src/app/@core/models/feature-list.model';
import { MotivoService } from 'src/app/services/backend.service.index';

@Injectable({
  providedIn: 'root'
})
export class MotivoListadoService {
  // dataTable: Table;
  // dataEncuesta: PrimeTable;
  // protected dataEntidad: PrimeTable;

  constructor(public _motivoService: MotivoService, public _router: Router, public _global: GlobalService) {
    // super(new FeatureListConfig('Motivo', '/motivo'), _motivoService, _router);
  }

  callbackInitAsync(): Observable<any> {
    return this._motivoService.initList().pipe(
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
          visibilidity: p => this._global.validarPermiso('EDIMOT'),
          click: p => this.goEditMode(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: this._global.validarPermiso('ACTDESMOT'),
        showIndex: true,
        showEdit: this._global.validarPermiso('EDIMOT'),
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
          field: 'codigo',
          header: 'Código',
          order: false
        },
        {
          field: 'nombre',
          header: 'Nombre',
          order: false
        }
      ]
    };
  }

  goEditMode(motivoId: number) {
    this._router.navigate(['motivo', motivoId]);
  }
}
