import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ProductSubCategory } from 'src/app/models/virtualOficce/productSubCategory.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSubcategoryService extends Service<ProductSubCategory> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'ProductSubCategoryOV');
  }
  loadLazyFilter(model:ParamaterFilter): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<any>>(url, model);
  }
  getAllProductsSubCategory(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllProductsSubCategory`;
    return this.http.get<JsonResult<ProductSubCategory>>(url);
  }
  getAllProductsCategory(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllProductsCategory`;
    return this.http.get<JsonResult<ProductSubCategory>>(url);
  }
}
