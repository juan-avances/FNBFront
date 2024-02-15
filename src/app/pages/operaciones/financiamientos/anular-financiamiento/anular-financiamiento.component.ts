import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Option } from '../../../../@core/models/option.model';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { FinanciamientoService } from '../../../../services/backend/financiamiento.service';
import { FileUpload64 } from '../../../../models/fileUpload64.model';
import { AnulacionModel } from 'src/app/models/anulacion.model';

@Component({
  selector: 'app-anular-financiamiento',
  templateUrl: './anular-financiamiento.component.html',
  styles: []
})
export class AnularFinanciamientoComponent implements OnInit {
  forma: FormGroup;
  optionProducto: File;
  refProducto: number;
  anulacionModel: AnulacionModel;
  filteredOptions: Observable<Option[]>;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _financiamientoService: FinanciamientoService,
    public dialogRef: MatDialogRef<AnularFinanciamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public financiamientoId: number
  ) {}

  btnCerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.setForm();
  }

  getPosts(event) {
    this.refProducto = parseInt(event.value);
  }

  setForm() {
    this.forma = new FormGroup({
      motivo: new FormControl('', Validators.required)
    });
  }

  enviar() {
    if (this.forma.invalid) {
      return;
    }

    this.anulacionModel = {};
    this.anulacionModel.financiamientoId = this.financiamientoId;
    this.anulacionModel.motivo = this.forma.value.motivo;

    swal({
      title: '',
      text: '¿Desea confirmar la anulación?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._financiamientoService.cancelFinanciamiento(
          this.anulacionModel
        );
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal(
              'La operación se realizó satisfactoriamente',
              '<div class="alert_content"></div>',
              'success'
            );
            this.dialogRef.close();
          } else {
            swal(
              '',
              '<div">' +
                '<i class="far fa-times-circle"></i> ' +
                response.message +
                ' <br>' +
                '</div>',
              'error'
            );
          }
        });
      }
    });
  }
}
