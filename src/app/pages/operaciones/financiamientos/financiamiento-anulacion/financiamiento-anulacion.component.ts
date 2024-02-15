import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import { MotivoEdicionService } from 'src/app/services/feature/Administracion/Motivo/motivo-edicion.service';

@Component({
  selector: 'app-financiamiento-anulacion',
  templateUrl: './financiamiento-anulacion.component.html',
  styles: []
})
export class FinanciamientoAnulacionComponent implements OnInit {
  forma: FormGroup;
  esOtro: boolean = false;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<FinanciamientoAnulacionComponent>,
    public _router: Router,
    public _motivoEdicionService: MotivoEdicionService,
    public _financiamientoService: FinanciamientoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  btnCerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.setForm();
    this._motivoEdicionService.obtenerMotivos().subscribe(response => {
      this.data.motivos = response;
    });
  }

  setForm() {
    this.forma = new FormGroup({
      idMotivo: new FormControl(null, Validators.required),
      descripcion: new FormControl('')
    });
  }

  enviar() {
    if (this.forma.invalid) {
      return;
    }

    let financiamiento = this.forma.getRawValue();
    financiamiento.id = this.data.financiamiento.id;

    swal({
      text: '¿Estás seguro de anular el financiamiento ' + this.data.financiamiento.nroPedido + '?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this._financiamientoService
          .anularFinanciamiento(financiamiento)
          .pipe(
            filter(p => p.valid),
            map(p => p.data)
          )
          .subscribe(response => {
            swal(
              'Se realizó satisfactoriamente la anulación.',
              '<div class="alert_content">' +
                '<i class="far fa-check-circle"></i> N° Pedido Venta: ' +
                response.nroPedidoVenta +
                '<br>' +
                '</div>',
              'success'
            );
            this.dialogRef.close(true);
          });
      }
    });
  }

  changeMotivo(event: any) {
    this.data.motivos.map(motivo => {
      if (motivo.value == event.value) {
        this.esOtro = motivo.esOtro;
        const descripcion = this.forma.get('descripcion');
        if (motivo.esOtro) {
          descripcion.reset();
          descripcion.setValidators([Validators.required]);
        } else {
          descripcion.setValidators(null);
        }
        descripcion.updateValueAndValidity();
        return;
      }
    });
  }
}
