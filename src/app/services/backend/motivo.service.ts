import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { Motivo } from 'src/app/models/motivo.model';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { Option } from 'src/app/@core/models/option.model';

@Injectable({
  providedIn: 'root'
})
export class MotivoService extends Service<Motivo> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'Motivo');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Motivo>>(url);
  }

  get(id: any): Observable<JsonResult<Motivo>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id ? id : ''}`;
    return this.http.get<JsonResult<Motivo>>(url);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  obtenerMotivos() {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/obtenerMotivos`;
    return this.http.get<JsonResult<Option[]>>(url);
  }
}
