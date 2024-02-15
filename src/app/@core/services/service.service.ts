import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonResult } from '../models/jsonresult.model';
import { PrimeTableResponse } from '../models/prime-table.model';
import { FileUpload64 } from '../../models/fileUpload64.model';
import { EnviromentService } from './enviroment.service';
import { IPaginatorService } from './Ipaginator.service';

export abstract class Service<T> implements IPaginatorService {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient, public controller: string) { }

  getAll(paginator: any): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }
//
  getAllWithParameters(paginator: any, filters: string): Observable<JsonResult<PrimeTableResponse>> {
    if (filters === '') {
      filters = null;
    }
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filters}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  loadExcel(entity: FileUpload64): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Archivo`;
    return this.http.post<JsonResult<any>>(url, entity, { headers: new HttpHeaders({ timeout: `${1080000}` }) });
  }

  cargaMasiva(entity: T): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}Financiamiento/BuscarArchivosFinanciamiento`;
    return this.http.post(url, entity, { responseType: 'blob' });
  }

  get(id: any): Observable<JsonResult<T>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id}`;
    return this.http.get<JsonResult<T>>(url);
  }

  add(entity: T): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}`;

    return this.http.post<JsonResult<any>>(url, entity);
  }

  addManual(entity: T): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/CargarProductManual`;

    return this.http.post<JsonResult<any>>(url, entity);
  }


  addArchivo(entity: any[]): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}`;



    return this.http.post<JsonResult<any>>(url, entity);
  }

  update(id: number, entity: T): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id}`;
    return this.http.put<JsonResult<any>>(url, entity);
  }

  delete(id: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${id}`;
    return this.http.delete<JsonResult<any>>(url);
  }

  deleteFile(filename: string): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/${filename}`;
    return this.http.get<JsonResult<any>>(url);
  }

  setPerfiles(entity: T): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Seguridad/AsignarPermisos`;
    return this.http.post<JsonResult<any>>(url, entity);
  }

  updateState(id: number, status: boolean): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/updateStatus/${id}`;
    return this.http.put<JsonResult<any>>(url, { id: id, Estado: status });
  }

  updateStateBases(id: number, status: boolean): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Bases/updateStatus/${id}`;
    return this.http.put<JsonResult<any>>(url, { id: id, Estado: status });
  }

  getExistSAP(CodigoSAP: any): Observable<JsonResult<T>> {
    var b64 = btoa(CodigoSAP);
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetExistCodigoSAP/${b64}`;    
    return this.http.get<JsonResult<T>>(url);
  }

  resetearOrdenProductos(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/resetOrdenToZero`;
    return this.http.post<JsonResult<any>>(url,null);
  }

}
