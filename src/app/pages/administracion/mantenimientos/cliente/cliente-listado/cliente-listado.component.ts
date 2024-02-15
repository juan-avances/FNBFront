import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Option, State } from '../../../../../@core/models/option.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { ClienteService } from 'src/app/services/backend.service.index';
import { ClienteListadoService } from 'src/app/services/feature.service.index';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'app-listado-cliente',
  templateUrl: './cliente-listado.component.html',
  styles: []
})
export class ClienteListadoComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  tiposDocumento: Option[];

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _clienteListadoService: ClienteListadoService,
    public _clienteService: ClienteService,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this.dataEntity = this.init(this.dataTable);
    this._clienteListadoService.callbackInitAsync().subscribe(response => {
      this.tiposDocumento = response.tiposDocumento;
    });
  }

  changeTipoDocumento(event, dataTable: any) {
    dataTable.filter(event.value, 'tipoDocumento', 'equals');
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._clienteListadoService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);

    this._clienteService.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this._clienteService.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();

    this.loadLazy({
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }
}
