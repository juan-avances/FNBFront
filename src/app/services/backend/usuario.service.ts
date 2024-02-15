import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends Service<Usuario> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'usuario');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Usuario>>(url);
  }

  get(id: any): Observable<JsonResult<Usuario>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id ? id : ''}`;
    return this.http.get<JsonResult<Usuario>>(url);
  }

  getByUserName(user: string)
  {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Obtener/${user}`;
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

  exportarUsuario(usuario: any): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/exportar`;
    return this.http.post(url, usuario, { responseType: 'blob' });
  }

  getAccionesPermisos(
    //idCanal: number,
    idAliado: number
  ): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Seguridad/ObtenerPermisosxAliado?IdAliadoComercial=${idAliado}`; //IdCanalVenta=${idCanal}&
    return this.http.get<JsonResult<any>>(url);
  }

  updatePassword(id: any, entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/updatePassword/${id}`;
    return this.http.put<JsonResult<any>>(url, entity);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  deleteUser(id:number): Observable<JsonResult<any>>{
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/delete/${id}`;
    return this.http.delete<JsonResult<any>>(url);
  }

  changeBranch(id: number, idSede: number): Observable<JsonResult<any>>{
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/changeBranch/${id}/${idSede}`;
    return this.http.put<JsonResult<any>>(url,null);
  }
  usuariosValidadores()
  {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/UsuariosValidadores`;
    return this.http.get<JsonResult<any>>(url, { headers: new HttpHeaders({ timeout: `${1080000}` }) });
  }
}
