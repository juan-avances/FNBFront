import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { EnviromentService } from '../../@core/services/enviroment.service';
import { Configuracion } from 'src/app/models/configuracion';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';

@Injectable({
  providedIn: 'root'
})
export class OfflineService extends Service<Configuracion> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'offline');
  }
  getConfiguraciones(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ObtenerParametros`;
    return this.http.get<JsonResult<any>>(url);
  }
  postActualizarConfiguracion(conf: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/RegistrarParametros`;
    return this.http.post<JsonResult<any>>(url,conf);
  }


  deleteOffline(idfinanciamiento: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/EliminarFinanciamientoOffline`;
    return this.http.post<JsonResult<any>>(url,idfinanciamiento);
  }

  getListarFinanciamientoOffline(paginator: any): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ListarFinanciamientoOffline`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url,paginator);
  }

  postRegistrarParametrosOffline(data: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/RegistrarParametrosOffline`;
    return this.http.post<JsonResult<any>>(url,data);
  }

  postRegistrarVigenciaOffline(data:any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/RegistrarVigenciaOfflineAuthorize`;
    return this.http.post<JsonResult<any>>(url,data);
  }

  getObtenerParametrosOffline(codigo: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ObtenerParametrosOffline/${codigo}`;
    return this.http.get<JsonResult<any>>(url);
  }
  
}
