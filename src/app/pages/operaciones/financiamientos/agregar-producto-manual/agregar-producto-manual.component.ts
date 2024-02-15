import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Option } from '../../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { FinanciamientoListas, Producto, ProductoManual } from 'src/app/models/financiamiento.model';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { CategoryService, SedeService } from 'src/app/services/backend.service.index';
import { ProductCategory } from 'src/app/models/virtualOficce/productCategory.model';
import { Category } from 'src/app/models/category.model';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import swal from 'sweetalert2';
import { ProductManual } from 'src/app/models/virtualOficce/productManual.model';
import { ProductService } from 'src/app/services/backend/productOv/product.service';

@Component({
  selector: 'app-agregar-producto-manual',
  templateUrl: './agregar-producto-manual.component.html',
  styleUrls: ['./agregar-producto-manual.component.scss']
})
export class AgregarProductoManualComponent implements OnInit {

  forma: FormGroup;
  filteredOptions: Observable<Producto[]>;
  filteredOptions1: Observable<AliadoComercial[]>;
  aliadoId: number;
  stateActive:boolean=false;
  proveedores: Option[];
  @Input() listas: FinanciamientoListas;
 

  constructor(
    public _productService:ProductService,
    private formBuilder: FormBuilder,
    public _activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<AgregarProductoManualComponent>,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoryService: CategoryService,
    public _productSubCategoryService:ProductSubcategoryService,
    private _branchOfficeService: SedeService,
  ) {}

  CategoryList: ProductCategory[];
  product = new ProductManual

  CategoryFnbList: Category[]; 
  CategoryFnbIDValue: number;
  AliadoIDValue: number;
  commercialAllyList: AliadoComercial[];
  filteredCommercialAllyList: Observable<AliadoComercial[]>;
  currentCommercialAllyId?: number;
  date = new Date((new Date().getTime()));

  btnCerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

 
    this.loadCategoryFnb();
    this.loadProveedor();
    this.createFormProductRegister();
    this.setForm();
  
   
    this._financiamientoEdicionService
      .obtenerListaProveedores(this.data.aliadoId, this.data.canalId)
      .subscribe(response => {
        this.proveedores = response;
      });
   
           
            this.forma.controls['nombreProducto'].setValue(this.product.nombreProducto); 
            this.forma.controls['precio'].setValue(this.product.precio);
            this.forma.controls['sku'].setValue(this.product.sku);         
            this.forma.controls["idCategoria"].setValue(this.product.idCategoria);
            this.forma.controls["cantidad"].setValue(this.product.cantidad);
            this.forma.controls["aliadoComercial"].setValue(this.product.aliadoComercial);

            
           
            
 
  }

  aliadoChange(idAliadoComercial: number) {
    this._financiamientoEdicionService.obtenerSedesAliado(idAliadoComercial).subscribe(response => {
      this.listas.sedes = response;
    });
  }

  createFormProductRegister(){
    
    this.forma=this.formBuilder.group({

      nombreProducto: ['', [Validators.required]],
      precio: [, [Validators.required]],
      sku: ['', [Validators.required]],         
      idCategoria: [this.CategoryFnbIDValue, [Validators.required]],
      cantidad: ['', [Validators.required]], 
      aliadoComercial: [this.AliadoIDValue, [Validators.required]],
      idCanal: [this.data.canalId, [Validators.required]], 
      
      
    });
     
  }

  loadCategoryFnb(){
    this._categoryService.getAllCategoria().subscribe(
      (response) => {
       
        if (response.valid)
        this.CategoryFnbList =response.data;
      }
    );
  }

  loadProveedor(){
    this._branchOfficeService.getCommercialAllyProveedorList().subscribe(
      (response) => {
       
        if (response.valid)
        this.commercialAllyList =response.data;
      }
    );
  }




  save() {
    if(this.forma.invalid){
      return Object.values(this.forma.controls).forEach(control=>control.markAllAsTouched());
  }
    if (this.forma.valid) {
      //this.commercialAllyUpdateService.save(this.formGroup.getRawValue());
      swal({
        text: '¿Estás seguro de realizar esta operación?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then(result => { 

        this.createProduct();
        

            
      });
    }
  }


  createProduct(){
    this.product = this.forma.value 
  this._productService.addManual(this.product).subscribe(response => {    
    if (response.valid) {
      swal('Se agregó el producto correctamente.', '', 'success');
      this.dialogRef.close();
    }
  });
  }

  data1(event){
    this.aliadoId = parseInt(event.option.value.value);
    if(this.aliadoId > 0){
      this.stateActive = true;
    }else{
      this.stateActive = false;
    }
  }

  displayFn(producto: Producto) {
    if (producto) {
      return producto.label;
    }
  }


  displayFn2(producto: ProductoManual) {
    if (producto) {
      return producto.label;
    }
  }

  displayFn1(proveedor: AliadoComercial) {
    
    if (proveedor) {
      return proveedor.label;
    }
  }

  setForm() {
    this.forma = new FormGroup({
      nombreProducto: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      sku: new FormControl('', [Validators.required, Validators.min(1)]),
      idCategoria: new FormControl('', [Validators.required, Validators.min(1)]),
      cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      aliadoComercial: new FormControl('', Validators.required),
      idCanal: new FormControl(this.data.canalId),

    });

  }

  enviar() {
    if (this.forma.invalid) {
      return;
    }

    const productoEnviar = this.forma.value.nombreProducto as Producto;
   // const productoEnviar2 = this.forma.value.cantidad as Producto;
    //productoEnviar2.cantidad = this.forma.value.cantidad;

    this.dialogRef.close(productoEnviar);
  }

}

