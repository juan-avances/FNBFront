import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { Service } from 'src/app/@core/services/service.service';
import { DataSheet } from 'src/app/models/virtualOficce/dataSheet.model';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ParametersDto, Product } from 'src/app/models/virtualOficce/product.model';
import { ProductFee } from 'src/app/models/virtualOficce/productFee.model';
import { ProductServiceDto } from 'src/app/models/virtualOficce/productService.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends Service<Product> {
 
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'ProductOV');
  }
  loadLazyFilter(model:ParamaterFilter): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<any>>(url, model);
  }
  getAllProductsFee(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllProductsFee`;
    return this.http.get<JsonResult<ProductFee>>(url);
  }
  uploadMasiiveFile(file:DataSheet): Observable<JsonResult<any>> {

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/UploadMasiveProducts`;
    return this.http.post<JsonResult<DataSheet>>(url, file);
  }
  DataSheetDownLoad(parameters:DataSheet){

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/DataSheetDownload`;
    let headers = new HttpHeaders();
    headers = headers.append("Accept", "application/pdf");
    return this.http.post(url,parameters,{headers: headers,responseType: 'blob'})
   }
   
  uploadFile(file:DataSheet): Observable<JsonResult<any>> {

    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/UploadFile`;
    return this.http.put<JsonResult<DataSheet>>(url, file);

  }
  getListServices(): Observable<JsonResult<any>> {
    
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetAllServices`;
    return this.http.get<JsonResult<ProductServiceDto>>(url);

  }

  postGetPrecioCuota(model:any): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/GetPrecioCuota `;
    return this.http.post<any>(url, model);
  }

  getDownloadFile(): Observable<any> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/ExportarReporteProducto`;
    
    return this.http.post(url, null, { responseType: 'blob' });
  }
}
