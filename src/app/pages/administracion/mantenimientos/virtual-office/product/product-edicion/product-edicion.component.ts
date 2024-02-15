import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AppConstant } from 'src/app/constants/app.constant';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { Category } from 'src/app/models/category.model';
import { Fee } from 'src/app/models/virtualOficce/fee.model';
import { Product } from 'src/app/models/virtualOficce/product.model';
import { ProductBrand } from 'src/app/models/virtualOficce/productBrand.model';
import { ProductCategory } from 'src/app/models/virtualOficce/productCategory.model';
import { ProductFeauture } from 'src/app/models/virtualOficce/productFeature.model';
import { ProductFee } from 'src/app/models/virtualOficce/productFee.model';
import { ProductImage } from 'src/app/models/virtualOficce/productImage.model';
import { ProductSection } from 'src/app/models/virtualOficce/productSection.model';
import { ProductServiceDto } from 'src/app/models/virtualOficce/productService.model';
import { ProductSubCategory } from 'src/app/models/virtualOficce/productSubCategory.model';
import { productoPromocion } from 'src/app/models/virtualOficce/productoPromocion';
import { CategoryService, FinanciamientoService, SedeService } from 'src/app/services/backend.service.index';
import { ProductBrandService } from 'src/app/services/backend/productOv/product-brand.service';
import { ProductSectionService } from 'src/app/services/backend/productOv/product-section.service';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import { ProductService } from 'src/app/services/backend/productOv/product.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-product-edicion',
  templateUrl: './product-edicion.component.html'
})
export class ProductEdicionComponent implements OnInit {

 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,   
    private activatedRoute: ActivatedRoute,
    public _productService:ProductService,
    public _productBrandService:ProductBrandService,
    public _productSubCategoryService:ProductSubcategoryService,
    public _productSectionService:ProductSectionService,
    private _branchOfficeService: SedeService,
    private _categoryService: CategoryService,
    public _financiamientoService: FinanciamientoService,
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    
    if(this.productId != null){
      this.isIdAvailable = true;
    }
  }

  displayedColumns: string[] = ['descripcion','modificar' , 'eliminar'];

  displayedColumns2: string[] = ['radioIn', 'imagen'];

  displayedColumns3:string[] =['position','image','remove','principal'];

  isIdAvailable: boolean = false;
  productId: string | null;
  promotionsDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  promoColumns: string[] = ['id', 'productName', 'startDate', 'endDate', 'promoPrice', 'actualPrice', 'active', 'disable'];
  PromotionForm: FormGroup;
  selectedTabIndex: number = 0;
  today = new Date();

  ProductRegisterForm:FormGroup;
  BrandList: ProductBrand[];
  SubCategoryList: ProductSubCategory[];
  CategoryList: ProductCategory[];
  FeatureArray: ProductFeauture[] = [];
  Feature = new ProductFeauture;
  SectionList: ProductSection[];
  ServiceList: ProductServiceDto[];
  FeeList: Fee[];
  ProductFeeList: ProductFee[] = [];
  ProductFee: ProductFee
  ProductImages:ProductImage []=[];
  SubcategoryIDValue: number;
  SectionIDValue: number;
  BrandIDValue: number;
  base64Image:boolean;
  principalImage :number;
  FeatureDataSource = new MatTableDataSource<ProductFeauture>(this.FeatureArray);
  ServiceArray: ProductServiceDto[] = [];
  ServiceDataSource = new MatTableDataSource<ProductServiceDto>(this.ServiceArray);
  FeautureForm = this.formBuilder.group({
    description: [, [Validators.required,Validators.maxLength(100)]],
  });
  ServiceForm = this.formBuilder.group({
    description: [, [Validators.required,Validators.maxLength(100)]],
  });
  stateCtrl = new FormControl();
  
  product = new Product
  filteredStates: Observable<ProductServiceDto[]>;
  mostrarTabServicios = false;
  commercialAllyList: AliadoComercial[];
  filteredCommercialAllyList: Observable<AliadoComercial[]>;
  currentCommercialAllyId?: number;
  CategoryFnbList: Category[]; 
  CategoryFnbIDValue: number;
  
 
  ngOnInit() {
    //|==>Promociones
    if (this.isIdAvailable) {
        this.fetchPromotions(this.productId);
    }
    this.isIdAvailable = true;
    //<==|

    this.currentCommercialAllyId = isNaN(parseInt(localStorage.getItem('IdAliado')))
      ? null
      : parseInt(localStorage.getItem('IdAliado'));    
    this.createFormProductRegister();
    this.createFormPromotionForm();
    this.loadCategory();
    this.loadCategoryFnb();
    this.loadBrand();   
    this.loadSubCategory();
    this.loadSections();
    this.loadProductFee();    
    this.loadServices();
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.ServiceList.slice())
    );
    
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this._productService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
        (response) => {         
          this.product = response.data[0];          
          this.ProductImages = this.product.productImages
          let principal = this.ProductImages.find(x=>x.state);
          this.principalImage = this.ProductImages.lastIndexOf(principal);         
          this.FeatureArray = this.product.productsFeatureList;
          this.FeatureDataSource.data = this.FeatureArray;
          this.ProductFeeList = this.product.productFeeList;
          this.ServiceArray = this.product.productsServiceList;
          this.product.PrecioOferta =(this.product.discountOfv==null||this.product.discountOfv==0)?null:(this.product.regularPrice-this.product.discountOfv)
          this.ServiceDataSource.data = this.ServiceArray;
          this.base64Image =false;
          this.ProductRegisterForm.controls['id'].setValue(this.activatedRoute.snapshot.paramMap.get('id'));
          this.ProductRegisterForm.controls['name'].setValue(this.product.name); 
          this.ProductRegisterForm.controls['code'].setValue(this.product.code);        
          
          this.ProductRegisterForm.controls['regularPrice'].setValue(this.product.regularPrice);
          this.ProductRegisterForm.controls['sapCode'].setValue(this.product.sapCode);
          this.ProductRegisterForm.controls['annualInstallments'].setValue(this.product.annualInstallments);
          this.ProductRegisterForm.controls['PrecioOferta'].setValue(this.product.PrecioOferta);
          this.ProductRegisterForm.controls['nnew'].setValue(this.product.nnew);
          this.ProductRegisterForm.controls['offer'].setValue(this.product.offer);
          this.ProductRegisterForm.controls['brandId'].setValue(this.product.brandId);
          this.ProductRegisterForm.controls['categoryId'].setValue(this.product.categoryId);         
          this.ProductRegisterForm.controls['subCategoryId'].setValue(this.product.subCategoryId);
          this.ProductRegisterForm.controls['sectionId'].setValue(this.product.sectionId);
          this.ProductRegisterForm.controls['state'].setValue(this.product.state);
          this.ProductRegisterForm.controls['productsFeatureList'].setValue(this.product.productsFeatureList);
          this.ProductRegisterForm.controls['productFeeList'].setValue(this.product.productFeeList);
          this.ProductRegisterForm.controls["order"].setValue(this.product.order);          
          this.ProductRegisterForm.controls["categoryFnbId"].setValue(this.product.categoryFnbId);
          this.ProductRegisterForm.controls['categoryFnbName'].setValue(this.CategoryFnbList.find(x=>x.id==this.product.categoryFnbId).name);          
          this.ProductRegisterForm.controls["productFnbId"].setValue(this.product.productFnbId);
          this.getAvailableCommercialAllyList(this.product.commercialAllyFnbId);
          let mayorcouta=0;
          if (this.FeeList.length > 0){
            this.FeeList.forEach(element => {
              if (this.ProductFeeList.find(e => e.description == element.description)) {
                element.state = true;
                if(mayorcouta < element.description) {
                  mayorcouta=element.description;
                }
              }
            })
          }
          this.ProductFeeList=[];
          this.ProductFee = new ProductFee;
          this.ProductFee.description = Number(mayorcouta);
          this.ProductFeeList.push(this.ProductFee);
          this._productService.postGetPrecioCuota({
            "PrecioFinal": (this.product.PrecioOferta==null)?this.product.regularPrice:this.product.PrecioOferta,
            "CantidadCuota": mayorcouta
          }).subscribe(p=>{
            this.product.monthFee=p.precioCuota;
            this.ProductRegisterForm.controls['monthFee'].setValue(this.product.monthFee);
          })
        }
      )
    }else{
      this.getAvailableCommercialAllyList();
    }
  }

  ngAfterViewInit() {
    this.promotionsDataSource.paginator = this.paginator;
  }
  
  createFormPromotionForm() {
    this.PromotionForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      promoPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]]
    });
  }
  fetchPromotions(id: string | null): void {
    if(id == null){
      this.promotionsDataSource.data = [];
    }else{
      this._financiamientoService.GetProductoPromociones(Number(id)).subscribe( res => {        
        this.promotionsDataSource.data = res;
      })
    }
      
  }
  savePromotion(): void {
     // Verificar si existe alguna promoción activa
  const existeActiva = this.promotionsDataSource.data.some(promo => promo.estaActivo);

  if (existeActiva) {
    swal("Advertencia.",'Ya existe una promoción activa. No se puede crear otra.', "warning");
    return;
  }
    const promotion : productoPromocion = {
      id: 0,
      productoId: Number(this.productId),
      fechaInicio: this.PromotionForm.get('startDate').value,
      fechaFinal: this.PromotionForm.get('endDate').value,
      precioPromocional: this.PromotionForm.get('promoPrice').value,
      estaActivo: true
    };
    
    this._financiamientoService.InsertProductoPromociones(promotion).subscribe( res =>{
      this.resetearFormulario(this.PromotionForm);
      
      swal("Éxito.",'Se agregó la promoción.', "success");
      this.fetchPromotions(this.productId);
    },
    error => {
      swal("Advertencia.",error, "warning");
    })
    
  }
  resetearFormulario(Form: FormGroup) {
    Object.keys(Form.controls).forEach(key => {
      Form.get(key).clearValidators();
      Form.get(key).updateValueAndValidity();
    });
    Form.reset();
    this.createFormPromotionForm();
  }
  disablePromotion(id: number) {
    swal({
      text: '¿Estás seguro de desactivar esta promoción?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      this._financiamientoService.desactivarPromocion(id).subscribe(
        response => {
          // Manejar la respuesta
          swal("Éxito.",'Se desactivo la promoción.', "success");
          this.fetchPromotions(this.productId);
        },
        error => {
          swal("Advertencia.",error, "warning");
        }
      );
    });    
  }
  
  tabChange(index){
    
    this.selectedTabIndex = index;
  }
  updateCuota(){
    this._productService.postGetPrecioCuota({
      "PrecioFinal": (this.product.PrecioOferta==null)?this.product.regularPrice:this.product.PrecioOferta,
      "CantidadCuota": this.ProductFeeList[0]
    }).subscribe(p=>{
      this.product.monthFee=p.precioCuota;
      this.ProductRegisterForm.controls['monthFee'].setValue(this.product.monthFee);
    })
  }

  createFormProductRegister(){
    
    this.ProductRegisterForm=this.formBuilder.group({
      id: [0],
      code: [, []],
      name: ['', [Validators.required]],
      monthFee: [,],
      regularPrice: [, [Validators.required]],
      sapCode: ['', [Validators.required]],         
      brandId: [this.BrandIDValue, Validators.required],
      annualInstallments: [, [Validators.minLength(1),Validators.maxLength(1),Validators.required]],
      PrecioOferta: [''],
      nnew: [false],
      offer: [false],
      subCategoryId: [this.SubcategoryIDValue, [Validators.required]],
      categoryId: [0, [Validators.required]],
      sectionId: [this.SectionIDValue],
      state: [true],
      productsFeatureList: [this.FeatureArray],
      productFeeList: [this.ProductFeeList],
      order:[0],
      commercialAllyFnbId: [''],
      commercialAlly: [[], [Validators.required]],
      categoryFnbId: [this.CategoryFnbIDValue, [Validators.required]],
      categoryFnbName: [''], 
      productFnbId:[0]
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
  loadCategory() {

    this._productSubCategoryService.getAllProductsCategory().subscribe(
      (response) => {      
        if (response.valid){
          this.CategoryList = response.data;
          this.ProductRegisterForm.controls['categoryId'].setValue(this.CategoryList[0].categoryId);
        }              
        }
     );

  }

  loadSubCategory() {
    this._productSubCategoryService.getAllProductsSubCategory().subscribe(
      (response) => {
        if (response.valid){
          this.SubCategoryList =response.data.filter((x: any) => 
          x.state && x.productsCategories.code === AppConstant.FNB); 
        }
      }
    );
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
    this._productService.getAllProductsFee().subscribe(
      (response) => {             
        if (response.valid) {           
          this.FeeList = response.data.filter(x=>Number(x.description)<=60);          
        }
      }
    )

  }
  ChangeCategoryFnb($event: any) {
    
    this.CategoryFnbIDValue = parseInt($event.value);
    this.ProductRegisterForm.controls['categoryFnbName'].setValue(this.CategoryFnbList.find(x=>x.id==this.CategoryFnbIDValue).name);
  }
  ChangeBrand($event: any) {
    this.BrandIDValue = parseInt($event.value);
  }
  ChangeSection($event: any) {
    this.SectionIDValue = parseInt($event.value);
  }

  ChangeSubCategory($event: any) {
    this.SubcategoryIDValue = parseInt($event.value);
  }
  
  ImageRemove(index: number) {     
    this.ProductImages.splice(index, 1);
  }
  
  save() {
    if(this.ProductRegisterForm.invalid){
      return Object.values(this.ProductRegisterForm.controls).forEach(control=>control.markAllAsTouched());
    }
    if (this.ProductRegisterForm.valid) {
      //this.commercialAllyUpdateService.save(this.formGroup.getRawValue());
      swal({
        text: '¿Estás seguro de realizar esta operación?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then(result => { 
            
        if (result.value) {         
           if(this.ProductRegisterForm.getRawValue().id > 0)
           this.updateProduct();
           else
           {

            this._productService.getExistSAP(this.ProductRegisterForm.get('sapCode').value).subscribe(response => {    
              if (response.valid && response.data) {
                swal({
                  text: 'El codigo ya existe SAP existe, si continua se actualizará los datos del producto. ¿Está seguro?',
                  type: 'question',
                  confirmButtonClass: 'btn-azul',
                  confirmButtonText: 'Aceptar',
                  showCancelButton: true,
                  cancelButtonText: 'Cancelar'
                }).then(result => { 
                      
                  if (result.value) {      
                    this.createProduct();   
                    //  if(this.ProductRegisterForm.getRawValue().id > 0)
                    //   this.createProduct();
                    //  else{
                    //   return; 
                    //  }
                  }
                });
              }
              else{
                this.createProduct(); 
              }
            });

            
           }
              
        }
      });
    }
  }
  
  createProduct(){
    this.product = this.ProductRegisterForm.value    
    if(this.product.name.trim() == "") return swal("El nombre del producto no puede estar vacío.",'', "error");
    if(this.product.monthFee < 0)return swal("El campo cuota  no puede contener valores negativos.",'', "error");
    if(this.product.regularPrice < 0)return swal("El precio  no puede contener valores negativos.",'', "error");
    if(this.product.PrecioOferta < 0)return swal("El descuento no puede contener valores negativos.",'', "error");
  if (this.FeeList.length == 0) return swal("Se requiere añadir cuotas al producto",'', "error");
  this.product.productFeeList = this.ProductFeeList;
  if (this.FeatureArray.length == 0) return swal("Se requiere añadir características al producto",'', "error");
  this.product.productsFeatureList = this.FeatureArray;
  if (this.ProductImages.length == 0) return swal("Se requiere añadir images al producto.",'', "error");
  this.product.productImages = this.ProductImages;

  if (typeof this.ProductRegisterForm.controls.commercialAlly.value == 'string') {
    this.ProductRegisterForm.controls.commercialAllyId.patchValue(
      this.commercialAllyList.find(
        p => p.businessName.toLocaleLowerCase() == this.ProductRegisterForm.controls.commercialAlly.value.toLocaleLowerCase()
      ).id
    );
  }

  this.product.productsServiceList = this.ServiceArray; 
  this._productService.add(this.product).subscribe(response => {    
    if (response.valid) {
      this.router.navigate(['/product-listado']);
      swal('La operación se realizó satisfactoriamente', '', 'success');
    }
  });
  }
  updateProduct(){
    if (this.ProductRegisterForm.valid){
      this.product = this.ProductRegisterForm.value
    this.product.productID = this.ProductRegisterForm.getRawValue().id;
    if (this.FeeList.length == 0) return  swal("Se requiere añadir cuotas al producto",'', "error");
    this.product.productFeeList = this.ProductFeeList;
    if (this.FeatureArray.length == 0)  return swal("Se requiere añadir características al producto",'', "error");
    this.product.productsFeatureList = this.FeatureArray;
    if (this.ProductImages.length == 0)  return swal("Se requiere añadir images al producto.",'', "error");    
    this.product.productImages = this.ProductImages;

    this.product.productsServiceList = this.ServiceArray;
    
       
    this._productService.update(this.ProductRegisterForm.getRawValue().id,this.product).subscribe(response => {
      if (response.valid) {
        this.router.navigate(['/product-listado']);
        swal('La operación se realizó satisfactoriamente', '', 'success');
      }
    });
  }
  }
  cancel() {
    this.router.navigate(['/product-listado']);
  }
  get nameValidate(){
    return this.ProductRegisterForm.controls['name'].errors && this.ProductRegisterForm.controls['name'].touched
  }
  get monthfeeValidate(){
    return this.ProductRegisterForm.controls['monthFee'].errors && this.ProductRegisterForm.controls['monthFee'].touched
  }
  get regularPriceValidate(){
    return this.ProductRegisterForm.controls['regularPrice'].errors && this.ProductRegisterForm.controls['regularPrice'].touched
  }
  get sapCodeValidate(){
    return this.ProductRegisterForm.controls['sapCode'].errors && this.ProductRegisterForm.controls['sapCode'].touched
  }
  
  get brandValidate(){
    return this.ProductRegisterForm.controls['brandId'].errors && this.ProductRegisterForm.controls['brandId'].touched
  }
  get annualInstallmentsValidate(){
    return this.ProductRegisterForm.controls['annualInstallments'].errors && this.ProductRegisterForm.controls['annualInstallments'].touched
  }
  /*get discountValidate(){
    return this.ProductRegisterForm.controls['discountOFV'].errors && this.ProductRegisterForm.controls['discountOFV'].touched
  }*/
  get subcategoryValidate(){
    return this.ProductRegisterForm.controls['subCategoryId'].errors && this.ProductRegisterForm.controls['subCategoryId'].touched
  }
  get categoryFnbValidate(){
    return this.ProductRegisterForm.controls['categoryFnbId'].errors && this.ProductRegisterForm.controls['categoryFnbId'].touched
  }
  /*get sectionValidate(){
    return this.ProductRegisterForm.controls['sectionId'].errors && this.ProductRegisterForm.controls['sectionId'].touched
  }*/
  get comercialAllyValidate(){
    return this.ProductRegisterForm.controls['commercialAlly'].errors && this.ProductRegisterForm.controls['commercialAlly'].touched
  }
  addFeautureArray() {
    if (this.FeautureForm['description'].trim() == '')    
      return  swal('El campo de característica está vacío', '', 'error');

    if (!this.FeatureArray.find(e => e.description == this.FeautureForm.value.description)) {
       
      this.Feature = this.FeautureForm.value
      this.FeatureArray.push(this.Feature);
      this.FeatureDataSource.data = this.FeatureArray;
    }
    else {
      swal(`${this.FeautureForm.value.description} se encuentra agregado, ingreso otra`, '', 'error');      
    }
    this.FeautureForm.reset();
  }
  preciocambioRegular(texto: string){
    this.product.regularPrice = Number.parseFloat(texto);
    if(texto=="")
      this.product.PrecioOferta=null;
    this._productService.postGetPrecioCuota({
      "PrecioFinal": (this.product.PrecioOferta==null)?this.product.regularPrice:this.product.PrecioOferta,
      "CantidadCuota": this.ProductFeeList[0].description
    }).subscribe(p=>{
      this.product.monthFee=p.precioCuota;
      this.ProductRegisterForm.controls['monthFee'].setValue(this.product.monthFee);
    })
  }
  preciocambioOferta(texto: string){
    this.product.PrecioOferta = Number.parseFloat(texto);
    if(texto=="")
      this.product.PrecioOferta=null;
    this._productService.postGetPrecioCuota({
      "PrecioFinal": (this.product.PrecioOferta==null)?this.product.regularPrice:this.product.PrecioOferta,
      "CantidadCuota": this.ProductFeeList[0].description
    }).subscribe(p=>{
      this.product.monthFee=p.precioCuota;
      this.ProductRegisterForm.controls['monthFee'].setValue(this.product.monthFee);
    })
  }

  EnabledCheck($event: any) {
    let feeNumber = Number($event.source.value);
    this.ProductFeeList=[];
    //if (!(this.ProductFeeList.find(e => e.description == feeNumber))) {
      this.ProductFee = new ProductFee;
      this.ProductFee.description = Number($event.source.value);
      this.ProductFeeList.push(this.ProductFee);

      this._productService.postGetPrecioCuota({
        "PrecioFinal": (this.product.PrecioOferta==null)?this.product.regularPrice:this.product.PrecioOferta,
        "CantidadCuota": feeNumber
      }).subscribe(p=>{
        this.product.monthFee=p.precioCuota;
        this.ProductRegisterForm.controls['monthFee'].setValue(this.product.monthFee);
      })
    //}
    /*else {

      let position = this.ProductFeeList.findIndex(e => e.description == feeNumber);
      this.ProductFeeList.splice(position, 1);
    }*/
  }
  checkAll(event: any) {
 
    const checked = event.checked;
    this.FeeList.forEach(item => item.state = checked);
    if(checked){ this.ProductFeeList = this.FeeList;}else{this.ProductFeeList=[];}
  }
  FeatureEdit(index: number){
    swal({
      title: 'Editar Característica',
      input: 'text',
      inputValue:this.FeatureArray[index].description,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Modificar',
      showLoaderOnConfirm: true,
      preConfirm: (c) => {
        this.FeatureArray[index].description=c;
      },
      allowOutsideClick: () => !swal.isLoading()
    })
  }
  FeatureRemove(index: number) {
    this.FeatureArray.splice(index, 1);
    this.FeatureDataSource.data = this.FeatureArray;
  }
  onFileChange($event:any) {
    let dto = new ProductImage;
    this.base64Image=true;
    const file = $event.target.files[0];
    dto.nameImage = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      var array = reader.result.toString().split(',');
      dto.base64image = array[1];
      dto.routeImage = `data:image/jpg;base64,${array[1]}`
    }
    this.ProductImages.forEach(e=>{e.state=false;})
    dto.state = true;
    this.ProductImages.push(dto);   
  }
  ActiveImage(position:any){     
    this.ProductImages.forEach(e=>e.state =false);
    let principal =this.ProductImages[position];
    principal.state =true;
  }
  loadServices() {
    this._productService.getListServices().subscribe(
      (response) => {

        if (response.valid) {
           
          this.ServiceList = response.data;
        }
      }
    )

  }

  
  getId(routerImage:string, item: any) {
 
    if(!item.id)
      return routerImage;

    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0'); // Los meses en Date empiezan en 0, por eso se suma 1
    const anio = now.getFullYear();
    const hora = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    const segundos = String(now.getSeconds()).padStart(2, '0');
    const milisegundos = String(now.getMilliseconds()).padStart(3, '0');
    const VERSION=`${dia}${mes}${anio}${hora}${minutos}${segundos}${milisegundos}`
     
    return `${routerImage}?v=${VERSION}`;
  }

  private _filterStates(value: string): ProductServiceDto[] {
    const filterValue = value.toLowerCase();

    return this.ServiceList.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
  addServiceArray() {
    if (this.stateCtrl.value == null || this.stateCtrl.value.trim() == '')
      return swal("El campo de servicio está vacío","",'error');

    if (!this.ServiceArray.find(e => e.name == this.stateCtrl.value)) {

      const regAdd = this.ServiceList.find(e => e.name == this.stateCtrl.value);
       
      this.ServiceArray.push(regAdd);
      this.ServiceDataSource.data = this.ServiceArray;
    }
    else {
      swal(`${this.stateCtrl.value} se encuentra agregado, ingrese otra`);
      
    }
    this.ServiceForm.reset();
  }

  ServiceRemove(index: number) {
    this.ServiceArray.splice(index, 1);
    this.ServiceDataSource.data = this.ServiceArray;
  }
  get ordenValidate(){

    return this.ProductRegisterForm.controls['order'].errors && this.ProductRegisterForm.controls['order'].touched;
  }
  displayFn(commercialAlly?: AliadoComercial): string {
    return commercialAlly ? commercialAlly.businessName : undefined;
  }  
  setCommercialAllyId() {
    this.ProductRegisterForm.controls.commercialAllyFnbId.patchValue(this.ProductRegisterForm.controls.commercialAlly.value.id);
    this.ProductRegisterForm.updateValueAndValidity();
  }
  getAvailableCommercialAllyList(lastCommercialAllyId?: number) {
    this._branchOfficeService.getAvailableCommercialAllyList().subscribe(response => {
      
      this.commercialAllyList = response.data.entities.filter(x=>x.proveedor != null && x.activo);      
      this.filteredCommercialAllyList = this.ProductRegisterForm.controls.commercialAlly.valueChanges.pipe(
        debounceTime(300),
        map(value => this.filterCommercialAlly(value))
      );
      if (lastCommercialAllyId != null || this.currentCommercialAllyId != null) {
        let commercialAllyId = lastCommercialAllyId != null ? lastCommercialAllyId : this.currentCommercialAllyId;
        this.ProductRegisterForm.controls.commercialAlly.patchValue(this.commercialAllyList.find(p => p.id == commercialAllyId));
        this.ProductRegisterForm.controls.commercialAllyFnbId.patchValue(commercialAllyId);
      }
      this.ProductRegisterForm.controls.commercialAlly.setValidators(this.forbiddenNamesValidator(this.commercialAllyList));
    });
  }
  forbiddenNamesValidator(commercialAllyList: AliadoComercial[]): ValidatorFn {
    return (formControl: FormControl): { [key: string]: any } | null => {
      if (
        typeof formControl.value === 'string' &&
        commercialAllyList.find(p => p.businessName.toLocaleLowerCase() == formControl.value.toLocaleLowerCase()) ===
          undefined
      )
        return { 'forbidden-name': true };
      else return null;
    };
  }
  private filterCommercialAlly(value: any): AliadoComercial[] {
    if (typeof value !== 'string') return;
    const filterValue = value.toLowerCase();
    return this.commercialAllyList.filter(option => option.businessName.toLowerCase().includes(filterValue));
  }

}
