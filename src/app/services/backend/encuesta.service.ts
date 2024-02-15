import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Encuesta } from '../../models/encuesta.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService extends Service<Encuesta> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'encuesta');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Encuesta>>(url);
  }

  get(id: any): Observable<JsonResult<Encuesta>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id ? id : ''}`;
    return this.http.get<JsonResult<Encuesta>>(url);
  }

  getLast(): Observable<JsonResult<Encuesta>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/last`;
    return this.http.get<JsonResult<Encuesta>>(url);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  setRespuestas(entity: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/respuestaEncuesta`;
    return this.http.post<JsonResult<any>>(url, entity);
  }
}
