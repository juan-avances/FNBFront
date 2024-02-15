import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { GlobalService } from 'src/app/services/global.service';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { CategoryFeatureService } from 'src/app/services/feature.service.index';
import { CategoryService } from 'src/app/services/backend.service.index';
import { State } from 'src/app/@core/models/option.model';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: []
})
export class CategoryIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  formGroup: FormGroup;
  estado: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public categoryFeatureService: CategoryFeatureService,
    public _categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      code: [''],
      estado: [this.estado]
    });
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this.categoryFeatureService.getConfigTable());
  }

  search(control: string) {
    if (this.formGroup.valid) {
      switch (control) {
        case 'name': {
          this.dataTable.filter(this.formGroup.controls.name.value, 'name', 'contains');
          break;
        }
        case 'code': {
          this.dataTable.filter(this.formGroup.controls.code.value, 'code', 'equals');
          break;
        }
      }
    }
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    if (Object.entries(primerNgFilter.filters).length === 0 && this.formGroup.controls.estado.value != undefined) {
      primerNgFilter.filters = { estado: { value: this.estado, matchMode: 'equals' } };
    }
    this._categoryService.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this._categoryService.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();
    const filters = {
      estado: { value: this.formGroup.controls.estado.value, matchMode: 'equals' },
      name: { value: this.formGroup.controls.name.value, matchMode: 'contains' },
      code: { value: this.formGroup.controls.code.value, matchMode: 'contains' }
    };
    if (this.formGroup.controls.estado.value === undefined) {
      delete filters['estado'];
    }
    const a = this.loadLazy({
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
