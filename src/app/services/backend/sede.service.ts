import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BranchOffice } from '../../models/sede.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';

@Injectable({
  providedIn: 'root'
})
export class SedeService extends Service<BranchOffice> {
  private commercialAllyController: string = 'commercialAlly';
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'branchOffice');
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filtros}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getSede(id: string): Observable<JsonResult<any>> {
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
  getAvailableCommercialAllyList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getAvailableCommercialAllyList`;
    return this.http.get<JsonResult<any>>(url);
  }

  getCommercialAllyProveedorList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}/Financiamiento/0/1/aliadoproveedor`;
    return this.http.get<JsonResult<any>>(url);
  }


}
