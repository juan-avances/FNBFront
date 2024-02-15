import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Encuesta, RespuestaEncuesta } from '../../../../models/encuesta.model';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { EncuestaService } from '../../../backend.service.index';
import { ExpressionValidation } from '../../../../@core/helpers/expression.validation';
import swal from 'sweetalert2';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EncuestaEdicionService {
  encuestaId: any;
  encuestaActual: Encuesta;
  renderer2: Renderer2;

  constructor(
    public _route: Router,
    public _encuestaService: EncuestaService,
    public _rendererFactory: RendererFactory2
  ) {
    this.renderer2 = _rendererFactory.createRenderer(null, null);
  }

  init(_activatedRoute: ActivatedRoute): Observable<Encuesta> {
    return _activatedRoute.params.pipe(
      switchMap(params => {
        const encuestaId = params['id'];
        return this._encuestaService.get(encuestaId).pipe(
          map(response => {
            if (response.valid) {
              return response.data;
            }
          })
        );
      })
    );
  }

  get(encuestaId: any): Observable<Encuesta> {
    return this._encuestaService.get(encuestaId).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  getForm(encuestaref: Encuesta) {
    return new FormGroup({
      id: new FormControl(encuestaref.id),
      estado: new FormControl(encuestaref.estado),
      codigo: new FormControl(encuestaref.codigo, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(ExpressionValidation.CodigoEncuesta)
      ]),
      nombre: new FormControl(encuestaref.nombre, [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(ExpressionValidation.LetterNumberSign)
      ]),
      descripcion: new FormControl(encuestaref.descripcion, [
        Validators.required,
        Validators.maxLength(200),
        Validators.pattern(ExpressionValidation.LetterNumberSign)
      ]),
      preguntas: new FormArray([])
    });
  }

  setRespuestas(respuesta: RespuestaEncuesta) {

    const resultadoServicio = this._encuestaService.setRespuestas(respuesta);
    resultadoServicio.subscribe(response => {
      if (response.valid) {
        swal('La operación se realizó satisfactoriamente', '', 'success');
      }
    });
  }

  saveChange(refEncuesta: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio =
          refEncuesta.id > 0
            ? this._encuestaService.update(refEncuesta.id, refEncuesta)
            : this._encuestaService.add(refEncuesta);

        resultadoServicio.subscribe(response => {
          if (response.valid) {
            this.cancel();
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  cancel() {
    this._route.navigate(['/listado-encuesta']);
  }
}
