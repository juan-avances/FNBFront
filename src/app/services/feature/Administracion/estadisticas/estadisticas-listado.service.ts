import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTable } from '../../../../@core/models/prime-table.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';
import { map, filter } from 'rxjs/operators';
import { EstadisticasListInit } from '../../../../models/estadistica.model';
import { EstadisticaService } from '../../../backend/estadisticas.service';
import { Option } from '../../../../@core/models/option.model';
import { GlobalService } from '../../../global.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasListadoService {
  constructor(public _global: GlobalService, public _estadisticaService: EstadisticaService, public _router: Router) {
    // super(new FeatureListConfig('ConsultaHistorial', '/ConsultaHistorial'),
    //   _estadisticaService, _router);
  }

  callbackInitAsync(): Observable<any> {
    return this._estadisticaService.initList().pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  getConfigTable(): PrimeTable {
    return {
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: false,
        showIndex: true,
        showEdit: false,
        accionesWidth: 0,
        showStateColor: true
      },
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'fechaCreacion',
          header: 'Fecha',
          order: false
        },
        {
          field: 'hora',
          header: 'Hora',
          order: false
        },
        {
          field: 'dni',
          header: 'DNI',
          order: false,
          visible: this._global.validarPermiso('VERDNI')
        },
        {
          field: 'nombre',
          header: 'Nombre',
          order: false
        },
        {
          field: 'usuario',
          header: 'Usuario',
          order: false
        },
        {
          field: 'canalVenta',
          header: 'Canal',
          order: false
        },
        {
          field: 'aliadoComercial',
          header: 'Aliado',
          order: false,
          visible: this._global.validarPermiso('VERALIEST')
        },
        {
          field: 'sede',
          header: 'Sede',
          order: false
        }
      ]
    };
  }

  descargarLazyEvent(event: LazyLoadEvent, filters: any, id?: number) {
    this._estadisticaService
      .descargarConsultaHistorial(filters, this._global.validarPermiso('VERDNI'))
      .subscribe(blobFile => {
        this.save(
          new Blob([blobFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          'EstadisticasConsultas.xlsx'
        );
      });
  }

  descargarConsultaHistorial(event: LazyLoadEvent, dtFilter: Table) {
    const primerNgFilter = Object.assign(
      {
        columnas: [],
        globalFilter: '1',
        sortField: 'Id',
        first: 0,
        rows: 9999999,
        sortOrder: 1
        // filters: this.dataTable.filters
      },
      event
    );
    this.descargarLazyEvent(event, primerNgFilter);
  }

  save(blob, fileName) {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (isIEOrEdge) {
      // For IE:
      navigator.msSaveBlob(blob, fileName);
    } else {
      // For other browsers:
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  }
  obtenerSedesAliado(aliadoComercialId: number): Observable<Option[]> {
    return this._estadisticaService.obtenerSedesAliado(aliadoComercialId).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }
  getListasIniciales(): EstadisticasListInit {
    return <EstadisticasListInit>{
      canalesVenta: [],
      sede: [],
      aliadosComerciales: [],
      rangoHoras: [],
      totalConsulta: 0,
      porcentajeConsulta: 0,
      totalConsultaVenta: 0,
      porcentajeConsultaVentas: 0,
      totalConsultaSinVentas: 0,
      porcentajeConsultaSinVentas: 0
    };
  }
}
