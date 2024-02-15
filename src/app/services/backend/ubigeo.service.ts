import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ubigeo } from '../../models/ubigeo.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService extends Service<Ubigeo> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'mantenimiento/sede');
  }

  getUbigeo(nivel, id): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Financiamiento/ubigeo`;

    let params = new HttpParams();
    if (nivel) {
      params = params.append('nivel', nivel);
    }

    if (id) {
      params = params.append('id', id);
    }

    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  getAllUbigeo(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}BranchOffice/getAllUbigeo`;
    return this.http.get<JsonResult<Ubigeo>>(url);
  }

  getUbigeoPeru(nivel: any, codDep: any, codPro:any): Observable<JsonResult<any>>
  {
    const url = `${this._enviromentService.urlBaseServicios}Cliente/ubigeo`;

    let params = new HttpParams();
    if (nivel) {
      params = params.append('nivel', nivel);
    }

    if (codDep) {
      params = params.append('codDep', codDep);
    }

    if (codPro) {
      params = params.append('codPro', codPro);
    }

    return this.http.get<JsonResult<any>>(url, { params: params });
  }
}
