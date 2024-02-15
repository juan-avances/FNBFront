import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { CategoryService } from 'src/app/services/backend/category.service';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.categoryService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(response => {
        this.formGroup.controls.id.patchValue(response.data.id);
        this.formGroup.controls.name.patchValue(response.data.name);
        this.formGroup.controls.code.patchValue(response.data.code);
        this.formGroup.controls.estadoEnPortal.patchValue(response.data.estadoEnPortal);
      });
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          Validators.pattern(ExpressionValidation.CodigoMaterial)
        ]
      ],
      estadoEnPortal: [false, []]
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
            this.formGroup.getRawValue().id > 0
              ? this.categoryService.update(this.formGroup.getRawValue().id, this.formGroup.getRawValue())
              : this.categoryService.add(this.formGroup.getRawValue());

          operation.subscribe(response => {
            if (response.valid) {
              this.router.navigate(['/category-index']);
              swal('La operación se realizó satisfactoriamente', '', 'success');
            }
          });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/category-index']);
  }
}
