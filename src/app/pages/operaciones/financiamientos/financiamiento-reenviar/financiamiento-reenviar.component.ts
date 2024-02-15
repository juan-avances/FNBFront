import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReenvioSapModel } from 'src/app/models/reenvioSap.model';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import swal from 'sweetalert2';

@Component({
  selector: 'app-financiamiento-reenviar',
  templateUrl: './financiamiento-reenviar.component.html',
  styleUrls: ['./financiamiento-reenviar.component.scss']
})
export class FinanciamientoReenviarComponent implements OnInit {
  formGroup: FormGroup;
  model: ReenvioSapModel = new ReenvioSapModel();

  constructor(
    public modalReference: MatDialogRef<FinanciamientoReenviarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public _financiamientoService: FinanciamientoService,
    //public _financiamientoMantenedorArchivoServicio: FinanciamientoMantenedorArchivoService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  btnCerrar(): void {
    this.modalReference.close();
  }

  createForm() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.data.financiamientoId, Validators.required),
      existeEnSap: new FormControl({value: 'N', disabled: false}, Validators.required),
      nroPedido: new FormControl({value: '', disabled: false})
    });
  }

  get isSendSap()  {
    return this.formGroup.controls['existeEnSap'].value === 'S' ;
  }

  send(){
   
    if (this.formGroup.invalid) {
      return;
  }
   
    this.formGroup.patchValue({
      //IsEnviadoSap: this.formGroup.controls['IsEnviadoSap'].value != 'S',
      NroPedido: this.formGroup.controls['nroPedido'].value
    });
    // this.model.Id = this.data.financiamientoId;
    // this.model.IsEnviadoSap = this.formGroup.controls['isInSap'].value == 'S';
    // this.model.NroPedido = this.formGroup.controls['nroPedidoVenta'].value;
    let financiamiento = this.formGroup.getRawValue();
    this._financiamientoService.updateNroPedido(financiamiento).subscribe(response => {      
      swal(
        response.message,
        '',
        response.typeIcon
      );

      this.modalReference.close(true);
    });
  }
}
