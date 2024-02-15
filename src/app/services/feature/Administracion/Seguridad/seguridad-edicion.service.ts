import { Injectable } from '@angular/core';
import { SeguridadService } from 'src/app/services/backend.service.index';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { TreeNode } from 'primeng/primeng';

@Injectable({
  providedIn: 'root'
})
export class SeguridadEdicionService {
  constructor(public _seguridadService: SeguridadService) {}

  init(): Observable<any> {
    return this._seguridadService.init().pipe(
      map(response => {
        if (response.valid) {
          response.data.roles = response.data.roles.map(rol => {
            return {
              ...rol,
              state: true
            };
          });

          return response.data;
        }
      })
    );
  }

  obtenerPermisos(
    aliadoComercialId: number //, canalVentaId: number
  ): Observable<any> {
    return this._seguridadService
      .obtenerPermisos(
        aliadoComercialId.toString() //, canalVentaId.toString()
      )
      .pipe(
        map(response => {
          if (response.valid) {
            return response.data;
          }
        })
      );
  }

  save(permisos: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.setParentNull(permisos.listaAcciones);

        const resultadoServicio = this._seguridadService.setPerfiles(permisos);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  setParentNull(nodos: TreeNode[]) {
    if (!nodos) {
      return;
    }

    nodos.forEach(item => {
      if (item.children) {
        this.setParentNull(item.children);
      }

      item.parent = null;
    });
  }

  initCanales(): Observable<any> {
    return this._seguridadService.initCanales().pipe(
      map(response => {
        if (response.valid) {
          response.data.canalVentas = response.data.canalVentas.map(canal => {
            return {
              ...canal,
              state: true
            };
          });

          return response.data;
        }
      })
    );
  }

  obtenerCanales(aliadoComercialId: number): Observable<any> {
    return this._seguridadService.obtenerCanales(aliadoComercialId.toString()).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  saveCanales(canales: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.setParentNull(canales.listaAcciones);

        const resultadoServicio = this._seguridadService.setCanales(canales);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  obtenerMenu(idPadre: number): Observable<any> {
    return this._seguridadService.obtenerMenu(idPadre).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }
}
