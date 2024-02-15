import { Injectable } from '@angular/core';
import { Service } from '../../@core/services/service.service';
import { HttpClient } from '@angular/common/http';
import { Archivo } from '../../models/archivo.model';
import { Observable } from 'rxjs';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { FileUpload64 } from '../../models/fileUpload64.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService extends Service<Archivo> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'cargaArchivo');
  }

  addAliadoComercial(base64: FileUpload64): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}AliadoComercial/archivoAliado`;
    return this.http.post<JsonResult<string>>(url, base64);
  }

  getArchivo(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Archivo/archivoini`;
    return this.http.get<JsonResult<string>>(url);
  }

  getCanalCarga(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Financiamiento/list`;
    return this.http.get<JsonResult<string>>(url);
  }
  getRolCanalVenta( idAliadoComercial: number): Observable<JsonResult<any>>  {
      const url = `${this._enviromentService.urlBaseServicios}archivo/GetRolCanalVenta`;
      return this.http.get<JsonResult<any>>(url, {params: { idAliadoComercial: idAliadoComercial.toString() } });
    }
}
