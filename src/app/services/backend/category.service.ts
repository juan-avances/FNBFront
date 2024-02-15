import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from '../../@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends Service<Category> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'category');
  }
  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filtros}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getSedes(id: string): Observable<JsonResult<any>> {
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

  getEstadoCarga(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/getEstadoCarga/${id}`;
    return this.http.get<JsonResult<any>>(url);
  }
  getAllCategoria(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllCategory`;
    return this.http.get<JsonResult<Category>>(url);
  }

  getAllCategoriaForPortal(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllCategoryForPortal`;
    return this.http.get<JsonResult<Category>>(url);
    
  }

  getCategoriaCanalIni(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/CategoriaCanalInit`;
    return this.http.get<JsonResult<any>>(url); 
  }

  getObtenerModalidad(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ModalidadEntregaPorCanal/${id}`;
    return this.http.get<JsonResult<any>>(url); 
  }

  getPermisosCategoria(idCanal: any): Observable<JsonResult<any>> {
    //debugger;
    let params = new HttpParams();

    if(idCanal){
      params = params.append('idCanal', idCanal);
    }
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetPermisosCategoria`;
    return this.http.get<JsonResult<any>>(url, { params: params }); 
  }

  saveCanales(entity: any): Observable<JsonResult<any>>
  {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/AsignarPermisosCategoria`;
    return this.http.post<JsonResult<any>>(url, entity);
  }
}
