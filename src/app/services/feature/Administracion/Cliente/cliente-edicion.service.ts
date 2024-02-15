import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from '../../../../models/cliente.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ClienteService } from '../../../backend.service.index';
import { FinanciamientoService } from '../../../backend/financiamiento.service';
import { switchMap, map } from 'rxjs/operators';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteEdicionService {
  clienteId: number;
  clienteActual: Cliente;
  lineaCredito: string;
  forma: FormGroup;
  renderer2: Renderer2;

  constructor(
    public _route: Router,
    public _clienteService: ClienteService,
    public _rendererFactory: RendererFactory2,
    public _financiamientoService: FinanciamientoService
  ) {
    this.renderer2 = _rendererFactory.createRenderer(null, null);
  }

  init(_activatedRoute: ActivatedRoute): Observable<Cliente> {
     
    return _activatedRoute.params.pipe(
      switchMap(params => {
        const clienteId = params['id'];
        return this._clienteService.get(clienteId).pipe(
          map(response => {
            if (response.valid) {
              return response.data;
            }
          })
        );
      })
    );
  }

  getForm(clienteref: Cliente) {
    return new FormGroup({
      id: new FormControl(clienteref.id),
      idUsuario: new FormControl(clienteref.idUsuario),
      estado: new FormControl(clienteref.estado),
      nombres: new FormControl(clienteref.nombres, [
        Validators.required,
        Validators.pattern(ExpressionValidation.LetterSpace)
      ]),
      apellidos: new FormControl(clienteref.apellidos, [
        // Validators.required,
        // Validators.pattern(ExpressionValidation.LetterSpace)
      ]),
      correo: new FormControl(clienteref.correo, [Validators.required, Validators.email]),
      tipoDocumento: new FormControl(clienteref.tipoDocumento ? clienteref.tipoDocumento.toString() : null, [
        Validators.required
      ]),
      nroDocumento: new FormControl(clienteref.nroDocumento, [Validators.required]),
      tipoTelefono: new FormControl(clienteref.tipoTelefono ? clienteref.tipoTelefono.toString() : null, [
        Validators.required
      ]),
      nroTelefono: new FormControl(clienteref.nroTelefono, [Validators.required]),

      nroTelefonoOp: new FormControl(clienteref.nroTelefonoOp)

      
    });
  }

  saveChange(refcliente: any) {
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
          refcliente.id > 0
            ? this._clienteService.update(refcliente.id, refcliente)
            : this._clienteService.add(refcliente);

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
    this._route.navigate(['/listado-cliente']);
  }
}
