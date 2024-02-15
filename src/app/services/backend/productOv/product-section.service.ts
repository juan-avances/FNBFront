import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ProductSection } from 'src/app/models/virtualOficce/productSection.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSectionService extends Service<ProductSection> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'ProductSectionOV');
  }
  loadLazyFilter(filter:ParamaterFilter): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<any>>(url, filter);
  }
  getAllProductsSection(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllProductsSection`;
    return this.http.get<JsonResult<ProductSection>>(url);
  }
}
