import { Injectable } from '@angular/core';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { RolService } from './backend/rol.service';
import { summaryForJitName } from '@angular/compiler/src/aot/util';
import { json } from '@rxweb/reactive-form-validators';
import { JsonHubProtocol } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  ocultar: boolean = false;
  permisos: any;

  constructor(public _enviromentService: EnviromentService, public _rolService: RolService, public http: HttpClient) {}
 
  validarPermiso(id: string) {
   
    // if (this.isAdministradorWeb()) {
    //   return true;
    // } else {
      if (this.permisos == undefined || this.permisos == null) {
        return false;
      } else {
        var obj = this.permisos.find(p => p.codigo == id);
        return obj != undefined;
      }
    //}
  }

  permisosUsuario() {
    this.getPermisos().subscribe(res => {
      if (res.valid) {
        this.permisos = res.data;
      } else {
        swal({
          title: res.message,
          type: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    });
  }
  isAliado(): boolean {
    var EsAliado = JSON.parse(localStorage.getItem('EsAliado'));
    return EsAliado;
  }

  getPermisos(): Observable<any> {
    const url = this._enviromentService.urlBaseServicios + 'Seguridad/ObtenerPermisosxUsuario';
    return this.http.get(url);
  }

  isAdministradorWeb(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '1';
  }

  isAdministradorAliado(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '2';
  }

  isAdministradorSede(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '3';
  }

  isUsuarioVisualizador(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '7';
  }

  isGUsuariorWeb(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');    
    return rolUser == '8';
  }

  isGOperacionWeb(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');    
    return rolUser == '9';
  }

  isGMantenimientoWeb(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');    
    return rolUser == '10';
  }

  isVendedorRetailVolante(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');    
    return rolUser == '13';
  }

  isVendedorCSCVolante(): boolean {
    var rolUser = localStorage.getItem('IdRolUsuario');
    return rolUser == '14';
  }
}
