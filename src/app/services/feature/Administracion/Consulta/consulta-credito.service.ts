import { Injectable } from '@angular/core';
import { FeatureListService } from 'src/app/@core/services/feature-list.service';
import { FinanciamientoPagination } from 'src/app/models/financiamiento.model';
import { Table } from 'primeng/table';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { Router } from '@angular/router';
import { FeatureListConfig } from 'src/app/@core/models/feature-list.model';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ConsultaService } from 'src/app/services/backend.service.index';
import { GlobalService } from 'src/app/services/global.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCreditoService {
  dataTable: Table;
  dataUsuario: PrimeTable;
  protected dataEntidad: PrimeTable;

  constructor(public _consultaService: ConsultaService, public _global: GlobalService, public _router: Router) {}

  init(): Observable<any> {
    return this._consultaService.InitConsultaCredito().pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  consultaCredito(param: string, tipoDoc: string): Observable<any> {
    return this._consultaService.getLineaCredito(param, tipoDoc).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  // processParamRequest_Credito(observer, param: string, tipoDoc: string) {
  //   //EN ESTA LINEA DE CODIGO  SE GENERA EL ERROR

  //   this._consultaService.getLineaCredito(param, tipoDoc).subscribe(response => {
  //     if (response.valid) {
  //       if (response.data != null) {
  //         document.getElementById('sectionHidden').hidden = false;
  //       }
  //       observer.next({
  //         lineaCredito: response.data.lineaCredito,
  //         dataCliente: response.data,
  //         ctasContrato: response.data.cuentasContrato
  //       });
  //     }
  //   });
  // }

  redirectFinanciamiento(id: number, consulta: number) {
    this._router.navigate([`financiamientos`, id, { consulta: consulta }]);
  }
}
