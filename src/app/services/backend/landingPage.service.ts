 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';


@Injectable({
  providedIn: 'root'
})
export class LandingPageService extends Service<LandingPageService> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'LandingPage');
  }
  registraCategoriaCall(data: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Call/Categoria`;
    return this.http.post<JsonResult<any>>(url, data);
  }
  updateCategoriaCall(data: any): Observable<JsonResult<any>> {
     const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Call/Categoria`;
     return this.http.put<JsonResult<any>>(url, data);
   }
  getCategoriaCall(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Call/Categoria`;
    return this.http.get<JsonResult<any>>(url);
  }
  getConfigCall()  : Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Call/Config`;
    return this.http.get<JsonResult<any>>(url);
  }
  updateConfigCall(data): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/Call/Config`;
    return this.http.put<JsonResult<any>>(url, data);
  }  
}
