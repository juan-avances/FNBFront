import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MotivoListadoService } from 'src/app/services/feature.service.index';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { LazyLoadEvent } from 'primeng/primeng';
import { MotivoService } from 'src/app/services/backend.service.index';
import { State } from 'src/app/@core/models/option.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listado-motivo',
  templateUrl: './motivo-listado.component.html',
  styles: []
})
export class MotivoListadoComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];
  estado: number = 1;
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public _activatedRoute: ActivatedRoute,
    public _motivoListadoService: MotivoListadoService,
    public _motivoServicio: MotivoService,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      estado: [this.estado]
    });
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._motivoListadoService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);

    if (Object.entries(primerNgFilter.filters).length === 0 && this.formGroup.controls.estado.value != undefined) {
      primerNgFilter.filters = { estado: { value: this.estado, matchMode: 'equals' } };
    }

    this._motivoServicio.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this._motivoServicio.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();
    const filters = {
      estado: { value: this.formGroup.controls.estado.value, matchMode: 'equals' }
    };

    this.loadLazy({
      filters: filters,
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }
}
