import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ProductBrand } from 'src/app/models/virtualOficce/productBrand.model';

@Injectable({
  providedIn: 'root'
})
export class ProductBrandService extends Service<ProductBrand> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'ProductBrandOV');
  }
  loadLazyFilter(model:ParamaterFilter): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<any>>(url, model);
  }
  getAllProductsBrand(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllProductsBrand`;
    return this.http.get<JsonResult<ProductBrand>>(url);
  }
}