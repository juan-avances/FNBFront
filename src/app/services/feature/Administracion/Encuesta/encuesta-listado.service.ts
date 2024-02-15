import { Injectable } from '@angular/core';
import { PrimeTable } from '../../../../@core/models/prime-table.model';
import { EncuestaService } from '../../../backend.service.index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EncuestaListadoService {
  // dataTable: Table;
  // dataEncuesta: PrimeTable;
  // protected dataEntidad: PrimeTable;

  constructor(public _encuestaService: EncuestaService, public _router: Router, public _global: GlobalService) {
    // super(new FeatureListConfig('Encuesta', '/encuesta'), _encuestaService, _router);
  }

  callbackInitAsync(): Observable<any> {
    return this._encuestaService.initList().pipe(
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
        showChangeState: this._global.validarPermiso('ACTDESENC'),
        showIndex: true,
        showEdit: this._global.validarPermiso('EDIENC'),
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
        },
        {
          field: 'preguntas',
          header: 'Preguntas',
          order: false
        }
      ]
    };
  }

  goEditMode(motivoId: number) {
    this._router.navigate(['encuesta', motivoId]);
  }
}
