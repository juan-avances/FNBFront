import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { Rol } from 'src/app/models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService extends Service<Rol>{

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'rol');
  }

  initList(esAliado : any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    let params = new HttpParams();
    if (esAliado) {
      params = params.append('esAliado', esAliado);
    }

    return this.http.get<JsonResult<any>>(url, { params: params });
 
  }
}
