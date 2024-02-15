import { Injectable } from '@angular/core';
import { Observable, Subscriber, BehaviorSubject, of } from 'rxjs';

//--
import { HttpClient, HttpParams } from '@angular/common/http';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
//--

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(public _enviromentService: EnviromentService, public http: HttpClient) {}

  obtenerLogos(): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}dashboard/init`;
    return this.http.get<JsonResult<any>>(url);
  }

  obtenerDatosPorAliado(aliadoComercialId: any): Observable<JsonResult<any>> {
    const url = `${this._enviromentService.urlBaseServicios}dashboard/getIndicadorAliadoComercial/${aliadoComercialId}`;
    return this.http.get<JsonResult<any>>(url);
  }

  obtenerDatosBarraAliadosPorFecha(fecha?: Date, channelId?: number): Observable<JsonResult<any>> {
    let params = new HttpParams();
    if (fecha) params = params.append('fecha', fecha.toString());
    if (channelId) params = params.append('channelId', channelId.toString());
    const url = `${this._enviromentService.urlBaseServicios}dashboard/getIndicadorBarraAliadosByFecha`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  obtenerDatosBarraAliadosPorSedes(aliadoComercialId: any, fecha: any, canalVentaId: any): Observable<JsonResult<any>> {
    let params = new HttpParams();

    if (aliadoComercialId) {
      params = params.append('AliadoComercialId', aliadoComercialId);
    }

    if (fecha) {
      params = params.append('fecha', fecha);
    }

    if (canalVentaId) {
      params = params.append('CanalVentaId', canalVentaId);
    }

    const url = `${this._enviromentService.urlBaseServicios}dashboard/getIndicadorBarraSedesByAliado`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }

  obtenerDatosDonaPorAliado(aliadoComercialId: any, fecha: any, canalVentaId: any): Observable<JsonResult<any>> {
    let params = new HttpParams();

    if (aliadoComercialId) {
      params = params.append('AliadoComercialId', aliadoComercialId);
    }

    if (fecha) {
      params = params.append('fecha', fecha);
    }

    if (canalVentaId) {
      params = params.append('CanalVentaId', canalVentaId);
    }

    const url = `${this._enviromentService.urlBaseServicios}dashboard/getDonaSedesByAliado`;
    return this.http.get<JsonResult<any>>(url, { params: params });
  }
  getAvailableCommercialAllyList() {
    const url = `${this._enviromentService.urlBaseServicios}dashboard/getAvailableCommercialAllyList`;
    return this.http.get<JsonResult<any>>(url);
  }
  getMonthlyFinancingSummary(date: Date, commercialAllyId?: number) {
    let params = new HttpParams();
    if (commercialAllyId) params = params.append('commercialAllyId', commercialAllyId.toString());
    if (date) {
      let stringDate = date.getFullYear() + '-' + String(date.getMonth() + 1) + '-' + date.getDate();
      params = params.append('date', stringDate);
    }
    const url = `${this._enviromentService.urlBaseServicios}dashboard/getMonthlyFinancingSummary`;
    return this.http.get<JsonResult<any>>(url, { params });
  }
  getMonthlyChartData(commercialAllyId?: number, channelId?: number, date?: Date) {
    let params = new HttpParams();
    if (commercialAllyId) params = params.append('commercialAllyId', commercialAllyId.toString());
    if (channelId) params = params.append('channelId', channelId.toString());
    if (date) {
      let stringDate = date.getFullYear() + '-' + String(date.getMonth() + 1) + '-' + date.getDate();
      params = params.append('date', stringDate);
    }
    const url = `${this._enviromentService.urlBaseServicios}dashboard/getChartData`;
    return this.http.get<JsonResult<any>>(url, { params });
  }
}
