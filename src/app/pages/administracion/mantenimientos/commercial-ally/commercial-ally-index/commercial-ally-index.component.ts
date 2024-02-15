import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { GlobalService } from 'src/app/services/global.service';
import { AliadoComercialListadoService } from 'src/app/services/feature/Administracion/AliadoComercial/aliadoComercial-listado.service';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { AliadoComercialService } from 'src/app/services/backend.service.index';
import { State } from 'src/app/@core/models/option.model';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-commercial-ally-index',
  templateUrl: './commercial-ally-index.component.html',
  styleUrls: []
})
export class CommercialAllyIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  visibleColumns: Column[];
  estado: number = 1;
  formGroup: FormGroup;
  public activeButtonOrderByInformation: boolean = false;
  public informationAlly: any;



  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public commercialAllyService: AliadoComercialListadoService,
    public _commercialAllyServicie: AliadoComercialService
  ) { }

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      businessName: [
        '',
        [Validators.minLength(3), Validators.maxLength(100), Validators.pattern(ExpressionValidation.LetterNumberSign)]
      ],
      ruc: ['', [Validators.minLength(11), Validators.maxLength(11), Validators.pattern(ExpressionValidation.Ruc)]],
      estado: [this.estado]
    });
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this.commercialAllyService.getConfigTable());
  }

  search(control: string) {
    if (this.formGroup.valid) {
      switch (control) {
        case 'businessName': {
          this.dataTable.filter(this.formGroup.controls.businessName.value, 'businessName', 'contains');
          break;
        }
        case 'ruc': {
          this.dataTable.filter(this.formGroup.controls.ruc.value, 'ruc', 'equals');
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

    this.informationAlly = primerNgFilter;

    this._commercialAllyServicie.loadLazyFilter(primerNgFilter, this.activeButtonOrderByInformation).subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });

  }

  updateState(stateModel: State) {
    this._commercialAllyServicie.updateState(stateModel.id, stateModel.state).subscribe(response => {
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

  orderByInformation() {
    this.activeButtonOrderByInformation = true;
    this._commercialAllyServicie.loadLazyFilter(this.informationAlly, this.activeButtonOrderByInformation).subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });

  }

  orderByInformationReciente() {

    this.activeButtonOrderByInformation = false;
    this._commercialAllyServicie.loadLazyFilter(this.informationAlly, this.activeButtonOrderByInformation).subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }
}
