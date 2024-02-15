import { Injectable } from '@angular/core';
import { FinanciamientoArchivo } from 'src/app/models/financiamientoArchivo.model';
import { Service } from 'src/app/@core/services/service.service';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PrimeTableResponse } from 'src/app/@core/models/prime-table.model';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { catchError, retry } from 'rxjs/operators';
import { DocumentoComentario } from 'src/app/models/financiamiento.model';

@Injectable({
  providedIn: 'root'
})
export class FinanciamientoArchivoService extends Service<FinanciamientoArchivo>{
 
 
  desactivarPromocion(id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'financiamientoArchivo');
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  insertDocumentoComentarios(documentoComentarios: DocumentoComentario[]) : Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/documentoComentarios`;
    return this.http.post<any>(url, documentoComentarios);
  }
  download(id: number): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/download/${id}`;
    return this.http.get(url);
  }

  downloadList(idsFinanciamientoArchivo: number[]) {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/downloadList`;
    return this.http.post<any>(url, idsFinanciamientoArchivo)
    .pipe(
      retry(3),
      catchError(this.handleError));
  }
  private handleError(error: any) {
    return throwError(() => new Error('Error en la solicitud'));
  }
}
