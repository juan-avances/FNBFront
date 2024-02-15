import { Injectable } from '@angular/core';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HELPER } from 'src/app/constants/helper';

@Injectable({
  providedIn: 'root'
})
export class UsuarioListadoService {

  paramFilterSerialize: string;
  constructor(public _usuarioService: UsuarioService, public _router: Router, public _global: GlobalService) {
    // super(new FeatureListConfig('Usuario', '/usuario'), _usuarioService, _router);
  }

  callbackInitAsync(): Observable<any> {

    return this._usuarioService.initList().pipe(
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
          visibilidity: p => this._global.validarPermiso('EDIUSU'),
          click: p => this.goEditMode(p.userKey)
        },
        {
          title: 'Eliminar',
          icon: 'delete',
          type: 'Material',
          visibilidity: p => p.id != localStorage.getItem('id') && this._global.validarPermiso('ELIUSU'),
          click: p => this.goDelete(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: true,
        showChangeState: this._global.validarPermiso('ACTDESUSU'),
        showIndex: true,
        showEdit: this._global.validarPermiso('EDIUSU'),
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
          field: 'aliadoComercial',
          header: 'Aliado Comercial',
          order: false
        },
        {
          field: 'sede',
          header: 'Sede',
          order: false
        },
        {
          field: 'usuario',
          header: 'Usuario',
          order: false
        },
        {
          field: 'dni',
          header: 'N° de Documento',
          order: false
        },
        {
          field: 'nombreCompleto',
          header: 'Nombre Completo',
          order: false
        },
        {
          field: 'correo',
          header: 'Correo',
          order: false
        },
        { 
          field: 'rol',
          header: 'Rol',
          order: false
        },
        {
          field: 'estadoTexto',
          header: 'Estado',
          order: false,
          visible: !this._global.validarPermiso('ACTDESUSU')
        }
      ]
    };
  }

  goEditMode(motivoId: number) {
    const HELP_PARAM = HELPER.b64EncodeUnicode(
      this.paramFilterSerialize
    );

    this._router.navigate(['usuario', motivoId], {
      queryParams: {
        obj: HELP_PARAM
      },
      queryParamsHandling: "merge"
    });
  }

  goDelete(Id: number) {
    swal({
      text: '¿Estás seguro de eliminar usuario? ',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {        
        this._usuarioService.deleteUser(Id).subscribe(response => {
          if (response.valid) {
            this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => this._router.navigate(['/listado-usuario']));
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }


}
