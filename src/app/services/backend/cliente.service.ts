import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../../models/cliente.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends Service<Cliente> {
 
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'cliente');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Cliente>>(url);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  get(id: any): Observable<JsonResult<Cliente>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id ? id : ''}`;
    
    return this.http.get<JsonResult<Cliente>>(url);
  }

  getLineaCredito(id: any, tipoDoc: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}financiamiento/lineaCredito/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  validacionReniec(model: any)
  {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ValidacionReniec`;
    return this.http.post<JsonResult<any>>(url, model, { headers: new HttpHeaders({ timeout: `${1080000}` }) });
  }

  usuariosValidadores()
  {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/UsuariosValidadores`;
    return this.http.get<JsonResult<any>>(url, { headers: new HttpHeaders({ timeout: `${1080000}` }) });
  }
  
  ConsultarConsentimientoCliente(req: any): Observable<JsonResult<any>> {
    const url =`${this._enviromentService.urlBaseServicios}Financiamiento/ConsultarConsentimientoCliente`;
    return this.http.post<JsonResult<any>>(url, req, { headers: new HttpHeaders({ timeout: `${1080000}` }) });
  }
}
