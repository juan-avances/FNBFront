import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AliadoComercial } from '../../../../models/aliadoComercial.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AliadoComercialService } from '../../../backend.service.index';
import { ExpressionValidation } from '../../../../@core/helpers/expression.validation';
import swal from 'sweetalert2';
import { JsonResult } from '../../../../@core/models/jsonresult.model';
import { Base64Helper } from '../../../../@core/helpers/base64-helper.helper';

@Injectable({
  providedIn: 'root'
})
export class AliadoComercialEdicionService {
  aliadoComercialId: number;
  aliadoComercialActual: AliadoComercial;
  firmaUpload: ElementRef;
  inputPassword: ElementRef;
  archivoActual: File;
  mostrarPassword: boolean;
  renderer2: Renderer2;

  constructor(
    public _route: Router,
    public _aliadoComercialService: AliadoComercialService,
    public _rendererFactory: RendererFactory2
  ) {
    this.renderer2 = _rendererFactory.createRenderer(null, null);
  }

  init(activatedRoute: ActivatedRoute): Observable<any> {
    return new Observable(observe => {
      this.processParamRequest(activatedRoute, observe);
    });
  }

  processParamRequest(activatedRoute: ActivatedRoute, observer) {
    activatedRoute.params.subscribe(params => {
      this.aliadoComercialId = params['id'];
      this._aliadoComercialService.get(this.aliadoComercialId).subscribe(response => {
        if (response.valid) {
          this.aliadoComercialActual = response.data;
          observer.next({
            usuario: this.aliadoComercialActual
          });
        }
      });
    });
  }
}
