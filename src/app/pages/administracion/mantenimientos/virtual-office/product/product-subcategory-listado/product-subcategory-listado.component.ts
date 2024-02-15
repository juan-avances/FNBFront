import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Column, LazyLoadEvent } from 'primeng/primeng';
import { State } from 'src/app/@core/models/option.model';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import { SubcategoryFeatureService } from 'src/app/services/feature/Administracion/producOv/subcategory/subcategory-feature.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-product-subcategory-listado',
  templateUrl: './product-subcategory-listado.component.html'
})
export class ProductSubcategoryListadoComponent implements OnInit {

  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  page: number = 0;
  size: number = 10;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  formGroup: FormGroup;
  estado: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public categoryFeatureService: SubcategoryFeatureService,
    public _subCategoryService: ProductSubcategoryService
  ) {}

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      description: [''],     
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
        case 'description': {
          this.dataTable.filter(this.formGroup.controls.description.value, 'description', 'contains');
          break;
        }       
      }
    }
  }
  getListFilter(){
    let param=new ParamaterFilter
    param.Name =this.formGroup.controls.description.value;
    param.Status=this.formGroup.controls.estado.value;
    param.Page=this.page;
    param.Size=this.size;
    this._subCategoryService.loadLazyFilter(param).subscribe(response => {     
      if (response.valid) {        
        this.dataEntity.data = response.data.list;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }
  loadLazy(event: LazyLoadEvent) { 
    this.page = event.first
    this.size = event.rows;
    this.getListFilter();
  }

  updateState(stateModel: State) {
    this._subCategoryService.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();    
    this.loadLazy({    
      first: 0,     
      rows: options.rows   
    });
  }

}
