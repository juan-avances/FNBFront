import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteEdicionService } from 'src/app/services/feature/Administracion/Cliente/cliente-edicion.service';
import { Cliente } from 'src/app/models/cliente.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edicion-cliente',
  templateUrl: './cliente-edicion.component.html',
  styles: []
})
export class ClienteEdicionComponent implements OnInit {
  clienteActual: Cliente;
  forma: FormGroup;

  lenghtValidacion: number;
  visibilidad: string;
  tipoValidacion: string;

  longitudDocumento: number;
  maskDocumento = {};

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _clienteEdicionServicio: ClienteEdicionService,
    public _renderer2: Renderer2
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._clienteEdicionServicio.init(this._activatedRoute).subscribe(response => {
      this.clienteActual = response;
      this.forma = this._clienteEdicionServicio.getForm(this.clienteActual);
      this.tipoTelefonoChange(this.clienteActual.tipoTelefono);
    });
  }

  onSubmit() {
    if (this.forma.valid) {
      this._clienteEdicionServicio.saveChange(this.forma.getRawValue());
    }
  }

  cancelar() {
    this._clienteEdicionServicio.cancel();
  }

  tipoDocumentoChange(tipo: any) {
    if (tipo) {
      switch (tipo) {
        case 'PE2':
          this.maskDocumento = {
            guide: false,
            showMask: false,
            mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
          };
          this.longitudDocumento = 8;
          break;
        case 'PE3':
          this.maskDocumento = {
            guide: false,
            showMask: false,
            mask: [/\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/]
          };
          this.longitudDocumento = 12;
          break;
        case 'PE5':
          this.maskDocumento = {
            guide: false,
            showMask: false,
            mask: [/\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/]
          };
          this.longitudDocumento = 12;
          break;
        default:
          this.maskDocumento = {};
          this.longitudDocumento = 0;
          break;
      }
    }
  }

  tipoTelefonoChange(tipo: any) {
    if (tipo) {
      switch (tipo) {
        case 'T001':
          this.lenghtValidacion = 7;
          this.visibilidad = 'visible';
          this.tipoValidacion = '^[0-9]+$';
          break;
        case 'T002':
          this.lenghtValidacion = 9;
          this.visibilidad = 'invisible';
          this.tipoValidacion = '^[0-9]+$';
          break;
      }
    } else this.visibilidad = 'invisible';
  }
}
