import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Column, LazyLoadEvent } from 'primeng/primeng';
import { State } from 'src/app/@core/models/option.model';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { AppConstant } from 'src/app/constants/app.constant';
import { Category } from 'src/app/models/category.model';
import { ParamaterFilter } from 'src/app/models/virtualOficce/parameterFilters.model';
import { ParametersDto, Product } from 'src/app/models/virtualOficce/product.model';
import { ProductBrand } from 'src/app/models/virtualOficce/productBrand.model';
import { ProductSubCategory } from 'src/app/models/virtualOficce/productSubCategory.model';
import { CategoryService } from 'src/app/services/backend/category.service';
import { ProductBrandService } from 'src/app/services/backend/productOv/product-brand.service';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import { ProductService } from 'src/app/services/backend/productOv/product.service';
import { ProductFeatureService } from 'src/app/services/feature/Administracion/producOv/product/product-feature.service';
import { GlobalService } from 'src/app/services/global.service';
import swal from 'sweetalert2';
import { ModalMasiveProductsDetailComponent } from '../modal-masive-products-detail/modal-masive-products-detail.component';
import { ProductUploadMasiveComponent } from '../product-upload-masive/product-upload-masive.component';

@Component({
  selector: 'app-product-listado',
  templateUrl: './product-listado.component.html'
})
export class ProductListadoComponent implements OnInit {

  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  page: number = 0;
  size: number = 10;

  dataEntity: PrimeTable;
  visibleColumns: Column[];
  productDataSource = new MatTableDataSource<Product>();
  formGroup: FormGroup;
  idmarca=-1
  idsubcategoria=-1
  categoryFnbId=-1;
  estado: number = 1;
  BrandList: ProductBrand[];
  CategoryFnbList: Category[]; 
  SubCategoryList: ProductSubCategory[];
  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public productFeatureService: ProductFeatureService,
    public _productService: ProductService,
    public _productBrandService:ProductBrandService,
    public _productSubCategoryService:ProductSubcategoryService,
    private _categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      name: [''],
      codeSap:[''],
      subCategoria :[this.idsubcategoria],    
      marca: [this.idmarca],
      estado:[this.estado],
      categoryFnbId: [this.categoryFnbId]
    });
  }

  init(table: PagingGridComponent): PrimeTable {
   this.loadBrand();
   this.loadCategoryFnb();
   this.loadSubCategory();
    this.dataTable = table;
    return (this.dataEntity = this.productFeatureService.getConfigTable());
  }

  loadCategoryFnb(){
    this._categoryService.getAllCategoria().subscribe(
      (response) => {
       
        if (response.valid)
        this.CategoryFnbList =response.data;
      }
    );
  }

  search(control: string) {    
    if (this.formGroup.valid) {      
      switch (control) {
        case 'name': {
          this.dataTable.filter(this.formGroup.controls.name.value, 'nombre', 'contains');
          break;
        }
        case 'codeSap': {
          this.dataTable.filter(this.formGroup.controls.codeSap.value, 'codigoSap', 'contains');
          break;
        }         
      }
    }
  }
  getListFilter(){
    let param=new ParamaterFilter()    
    param.Name=this.formGroup.controls.name.value;
    param.Code=this.formGroup.controls.codeSap.value; 
    param.SubCategoryId=this.formGroup.controls.subCategoria.value;
    param.BrandId=this.formGroup.controls.marca.value;
    param.Status=this.formGroup.controls.estado.value;
    param.CategoryFnbId=this.formGroup.controls.categoryFnbId.value;
    param.Page=this.page;
    param.Size=this.size;
    this._productService.loadLazyFilter(param).subscribe(response => {            
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
    this._productService.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }
  resetearOrdenProductos(){
    this._productService.resetearOrdenProductos().subscribe(response => {
      if (response.valid) {        
        swal('Éxito', '"Se ha reseteado los productos"', 'success');
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

  loadSubCategory() {

    this._productSubCategoryService.getAllProductsSubCategory().subscribe(
      (response) => {      
        if (response.valid)
          this.SubCategoryList =response.data.filter(x=>x.state && x.productsCategories.code === AppConstant.FNB);
       }
    )

  }
  loadBrand() {

    this._productBrandService.getAllProductsBrand().subscribe(
      (response) => {

        if (response.valid)
          this.BrandList = response.data.filter(x=>x.state);

      }
    )

  }
  openMasiveModal() {
    const dialogRef = this.dialog.open(ProductUploadMasiveComponent,{disableClose :false})
    dialogRef.afterClosed().subscribe(
      (result) => {              
        if (result.valid) {
          swal('Éxito', '"Archivo cargado correctamente"', 'success');
          this.refreshGrid(this.dataTable);
        } else {
          this.dialog.open(ModalMasiveProductsDetailComponent, { data: result.data, disableClose: false })
          this.refreshGrid(this.dataTable);
        }
      });
  }

  downloadReport(){
    this._productService.getDownloadFile().subscribe(
      (blobFile) => {
        const url = window.URL.createObjectURL(blobFile);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'Productos.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
  }

  descargarArchivo(base64, filename, extension) {
    var binaryString = window.atob(base64); // Comment this if not using base64
    var bytes = new Uint8Array(binaryString.length);
    let buffer = bytes.map(function (byte, i) {
      return binaryString.charCodeAt(i);
    });


    var blob = new Blob([buffer]);
    var fileNameRESULT =  filename + "." + extension;


    var link = document.createElement("a");
    // Browsers that support HTML5 download attribute

    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileNameRESULT);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  }
}
