import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommercialAllyUpdateService } from 'src/app/services/feature/Administracion/AliadoComercial/commercial-ally-update.service';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-commercial-ally-form',
  templateUrl: './commercial-ally-form.component.html',
  styleUrls: []
})
export class CommercialAllyFormComponent implements OnInit {
  formGroup: FormGroup;
  changedImage = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private commercialAllyUpdateService: CommercialAllyUpdateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.commercialAllyUpdateService.init(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
        response => {
          this.formGroup.controls.id.patchValue(response.id);
          this.formGroup.controls.documentNumber.patchValue(response.documentNumber);
          this.formGroup.controls.legalName.patchValue(response.legalName);
          this.formGroup.controls.businessName.patchValue(response.businessName);
          this.formGroup.controls.isProvider.patchValue(response.isProvider);
          this.formGroup.controls.assessor.patchValue(response.assessor);
          this.formGroup.controls.responsableVenta.patchValue(response.responsableVenta);
          this.formGroup.controls.proveedor.patchValue(response.proveedor);
          this.formGroup.controls.isSalesManager.patchValue(response.isSalesManager);
          this.formGroup.controls.base64Logo.patchValue(response.base64Logo);
          this.formGroup.controls.sourceImageName.patchValue(response.sourceImageName);
          this.formGroup.controls.uniqueImageName.patchValue(response.uniqueImageName);
          if(response.proveedor.length > 0){
            this.formGroup.controls.responsableVenta.setValidators([Validators.maxLength(10),Validators.pattern(/^[0-9]*$/)]);
            this.formGroup.controls.responsableVenta.updateValueAndValidity();
          }else{
            if(response.responsableVenta.length > 0){
              this.formGroup.controls.proveedor.setValidators([Validators.maxLength(10),Validators.pattern(/^[0-9]*$/)]);
              this.formGroup.controls.proveedor.updateValueAndValidity();
            }else{
            }
          }
        },
        error => {
          this.router.navigate(['/commercial-ally-index']);
        }
      );
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      documentType: [''],
      documentNumber: [
        '',
        [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]*$/)]
      ],
      legalName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      businessName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      assessor: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]
      ],
      responsableVenta: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]
      ],
      proveedor: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]
      ],
      isSalesManager: [false],
      isProvider: [false],
      sourceImageName: [''],
      uniqueImageName: [''],
      base64Logo: [''],
      imagePath: ['']
    });
    // this.formGroup.setValidators(this.atLeastOneTypeChosen);
  }

  previewImage(event) {
    let files = event.target.files;
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.changedImage = true;
      this.formGroup.controls.sourceImageName.patchValue(files[0].name);
      this.formGroup.controls.base64Logo.patchValue(reader.result);
    };
  }
  save() {
    if (this.formGroup.valid) {
      if(!this.changedImage) {
        this.formGroup.controls.base64Logo.patchValue(null);
      }
      this.commercialAllyUpdateService.save(this.formGroup.getRawValue());
    }
  }

  // Sección de restricciones
  onChange(event) {
    if (/^[0-9]*$/.test(event.key) == false) {
      event.preventDefault();
    }
  }
  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (/^[0-9]*$/.test(pastedText) == false) {
      event.preventDefault();
    }
  }
  deshabilitarProveedor(value: string) {
    const proveedor = this.formGroup.get('proveedor');
    const responsableVenta = this.formGroup.get('responsableVenta');
    if (value) {
      if (!responsableVenta.value) {
        responsableVenta.setValidators(null);
      } else {
        responsableVenta.setValidators([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/)
        ]);
      }
      proveedor.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]);
      proveedor.updateValueAndValidity();
      responsableVenta.updateValueAndValidity();
    } else {
      if (responsableVenta.value) {
        proveedor.setValidators(null);
        proveedor.updateValueAndValidity();
      }
      responsableVenta.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]);
      responsableVenta.updateValueAndValidity();
    }
  }
  deshabilitarResponsableVenta(value: string) {
    const proveedor = this.formGroup.get('proveedor');
    const responsableVenta = this.formGroup.get('responsableVenta');
    if (value) {
      if (!proveedor.value) {
        proveedor.setValidators(null);
      } else {
        proveedor.setValidators([Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]);
      }
      responsableVenta.setValidators([
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]*$/)
      ]);
      responsableVenta.updateValueAndValidity();
      proveedor.updateValueAndValidity();
    } else {
      if (proveedor.value) {
        responsableVenta.setValidators(null);
        responsableVenta.updateValueAndValidity();
      }
      proveedor.setValidators([Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)]);
      proveedor.updateValueAndValidity();
    }
  }
  cancel() {
    this.router.navigate(['/commercial-ally-index']);
  }
  //validación personalizada
  private atLeastOneTypeChosen(formGroup: FormGroup): { [key: string]: any } | null {
    if (formGroup.controls.isProvider.value == true || formGroup.controls.isSalesManager.value == true) {
      return null;
    } else return { 'no-type-was-chosen': true };
  }
}
