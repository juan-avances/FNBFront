import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cliente } from '../../models/cliente.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService extends Service<Cliente> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'cliente');
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getV(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/visualizar/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  getLineaCredito(numeroDocumento: any, tipoDoc: any): Observable<JsonResult<any>> {
    let params = new HttpParams();
    if (numeroDocumento) {
      params = params.append('numeroDocumento', numeroDocumento);
    }

    if (tipoDoc) {
      params = params.append('tipoDocumento', tipoDoc);
    }

    const url = `${this._enviromentService.urlBaseServicios}financiamiento/lineaCredito`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  InitConsultaCredito(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}financiamiento/InitConsultaCredito`;
    return this.http.get<JsonResult<any>>(url);
  }
}
