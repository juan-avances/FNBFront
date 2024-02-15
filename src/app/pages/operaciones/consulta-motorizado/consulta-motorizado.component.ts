import { Component, DebugElement, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { maxLength, minLength } from '@rxweb/reactive-form-validators';
import { FinanciamientoService } from 'src/app/services/backend.service.index';
import swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-motorizado',
  templateUrl: './consulta-motorizado.component.html',
  styleUrls: ['./consulta-motorizado.component.scss']
})
export class ConsultaMotorizadoComponent implements OnInit {

  public listaTipoBusqueda: any[] = ['N°Pedido', 'N°Contrato'];
  public tipoBusqueda: string = 'N°Pedido';
  public lenghtValidacion: number = 0;
  numeroDocumentoBusqueda: any;
  constructor(
    private financiamientoService: FinanciamientoService,
    private _sanitizer: DomSanitizer
  ) { }

  respuestaClienteRecepcion: any;
  busquedaValida: boolean = false;

  cliente: any;
  validarCliente: boolean = false;
  personaRecepciona: any;
  validaPersonaRecepciona: boolean = false;

  photob64: any;
  firmab64: any;
  recepcionaOtraPersona: boolean = false;;

  photob64PersonaRecepciona: any;
  firmab64PersonaRecepciona: any;

  validacionRegistrada: boolean = false;
  idFinancimiento: number;

  isFallecido:boolean = false;
  isFallecidoReceptor:boolean = false;
  ngOnInit() {
  }

  changeTipoBusqueda(_event: any) {
    this.tipoBusqueda = _event.value;
    switch (this.tipoBusqueda) {
      case 'N°Pedido':
        this.lenghtValidacion = 10;
        minLength
        maxLength

        break;
      case 'N°Contrato':
        this.lenghtValidacion = 8;
        maxLength
        break;
    }
  }

  limpiar() {
    this.busquedaValida = false;
    this.validarCliente = false;
    this.validaPersonaRecepciona = false;
    this.validacionRegistrada = false;
    this.recepcionaOtraPersona = false;
  }

  onSearch(form: NgForm) {

    this.limpiar();
    this.busquedaValida = false;
    this.numeroDocumentoBusqueda = form.value.documento;
    
    this.financiamientoService.getDatosClienteRecepcion(
      form.value.tipoBusqueda,
      form.value.documento)
      .subscribe(response => {
        
        if (response.valid) {

          this.idFinancimiento = response.data.idFinanciamiento;
          this.busquedaValida = true;
          this.validacionRegistrada = response.data.validado;
          this.respuestaClienteRecepcion = response.data;

          this.recepcionaOtraPersona = response.data.documentoPersonaRecepciona != null;
        } else {
          this.busquedaValida = false;
        }
      }, error => {
        this.busquedaValida = false;
      });
  }

  validar(documento: string) {
    this.validarCliente = false;
    this.financiamientoService.getConsultaDocumentoCliente(documento)
      .subscribe(resp => {
        if (resp.valid) {
          this.cliente = resp.data;
          //debugger;
          this.isFallecido = resp.data.fallecido; 
          if(this.isFallecido)
            swal("Error", "El persona validada figura como fallecido", 'error');
          this.photob64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + resp.data.foto);
          this.firmab64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + resp.data.firma);

          
          this.validarCliente = true;
        } else {
          this.validarCliente = false;
        }
      }, error => {
        this.validarCliente = false;
      })
  }

  validarPersonaRecepciona(documento: string) {
    this.validaPersonaRecepciona = false;
    this.financiamientoService.getConsultaDocumentoCliente(documento)
      .subscribe(resp => {
        if (resp.valid) {
          this.personaRecepciona = resp.data;
          this.isFallecidoReceptor = resp.data.fallecido; 
          if(this.isFallecidoReceptor)
            swal("Error", "El persona validada figura como fallecido", 'error');
          this.photob64PersonaRecepciona = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + resp.data.foto);
          this.firmab64PersonaRecepciona = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + resp.data.firma);

          
          this.validaPersonaRecepciona = true;
        } else {
          this.validaPersonaRecepciona = false;
        }
      }, error => {
        this.validaPersonaRecepciona = false;
      })
  }

  registarrValidacion(esTitular: boolean = true) {

    if(this.isFallecido || this.isFallecidoReceptor){
      swal("Error", "El persona validada figura como fallecido", 'error');
      return;
    }

    let item = {
      id: this.idFinancimiento,
      recibeCliente: esTitular
    }
    this.financiamientoService.registrarValidacion(item)
      .subscribe(resp => {
        if(resp.valid) {
          this.validacionRegistrada = true;
          swal("Enviado", "Validacion exitosa, se registro en el sistema.", 'success');
        }else{
          this.validacionRegistrada = false;
        }
      },err => {
        this.validacionRegistrada = false;
      })
  }

}
