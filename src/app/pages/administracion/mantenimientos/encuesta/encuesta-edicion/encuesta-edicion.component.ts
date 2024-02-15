import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestaEdicionService } from 'src/app/services/feature/Administracion/Encuesta/encuesta-edicion.service';
import { Encuesta } from 'src/app/models/encuesta.model';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';

@Component({
  selector: 'app-edicion-encuesta',
  templateUrl: './encuesta-edicion.component.html',
  styles: []
})
export class EncuestaEdicionComponent implements OnInit {
  encuestaActual: Encuesta;
  forma: FormGroup;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _encuestaEdicionServicio: EncuestaEdicionService,
    private formBuilder: FormBuilder,
    public _renderer2: Renderer2
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._encuestaEdicionServicio.init(this._activatedRoute).subscribe(response => {
      this.encuestaActual = response;
      this.forma = this._encuestaEdicionServicio.getForm(this.encuestaActual);
      this.encuestaActual.preguntas.map(p => {
        const pregunta = this.formBuilder.group({
          id: new FormControl(0, Validators.required),
          encuestaId: new FormControl(p.encuestaId, Validators.required),
          codigo: new FormControl(p.codigo, [
            Validators.required,            
            Validators.maxLength(15),
            Validators.pattern(ExpressionValidation.CodigoPregunta)
          ]),
          nombre: new FormControl(p.nombre, [
            Validators.required,            
            Validators.maxLength(100),
            Validators.pattern(ExpressionValidation.NombrePregunta)
          ]),
          orden: new FormControl(p.orden),
          estado: new FormControl(p.estado.toString()),
          alternativas: this.formBuilder.array([])
        });
        p.alternativas.map(a => {
          const alterntiva = new FormGroup({
            id: new FormControl(0, Validators.required),
            preguntaId: new FormControl(a.preguntaId, Validators.required),
            codigo: new FormControl(a.codigo, [
              Validators.required,              
              Validators.maxLength(15),
              Validators.pattern(ExpressionValidation.CodigoPregunta)
            ]),
            nombre: new FormControl(a.nombre, [
              Validators.required,              
              Validators.maxLength(100)
            ]),
            orden: new FormControl(a.orden, Validators.required),
            esOtro: new FormControl(a.esOtro),
            estado: new FormControl(a.estado.toString())
          });
          (pregunta.controls.alternativas as FormArray).push(alterntiva);
        });
        (this.forma.controls.preguntas as FormArray).push(pregunta);
      });
    });
  }

  onSubmit() {
    this._encuestaEdicionServicio.saveChange(this.forma.getRawValue());
  }

  cancelar() {
    this._encuestaEdicionServicio.cancel();
  }

  actualizarEstadoAlternativa(valor, pregunta: any[]) {
    pregunta.forEach(item => {
      item.get('estado').setValue(valor);
    });
  }

  addNewPregunta(): void {
    let numPregunta = this.forma.controls.preguntas.value.length;
    numPregunta = numPregunta + 1;
    const pregunta: any = this.formBuilder.group({
      id: new FormControl(0, Validators.required), // Nuevo guardar
      codigo: new FormControl('PRE' + ('000' + numPregunta).slice(-3), [
        Validators.required,
        
        Validators.maxLength(15),
        Validators.pattern(ExpressionValidation.CodigoPregunta)
      ]),
      nombre: new FormControl('', [
        Validators.required,        
        Validators.maxLength(100),
        Validators.pattern(ExpressionValidation.NombrePregunta)
      ]),
      orden: new FormControl(numPregunta),
      estado: new FormControl('1'),
      alternativas: this.formBuilder.array([])
    });
    (this.forma.controls.preguntas as FormArray).push(pregunta);
  }

  addNewAltertiva(valAlternativa): void {
    let numAlternativa = valAlternativa.length;
    numAlternativa = numAlternativa + 1;
    const alterntiva = new FormGroup({
      id: new FormControl(0, Validators.required), // Nuevo guardar
      codigo: new FormControl('ALT' + ('000' + numAlternativa).slice(-3), [
        Validators.required,        
        Validators.maxLength(15),
        Validators.pattern(ExpressionValidation.CodigoAlternativa)
      ]),
      nombre: new FormControl('', [
        Validators.required,        
        Validators.maxLength(100),
        Validators.pattern(ExpressionValidation.NombreAlternativa)
      ]),
      orden: new FormControl(numAlternativa, Validators.required),
      esOtro: new FormControl(''),
      estado: new FormControl('1')
    });
    (valAlternativa as FormArray).push(alterntiva);
  }

  actualizarPregunta(estado, numPregunta): void {
    if (estado == 0) {
      this.forma.controls.preguntas['controls'][numPregunta].get('estado').setValue('1');
    }
  }
}
