import { Injectable } from '@angular/core';
import { PrimeTable, Column } from '../../../../@core/models/prime-table.model';
import { UsuarioService } from '../../../backend.service.index';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HELPER } from 'src/app/constants/helper';
import { MatDialog } from '@angular/material';
import { CambioSedeComponent } from 'src/app/pages/operaciones/cambio-sede/cambio-sede.component';

@Injectable({
  providedIn: 'root'
})
export class ConsultaUsuarioService {
  paramFilterSerialize: string;
  paramLoadLazy: any;
  refreshAfterUploadFile: any;
  constructor(public _usuarioService: UsuarioService, public _router: Router, public _global: GlobalService,public dialog: MatDialog,) { }
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
          title: 'Canbiar de sede',
          icon: 'cached',
          type: 'Material',
          visibilidity: p => p.sedeId && this._global.validarPermiso('CAMSEDUSU'),
          click: p => this.openChangeSedeModal(p.userKey)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: false,
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
          field: 'userKey',
          header: 'userKey',
          search: false,
          visible: false
        },
        {
          field: 'aliadoComercial',
          header: 'Aliado Comercial',
          order: false
        },
        {
          field: 'sedeId',
          header: 'SedeId',
          order: false,
          visible: false
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
          visible: true
        }
      ]
    };
  }

  OpenFinanciamientoReenvio(Id: number, nroPedidoVenta: string) {
    // const dialogRef = this.dialog.open(FinanciamientoReenviarComponent, {
    //   width: '50%',
    //   data: {
    //     financiamientoId: Id,
    //     nroPedidoVenta: nroPedidoVenta
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.refreshAfterUploadFile.loadLazy(this.paramLoadLazy)
    //   }
    // });
  }
  openChangeSedeModal(idUsuario: number) {
    var dialogRef = this.dialog.open(CambioSedeComponent, {
      disableClose: true,
      data: {
        idUsuario: idUsuario
      }
      // position: {
      //   top: ($event.clientY - 250)+'px'
      // }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshAfterUploadFile.loadLazy(this.paramLoadLazy)
      }
    });
  }
}
