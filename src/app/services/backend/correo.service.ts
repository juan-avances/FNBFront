import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Correo } from '../../models/correo.model';
import { Service } from '../../@core/services/service.service';
import { JsonResult } from '../../@core/models/jsonresult.model';
import { Observable } from 'rxjs';
import { PrimeTableResponse } from '../../@core/models/prime-table.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { EmailShipment } from '../../models/email-shipment';

@Injectable({
  providedIn: 'root'
})
export class CorreoService extends Service<Correo> {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
    super(_enviromentService, http, 'email');
  }

  initList(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/list`;
    return this.http.get<JsonResult<Correo>>(url);
  }

  loadLazyFilter(paginator: any, filtros: string): Observable<JsonResult<PrimeTableResponse>> {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/filter`;
    return this.http.post<JsonResult<PrimeTableResponse>>(url, paginator);
  }

  sendEmail(data: EmailShipment) {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/sendEmail`;
    return this.http.post<JsonResult<any>>(url, data);
  }
  initEmailSender() {
    const url = `${this._enviromentService.urlBaseServicios}${this.controller}/initEmailSender`;
    return this.http.get<JsonResult<any>>(url);
  }
}
