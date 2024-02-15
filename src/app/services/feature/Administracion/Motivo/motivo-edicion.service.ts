import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { switchMap, map, filter } from 'rxjs/operators';
import { Motivo } from 'src/app/models/motivo.model';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { MotivoService } from 'src/app/services/backend.service.index';
import { Option } from 'src/app/@core/models/option.model';

@Injectable({
  providedIn: 'root'
})
export class MotivoEdicionService {
  motivoId: any;
  motivoActual: Motivo;
  renderer2: Renderer2;

  constructor(public _route: Router, public _motivoService: MotivoService, public _rendererFactory: RendererFactory2) {
    this.renderer2 = _rendererFactory.createRenderer(null, null);
  }

  init(_activatedRoute: ActivatedRoute): Observable<Motivo> {
    return _activatedRoute.params.pipe(
      switchMap(params => {
        const motivoId = params['id'];
        return this._motivoService.get(motivoId).pipe(
          map(response => {
            if (response.valid) {
              return response.data;
            }
          })
        );
      })
    );
  }

  get(motivoId: any): Observable<Motivo> {
    return this._motivoService.get(motivoId).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  getForm(refMotivo: Motivo) {
    return new FormGroup({
      id: new FormControl(refMotivo.id),
      estado: new FormControl(refMotivo.estado),
      codigo: new FormControl(refMotivo.codigo, [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(ExpressionValidation.CodigoMotivo)
      ]),
      nombre: new FormControl(refMotivo.nombre, [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(ExpressionValidation.LetterNumberSign)
      ]),
      esOtro: new FormControl(refMotivo.esOtro)
    });
  }

  saveChange(refMotivo: any) {
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
          refMotivo.id > 0 ? this._motivoService.update(refMotivo.id, refMotivo) : this._motivoService.add(refMotivo);

        resultadoServicio.subscribe(response => {
          if (response.valid) {
            this.cancel();
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  obtenerMotivos(): Observable<Option[]> {
    return this._motivoService.obtenerMotivos().pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }

  cancel() {
    this._route.navigate(['/listado-motivo']);
  }
}
