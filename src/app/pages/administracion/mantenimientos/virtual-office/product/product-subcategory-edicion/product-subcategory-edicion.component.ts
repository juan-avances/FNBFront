import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineAll } from 'rxjs/operators';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { AppConstant } from 'src/app/constants/app.constant';
import { ProductCategory } from 'src/app/models/virtualOficce/productCategory.model';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-subcategory-edicion',
  templateUrl: './product-subcategory-edicion.component.html'
})
export class ProductSubcategoryEdicionComponent implements OnInit {

  CategoryList: ProductCategory[];
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productSubCategoryService: ProductSubcategoryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCategory();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.productSubCategoryService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(response => {           
        this.formGroup.controls.subCategoryId.patchValue(response.data.subCategoryId);
        this.formGroup.controls.description.patchValue(response.data.description);
        this.formGroup.controls.state.patchValue(response.data.state);
        this.formGroup.controls.categoryId.patchValue(response.data.categoryId);       
      });
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      subCategoryId: [0],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      state:[true],
      categoryId:[]

    });
  }
  save() {
    if (this.formGroup.valid) {

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
          const operation =
            this.formGroup.getRawValue().subCategoryId > 0
              ? this.productSubCategoryService.update(this.formGroup.getRawValue().subCategoryId, this.formGroup.getRawValue())
              : this.productSubCategoryService.add(this.formGroup.getRawValue());

          operation.subscribe(response => {
            if (response.valid) {
              this.router.navigate(['/subCategory-listado']);
              swal('La operación se realizó satisfactoriamente', '', 'success');
            }
          });
        }
      });
    }
  }
  get categoryValidate(){
    return this.formGroup.controls['categoryId'].errors && this.formGroup.controls['categoryId'].touched
  }
  loadCategory() {

    this.productSubCategoryService .getAllProductsCategory().subscribe(
      (response) => {      
        if (response.valid){
          this.CategoryList = response.data;
          this.formGroup.controls['categoryId'].setValue(this.CategoryList[0].categoryId);
        }      
      }        
     );
  }
  cancel() {
    this.router.navigate(['/subCategory-listado']);
  }

}
