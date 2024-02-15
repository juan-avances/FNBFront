import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { Column, PrimeTable } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { GlobalService } from 'src/app/services/global.service';
import { State } from 'src/app/@core/models/option.model';
import { StoreAllyListService } from 'src/app/services/feature/Administracion/store-ally/store-ally-list.service';
import { StoreAllyService } from 'src/app/services/backend/store-ally.service';

@Component({
  selector: 'app-store-ally-index',
  templateUrl: './store-ally-index.component.html',
  styleUrls: []
})
export class StoreAllyIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  visibleColumns: Column[];
  estado: number = 1;
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public storeAllyListService: StoreAllyListService,
    public storeAllyService: StoreAllyService
  ) {}

  ngOnInit() {
    this.createForm();
    this.init(this.dataTable);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [Validators.minLength(3), Validators.maxLength(100), Validators.pattern(ExpressionValidation.LetterNumberSign)]
      ],
      estado: [this.estado]
    });
  }

  init(table: PagingGridComponent): void {
    this.dataTable = table;
    this.dataEntity = this.storeAllyListService.getConfigTable();
  }

  search(control: string) {
    if (this.formGroup.valid) {
      if(control === 'nombre'){
        this.dataTable.filter(this.formGroup.controls.nombre.value, 'nombre', 'contains');
      }
    }
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);

    if (Object.entries(primerNgFilter.filters).length === 0 && this.formGroup.controls.estado.value != undefined) {
      primerNgFilter.filters = { estado: { value: this.estado, matchMode: 'equals' } };
    }

    this.storeAllyService.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this.storeAllyService.updateState(stateModel.id, stateModel.state).subscribe(response => {
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
