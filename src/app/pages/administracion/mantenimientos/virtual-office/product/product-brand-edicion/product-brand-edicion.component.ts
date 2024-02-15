import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { ProductBrandService } from 'src/app/services/backend/productOv/product-brand.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-brand-edicion',
  templateUrl: './product-brand-edicion.component.html'
})
export class ProductBrandEdicionComponent implements OnInit {

 
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productBrandService: ProductBrandService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.productBrandService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(response => {       
        this.formGroup.controls.brandId.patchValue(response.data.brandId);
        this.formGroup.controls.description.patchValue(response.data.description);
        this.formGroup.controls.state.patchValue(response.data.state);       
      });
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      brandId: [0],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      state:[true]

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
            this.formGroup.getRawValue().brandId > 0
              ? this.productBrandService.update(this.formGroup.getRawValue().brandId, this.formGroup.getRawValue())
              : this.productBrandService.add(this.formGroup.getRawValue());

          operation.subscribe(response => {
            if (response.valid) {
              this.router.navigate(['/brand-listado']);
              swal('La operación se realizó satisfactoriamente', '', 'success');
            }
          });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/brand-listado']);
  }

}
