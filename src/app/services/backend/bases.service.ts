import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { Base } from '../../models/bases.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class BasesService extends Service<Usuario> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'usuario');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Bases/BasesCargadas`;
    return this.http.get<JsonResult<Base>>(url);
  }

  get(id: any): Observable<JsonResult<Usuario>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id ? id : ''}`;
    return this.http.get<JsonResult<Usuario>>(url);
  }

  getPermisos(id: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id}/permisos`;
    return this.http.get<JsonResult<any>>(url);
  }

  getPerfiles(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Seguridad/initPerfiles`;
    return this.http.get<JsonResult<any>>(url);
  }

  exportarBase(base: any): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}Bases/exportar`;
    return this.http.post(url, base, { responseType: 'blob' });
  }

  getAccionesPermisos(
    //idCanal: number,
    idAliado: number
  ): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Seguridad/ObtenerPermisosxAliado?IdAliadoComercial=${idAliado}`; //IdCanalVenta=${idCanal}&
    return this.http.get<JsonResult<any>>(url);
  }

  updatePassword(id: number, entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/updatePassword/${id}`;
    return this.http.put<JsonResult<any>>(url, entity);
  }

  loadLazyFilter(paginator: any): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}Bases/filterBasesCargadas`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }
}
