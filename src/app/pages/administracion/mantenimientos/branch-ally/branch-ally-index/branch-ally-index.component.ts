import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { State } from 'src/app/@core/models/option.model';
import { Column, PrimeTable } from 'src/app/@core/models/prime-table.model';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { TiendaAliada } from 'src/app/models/tienda-aliada.model';
import { BranchAllyService } from 'src/app/services/backend/branch-ally.service';
import { BranchAllyListService } from 'src/app/services/feature/Administracion/branch-ally/branch-ally-list.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-branch-ally-index',
  templateUrl: './branch-ally-index.component.html',
  styleUrls: []
})
export class BranchAllyIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  visibleColumns: Column[];
  estado: number = 1;
  formGroup: FormGroup;
  tiendaAliadaList: TiendaAliada[];
  tiendaAliadaListFiltered: Observable<TiendaAliada[]>;
  
  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public branchAllyFeatureService: BranchAllyListService,
    private branchAllyService: BranchAllyService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAvailableCommercialAllyList();
    this.init(this.dataTable);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      nombre: [''],
      tiendaAliadaNombre: [],
      estado: [this.estado]
    });
  }

  search(control: string) {
    if (this.formGroup.valid) {
      switch (control) {
        case 'nombre': {
          this.dataTable.filter(this.formGroup.controls.nombre.value, 'nombre', 'contains');
          break;
        }
        case 'tiendaAliadaId': {
          this.dataTable.filter(
            this.formGroup.controls.tiendaAliadaNombre.value,
            'tiendaAliadaNombre',
            'contains'
          );
          break;
        }
      }
    }
  }

  getAvailableCommercialAllyList() {
    this.branchAllyService.getAllTiendaAliada().subscribe((response: any) => {
      this.tiendaAliadaList = response.data;
      this.tiendaAliadaListFiltered = this.formGroup.controls.tiendaAliadaNombre.valueChanges.pipe(
        debounceTime(300),
        map(value => this.filterCommercialAlly(value))
      );
    });
  }

  private filterCommercialAlly(value: string): TiendaAliada[] {
    const filterValue = value.toLowerCase();
    return this.tiendaAliadaList.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  init(table: PagingGridComponent): void {
    this.dataTable = table;
    this.dataEntity = this.branchAllyFeatureService.getConfigTable();
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);

    if (Object.entries(primerNgFilter.filters).length === 0 && this.formGroup.controls.estado.value != undefined) {
      primerNgFilter.filters = { estado: { value: this.estado, matchMode: 'equals' } };
    }

    this.branchAllyService.loadLazyFilter(primerNgFilter, '').subscribe((response: any) => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this.branchAllyService.updateState(stateModel.id, stateModel.state).subscribe((response: any) => {
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
