import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { FileUpload64 } from '../../models/fileUpload64.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends Service<Producto> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'mantenimiento/Producto');
  }

  loadLazyFilterWithfilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter/${filtros}`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  getProducto(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}financiamiento/${id}/productos`;
    return this.http.get<JsonResult<any>>(url);
  }

  refreshProducto(id: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/updateProductoState/${id}`;
    return this.http.put<JsonResult<string>>(url, { id });
  }

  confirmProducto(id: number): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/confirmarProductoState/${id}`;
    return this.http.put<JsonResult<string>>(url, { id });
  }

  exportProducto(id: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/export/${id}`;
    return this.http.put<JsonResult<any>>(url, { id });
  }

  disabledProduct(base64: FileUpload64): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}Producto/desablilitarProductos`;
    return this.http.post<JsonResult<string>>(url, base64);
  }
}
