import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { map, debounceTime } from 'rxjs/operators';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { SedeService } from 'src/app/services/backend/sede.service';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-branch-office-form',
  templateUrl: './branch-office-form.component.html',
  styleUrls: []
})
export class BranchOfficeFormComponent implements OnInit {
  formGroup: FormGroup;
  commercialAllyList: AliadoComercial[];
  filteredCommercialAllyList: Observable<AliadoComercial[]>;
  currentCommercialAllyId?: number;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private branchOfficeService: SedeService
  ) {}

  ngOnInit() {
    this.currentCommercialAllyId = isNaN(parseInt(localStorage.getItem('IdAliado')))
      ? null
      : parseInt(localStorage.getItem('IdAliado'));
    this.createForm();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.branchOfficeService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(response => {
        this.formGroup.controls.id.patchValue(response.data.id);
        this.formGroup.controls.code.patchValue(response.data.code);
        this.formGroup.controls.name.patchValue(response.data.name);
        this.formGroup.controls.address.patchValue(response.data.address);
        this.formGroup.controls.commercialAllyId.patchValue(response.data.commercialAllyId);
        this.getAvailableCommercialAllyList(response.data.commercialAllyId);
      });
    } else {
      this.getAvailableCommercialAllyList();
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10)
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.AddressStreet)
        ]
      ],
      commercialAllyId: [''],
      commercialAlly: [, [Validators.required]]
    });
  }

  /**
   * Obtiene los aliados comerciales disponibles en base al usuario
   * @param lastCommercialAllyId Id de aliado comercial extraido de la base de datos
   */
  getAvailableCommercialAllyList(lastCommercialAllyId?: number) {
    this.branchOfficeService.getAvailableCommercialAllyList().subscribe(response => {
      this.commercialAllyList = response.data.entities;
      this.filteredCommercialAllyList = this.formGroup.controls.commercialAlly.valueChanges.pipe(
        debounceTime(300),
        map(value => this.filterCommercialAlly(value))
      );
      if (lastCommercialAllyId != null || this.currentCommercialAllyId != null) {
        let commercialAllyId = lastCommercialAllyId != null ? lastCommercialAllyId : this.currentCommercialAllyId;
        this.formGroup.controls.commercialAlly.patchValue(this.commercialAllyList.find(p => p.id == commercialAllyId));
        this.formGroup.controls.commercialAllyId.patchValue(commercialAllyId);
      }
      this.formGroup.controls.commercialAlly.setValidators(this.forbiddenNamesValidator(this.commercialAllyList));
    });
  }
  displayFn(commercialAlly?: AliadoComercial): string {
    return commercialAlly ? commercialAlly.businessName : undefined;
  }

  setCommercialAllyId() {
    this.formGroup.controls.commercialAllyId.patchValue(this.formGroup.controls.commercialAlly.value.id);
    this.formGroup.updateValueAndValidity();
  }
  
  private filterCommercialAlly(value: any): AliadoComercial[] {
    if (typeof value !== 'string') return;
    const filterValue = value.toLowerCase();
    return this.commercialAllyList.filter(option => option.businessName.toLowerCase().includes(filterValue));
  }
  cancel() {
    this.router.navigate(['/branch-office-index']);
  }

  /**
   * Si el control fue modificado manualmente (no se escogió una opción del autocomplete), se validará que la opción ingresada exista en la lista
   * @param commercialAllyList lista de aliados comerciales válidos
   */
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

  /**
   * Elimina el valor del control  commercialAllyId para forzar lanzar el error cuando el usuario no escoge una opción de mat-autocomplete
   */
  removeCommercialAllyId() {
    this.formGroup.controls.commercialAllyId.patchValue('');
    this.formGroup.updateValueAndValidity();
  }
  save() {
    if (typeof this.formGroup.controls.commercialAlly.value == 'string') {
      this.formGroup.controls.commercialAllyId.patchValue(
        this.commercialAllyList.find(
          p => p.businessName.toLocaleLowerCase() == this.formGroup.controls.commercialAlly.value.toLocaleLowerCase()
        ).id
      );
    }

    if (this.formGroup.valid) {
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
              ? this.branchOfficeService.update(this.formGroup.getRawValue().id, this.formGroup.getRawValue())
              : this.branchOfficeService.add(this.formGroup.getRawValue());

          operation.subscribe(response => {
            if (response.valid) {
              this.router.navigate(['/branch-office-index']);
              swal('La operación se realizó satisfactoriamente', '', 'success');
            }
          });
        }
      });
    }
  }
}
