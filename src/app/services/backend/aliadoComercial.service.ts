import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AliadoComercial } from '../../models/aliadoComercial.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from '../../@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class AliadoComercialService extends Service<AliadoComercial> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'commercialAlly');
  }

  loadLazyFilter(paginator: any, orderby: boolean): Observable<JsonResult<PrimeTableResponse>> {    
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${orderby}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getSedes(id: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getSedes/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  limitDate(id: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}/limitDate/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  getCategoria(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getCategoria`;
    return this.http.get<JsonResult<any>>(url);
  }

  getCodigoAsesorr(id: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getCodigoAsesor/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  getAliado(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getAliado`;
    return this.http.get<JsonResult<any>>(url);
  }

  getEstadoCarga(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getEstadoCarga/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }

  orderByProviders(id: boolean): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/orderByProvider/${id}`;    
    return this.http.get<JsonResult<any>>(url);
  }
}
