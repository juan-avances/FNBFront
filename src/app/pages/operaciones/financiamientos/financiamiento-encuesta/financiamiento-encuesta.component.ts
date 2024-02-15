import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Encuesta, RespuestaEncuesta, RespuestaPregunta } from 'src/app/models/encuesta.model';
import { EncuestaEdicionService } from 'src/app/services/feature/Administracion/Encuesta/encuesta-edicion.service';
import { EncuestaService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-financiamiento-encuesta',
  templateUrl: './financiamiento-encuesta.component.html',
  styleUrls: [],
})
export class FinanciamientoEncuestaComponent implements OnInit {
  forma: FormGroup;
  encuesta: Encuesta;

  constructor(
    public _encuestaEdicionService: EncuestaEdicionService,
    public _encuestaService: EncuestaService,
    public _global: GlobalService,
    public dialogRef: MatDialogRef<FinanciamientoEncuestaComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.forma = this.formBuilder.group({
      preguntas: this.formBuilder.array([]),
    });

    this._encuestaService.getLast().subscribe((response) => {
      if (response.valid && response.data) {
        this.encuesta = response.data;
        this.encuesta.preguntas.map((p) => {
          const pregunta = this.formBuilder.group({
            alternativas: this.formBuilder.array([], this.minSelectedCheckboxes(1)),
          });
          p.alternativas.map((a) => {
            const alterntiva = new FormGroup({
              checked: new FormControl(false),
              otro: new FormControl(''),
            });
            (pregunta.controls.alternativas as FormArray).push(alterntiva);
          });
          (this.forma.controls.preguntas as FormArray).push(pregunta);
        });
      }
      else
      {
        this.btnCerrar();
      }
    });
    localStorage.removeItem('correoSAP');
    localStorage.removeItem('numeroTelefonoSAP');
  }

  btnCerrar(): void {
    this.dialogRef.close();
  }

  enviar() {
    const obj = this.forma.getRawValue();
    let respuestaList: RespuestaPregunta[] = [];
    
    obj.preguntas.map((pregunta, p) => {
      pregunta.alternativas.map((alternativa, a) => {
        if (alternativa.checked) {
          respuestaList.push({
            preguntaId: this.encuesta.preguntas[p].id,
            alternativaId: this.encuesta.preguntas[p].alternativas[a].id,
            descripcion: alternativa.otro
          });
        }
      });
    });
    let resEnc: RespuestaEncuesta = new RespuestaEncuesta();
    resEnc.clienteId = this.data.clienteId;
    resEnc.financiamientoId = this.data.financiamientoId;
    resEnc.respuestaList = respuestaList;
    this._encuestaEdicionService.setRespuestas(resEnc);
    this.dialogRef.close();
  }

  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map((control) => control.get('checked').value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
}
