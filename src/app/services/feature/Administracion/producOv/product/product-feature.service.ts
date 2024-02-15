import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { AppConstant } from 'src/app/constants/app.constant';
import { Fee } from 'src/app/models/virtualOficce/fee.model';
import { ProductBrand } from 'src/app/models/virtualOficce/productBrand.model';
import { ProductSection } from 'src/app/models/virtualOficce/productSection.model';
import { ProductSubCategory } from 'src/app/models/virtualOficce/productSubCategory.model';
import { ProductsModalFichaTecnicaComponent } from 'src/app/pages/administracion/mantenimientos/virtual-office/product/products-modal-ficha-tecnica/products-modal-ficha-tecnica.component';
import { ProductBrandService } from 'src/app/services/backend/productOv/product-brand.service';
import { ProductSectionService } from 'src/app/services/backend/productOv/product-section.service';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import { ProductService } from 'src/app/services/backend/productOv/product.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductFeatureService {

  CategoryList: ProductSubCategory[];
  SectionList: ProductSection[];
  BrandList: ProductBrand[];
  SubCategoryList: ProductSubCategory[];
  FeeList: Fee[];

  ngOnInit() {
    this.loadCategory();
    this.loadBrand();   
    this.loadSubCategory();
    this.loadSections();
    this.loadProductFee();
  }
  constructor(
    public productService: ProductService,
    public _productBrandService: ProductBrandService,
    public _productSubCategoryService: ProductSubcategoryService,
    public _productSectionService:ProductSectionService,
     public router: Router,
     public dialog: MatDialog) {
  }
  
 getConfigTable(): PrimeTable {
   return {
     customOperations: [
       {
         title: 'Editar',
         icon: 'edit',
         type: 'Material',
         visibilidity: p => true,
         click: p => this.goEditMode(p.id)
       },
       {
        title: 'Ficha Tecnica',
         icon: 'cloud-dowload',
         type: 'Material',
         visibilidity: p => true,
         click: p => this.openDataSheet(p.id)
       }
      
     ],
     options: {
       showAdd: false,
       showSearch: false,
       showDelete: false,
       showChangeState: true,
       showIndex: true,
       showEdit: true,
       accionesWidth: 7
     },
     columnas: [
       {
         field: 'id',
         header: 'N°',
         search: false,
         visible: false
       },
       {
         field: 'nombre',
         header: 'Descripción',
         order: false,
         visible:true,
         search: true
       },
       {
        field: 'cuotaMes',
        header: 'Cuota/Mes',
        visible: true,
        order: false,
        width: 10
       },
       {
        field: 'precioOfv',
        header: 'Precio OFV',
        visible: true,
        order: false,
        width: 10
       },
       {
        field: 'codigoSap',
        header: 'SKU',
        visible: true,
        order: false,
        width: 10
       },
       {
        field: 'categoriaFnb',
        header: 'Categoría',
        visible: true,
        order: false,
        width: 10
       },
       {
        field: 'subCategoria',
        header: 'Sub Categoría',
        visible: true,
        order: false,
        width: 10
       },
       {
        field: 'marca',
        header: 'Marca',
        visible: true,
        order: false,
        width: 10
       }
     ]
   };
 }
 loadCategory() {

  this._productSubCategoryService.getAllProductsCategory().subscribe(
    (response) => {      
      if (response.valid)
        this.CategoryList =response.data.filter(function(element) {         
          return element.code === AppConstant.FNB; 
        });       
      }
   );

}

  loadSubCategory() {
    this._productSubCategoryService.getAllProductsSubCategory().subscribe(
      (response) => {
        if (response.valid){
          this.SubCategoryList = response.data.filter((x: any) => x.state 
            && x.productsCategories.code === AppConstant.FNB);
        }
      }
    )

  }

loadBrand() {

  this._productBrandService.getAllProductsBrand().subscribe(
    (response) => {

      if (response.valid)
        this.BrandList = response.data.filter(x=>x.state);;
     

    }
  )

}
loadSections() {
 
  this._productSectionService.getAllProductsSection().subscribe(
    (response) => {       
      if (response.valid)
        this.SectionList = response.data.filter(x=>x.state);
   }
  )
}

loadProductFee() {
  this.productService.getAllProductsFee().subscribe(
    (response) => {             
      if (response.valid) {           
        this.FeeList = response.data.filter(x=>Number(x.description)<=60);          
      }
    }
  )

}
 goEditMode(id: number) {
   this.router.navigate(['product-edicion', id]);
 }
 openDataSheet(id: number) {

  this.productService.get(id).subscribe(
    (response) => {
  const dialogRef = this.dialog.open(ProductsModalFichaTecnicaComponent,
    {
      data: {
        BrandList: this.BrandList, SectionList: this.SectionList,
        CategoryList: this.CategoryList, SubCategoryList: this.SubCategoryList,
        FeeList: this.FeeList,
        Product: response.data[0]
      },disableClose :false
    });

  dialogRef.afterClosed().subscribe(
    (result) => {

      if (result.data.valid)
      this.router.navigate(['/product-listado']);
      swal('La operación se realizó satisfactoriamente', 'Archivo cargado correctamente', 'success');       

    });
    }
  )
}
}
