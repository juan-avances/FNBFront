import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { TiendaAliada } from 'src/app/models/tienda-aliada.model';

@Injectable({
  providedIn: 'root'
})
export class StoreAllyService extends Service<TiendaAliada> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'tiendaAliada');
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filtros}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getSedes(tiendaAliadaId: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/sede/${tiendaAliadaId}`;
    return this.http.get<JsonResult<any>>(url);
  }
}
