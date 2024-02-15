import { Injectable } from '@angular/core';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TreeNode } from 'primeng/primeng';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  controller = 'Seguridad';

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) { }

  init(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}`;
    return this.http.get<JsonResult<any>>(url);
  }

  obtenerPermisos(
    aliadoComercialId: string //, canalVentaId: string
  ): Observable<JsonResult<any>> {
    let params = new HttpParams();
    params = params.append('idAliadoComercial', aliadoComercialId);
    // params = params.append('idCanalVenta', canalVentaId);

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ObtenerPermisosxAliado`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  setPerfiles(entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/AsignarPermisos`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  initCanales(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Canales`;
    return this.http.get<JsonResult<any>>(url);
  }

  obtenerCanales(aliadoComercialId: string): Observable<JsonResult<any>> {
    let params = new HttpParams();
    params = params.append('idAliadoComercial', aliadoComercialId);

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ObtenerCanalesxAliado`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  setCanales(entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/AsignarCanales`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  obtenerMenu(idPadre: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ObtenerMenu/${idPadre}`;
    return this.http.get<JsonResult<any>>(url);
  }

  olvideContrasena(usuario: string, tipo: number, latitud: string, longitud: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/OlvidarContrasena`;
    return this.http.post<JsonResult<any>>(url, {
      usuario,
      tipo,
      latitud,
      longitud
    });
  }

  restaurarContrasena(entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/RestaurarPassword`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  AccesoMenu(menu: any): Observable<JsonResult<boolean>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/AccesoMenu/${menu}`;
    return this.http.get<JsonResult<any>>(url);
  }
}
