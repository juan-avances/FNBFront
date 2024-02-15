import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { State } from 'src/app/@core/models/option.model';
import { BranchOfficeFeatureService } from 'src/app/services/feature.service.index';
import { SedeService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-branch-office-index',
  templateUrl: './branch-office-index.component.html',
  styleUrls: []
})
export class BranchOfficeIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  visibleColumns: Column[];
  estado: number = 1;
  formGroup: FormGroup;
  commercialAllyList: AliadoComercial[];
  filteredCommercialAllyList: Observable<AliadoComercial[]>;
  currentCommercialAllyId?: number;
  
  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public branchOfficeFeatureService: BranchOfficeFeatureService,
    private branchOfficeService: SedeService
  ) {}

  ngOnInit() {
    this.currentCommercialAllyId = isNaN(parseInt(localStorage.getItem('IdAliado')))
      ? null
      : parseInt(localStorage.getItem('IdAliado'));
    this.createForm();
    this.getAvailableCommercialAllyList();
    this.dataEntity = this.init(this.dataTable);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      address: [''],
      commercialAllyBusinessName: [],
      estado: [this.estado]
    });
  }

  search(control: string) {
    if (this.formGroup.valid) {
      switch (control) {
        case 'name': {
          this.dataTable.filter(this.formGroup.controls.name.value, 'name', 'contains');
          break;
        }
        case 'address': {
          this.dataTable.filter(this.formGroup.controls.address.value, 'address', 'contains');
          break;
        }
        case 'commercialAllyId': {
          this.dataTable.filter(
            this.formGroup.controls.commercialAllyBusinessName.value,
            'commercialAllyBusinessName',
            'contains'
          );
          break;
        }
      }
    }
  }

  getAvailableCommercialAllyList() {
    this.branchOfficeService.getAvailableCommercialAllyList().subscribe(response => {
      this.commercialAllyList = response.data.entities;
      this.filteredCommercialAllyList = this.formGroup.controls.commercialAllyBusinessName.valueChanges.pipe(
        debounceTime(300),
        map(value => this.filterCommercialAlly(value))
      );
      if (this.currentCommercialAllyId != null) {
        this.formGroup.controls.commercialAllyBusinessName.patchValue(
          this.commercialAllyList.find(p => p.id == this.currentCommercialAllyId).businessName
        );
      }
    });
  }

  private filterCommercialAlly(value: string): AliadoComercial[] {
    const filterValue = value.toLowerCase();
    return this.commercialAllyList.filter(option => option.businessName.toLowerCase().includes(filterValue));
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this.branchOfficeFeatureService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);

    if (Object.entries(primerNgFilter.filters).length === 0 && this.formGroup.controls.estado.value != undefined) {
      primerNgFilter.filters = { estado: { value: this.estado, matchMode: 'equals' } };
    }

    this.branchOfficeService.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  updateState(stateModel: State) {
    this.branchOfficeService.updateState(stateModel.id, stateModel.state).subscribe(response => {
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
