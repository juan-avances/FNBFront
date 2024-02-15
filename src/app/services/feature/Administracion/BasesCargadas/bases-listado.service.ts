import { Injectable } from '@angular/core';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import { BasesService } from 'src/app/services/backend/bases.service';


@Injectable({
  providedIn: 'root'
})
export class BasesListadoService {
  constructor(public _usuarioService: UsuarioService, public _basesService: BasesService, public _router: Router, public _global: GlobalService) {
    // super(new FeatureListConfig('Usuario', '/usuario'), _usuarioService, _router);
  }

   callbackInitAsync(): Observable<any> {

    return this._basesService.initList().pipe(
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
          title: 'Descargar',
          icon: 'cloud_download',
          type: 'Material',
          visibilidity: p => this._global.validarPermiso('DESBASCAR'),
          click: p => this.goDownloadMode(p)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: this._global.validarPermiso('ACTDESBASCAR'),
        showIndex: true,
        showEdit: false,
        accionesWidth: 7
      },
      columnas: [
        {
          field: 'idBaseCargada',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'nombreBaseCargada',
          header: 'Bases Cargadas de Precios',
          order: false
        },
        {
          field: 'nombreComercial',
          header: 'Aliado Comercial',
          order: false
        },
        {
          field: 'canal',
          header: 'Canal',
          order: false
        },
        {
          field: 'cantidadSkus',
          header: 'Cantidad de SKUs',
          order: false
        },
        {
          field: 'fechaCarga',
          header: 'Fecha de Carga',
          order: false
        },
        {
          field: 'fechaVencimiento',
          header: 'Fecha de Vencimiento',
          order: false
        },
       
      ]
    };
  }

  
  goDownloadMode(data: any) {
    
    var objeto={
      codBaseCargada:data.idBaseCargada
    }
    this._basesService.exportarBase(objeto).subscribe(blobFile => {
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = data.nombreBaseCargada;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  /*
  exportarUsuario(usuario: any) {
    this._usuarioEdicionService.exportarDocumento(usuario);
  }*/
}
