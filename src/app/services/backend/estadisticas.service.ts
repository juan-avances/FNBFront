import { Injectable } from '@angular/core';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Estadistica } from '../../models/estadistica.model';
import { Option } from '../../@core/models/option.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService extends Service<Estadistica> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'ConsultaHistorial');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Estadistica>>(url);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  descargarConsultaHistorial(filters: any, verdni: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('filter', '');
    params = params.append('verdni', verdni);

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/exportReport`;
    return this.http.post(url, filters, { params: params, responseType: 'arraybuffer' });
  }
  obtenerSedesAliado(aliadoComercialId: number): Observable<JsonResult<Option[]>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/sedes/${aliadoComercialId}`;
    return this.http.get<JsonResult<Option[]>>(url);
  }


  exportExcelReportEstadistico(send: any,): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/exportexcelreportstatistical`;
    return this.http.post(url, send, {
      responseType: 'json',
      headers: new HttpHeaders({ timeout: `${1080000}` })
    });
  }
}
