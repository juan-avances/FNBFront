import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FinanciamientoForm, FinanciamientoListas } from 'src/app/models/financiamiento.model';
import { GlobalService } from 'src/app/services/global.service';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { formatDate } from '@angular/common';
import { ComboProducto } from '../../../../models/financiamiento.model';

import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Option } from 'src/app/@core/models/option.model';
import { ClienteService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-financiamiento-edit',
  templateUrl: './financiamiento-edit.component.html',
  styleUrls: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FinanciamientoEditComponent implements OnInit {
  @Input() financiamiento: FinanciamientoForm;
  @Input() listas: FinanciamientoListas;
  @Input() lineaCredito: 0;


  @ViewChild('txtSearchEmails', { static: false }) txtSearchEmails: ElementRef;
  @ViewChild('cboEmails', { static: false }) cboEmails: ElementRef;

  emails: string[] = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]
  emailsFind: string[] = this.emails;
  emailFirstElement = this.emailsFind[0]
  consentimiento: boolean = undefined;
  isHiddenListEmail = true;
  filteredOptions: Observable<Option[]>;
  forma: FormGroup;

  vendedor: any;

  tipoValidacion: string;
  lenghtValidacion: number;
  lenghtValidacionop: number;
  visibilidad: string;
  visibilidadOp: string;

  fecMinRecojo: Date;
  fecMaxRecojo: Date;
  fechaVenta: Date;
  fechaEntrega: Date;
  fechaActual: Date;

  ngGuardarFinanciamiento: boolean;

  ngFechaEntregaPerm: boolean;
  isRolGestorOperacion:boolean;
  totalMonto: number = 0;
  hayExceso: boolean = false;
  estadoFinanciamiento: string = '';

  rol: string;
  NombreCompleto: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(
    public _global: GlobalService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public _clienteService: ClienteService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.consultarConsentimiento();
    
    this.estadoFinanciamiento = this._financiamientoEdicionService.state == 'read' ? 'Ver' : 'Editar';
    this.forma = this._financiamientoEdicionService.setForm(this.financiamiento);

    this.rol = localStorage.getItem('RolUsuario');
    this.isRolGestorOperacion=true;//this.rol=="Gestor de operaci�n";
    this.fechaActual = new Date(Date.now());

    this._financiamientoEdicionService.hayExcesoLinea.subscribe(estado => {
      this.forma.get('excesoLinea').setValue(estado);
    });

    this.fechaVenta = this.financiamiento.fechaVenta;
    this.vendedor = this.financiamiento.vendedor;

    this.NombreCompleto = this.financiamiento.vendedorS;
    this.vendedor = this.financiamiento.vendedor;
    
    this.filteredOptions = this.forma.get('vendedorS').valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this._financiamientoEdicionService.obtenerListaVendedores(value))
    );
    this.forma.controls['vendedorS'].setValue(this.NombreCompleto); 
    this.activarControles();

    this.notify();

    if (this.financiamiento.pagoenTienda > 0 && this.financiamiento.pagoenTienda != this.financiamiento.montoPagado) {
      this.alerta(
        2,
        'El cliente tiene una deuda de S/. ' +
        this.financiamiento.pagoenTienda.toFixed(2) +
        ' , no se olvide de realizar el cobro.'
      );
    }
  }

  consultarConsentimiento() {
    const req = {
      "ClientCode": this.financiamiento.cuentaContrato,         
      "TypePolicyCode": "03"    
    }
    this._clienteService.ConsultarConsentimientoCliente(req).subscribe( res => {         
      if(res.data.valid){
        if(res.data.data.length > 0){          
          this.consentimiento = (res.data.data[0].accept == '1');
        }else{          
          this.consentimiento = undefined; 
        }
      }else{
        this.consentimiento = undefined;
      }
    })
  }

  activarControles() {
    if (
      this._global.validarPermiso('GUARFIN') ||
      this._global.validarPermiso('GUARFINTI') ||
      this._global.validarPermiso('GUARFINDE')
    ) {
      this.ngGuardarFinanciamiento = true;
    }

    if (
      this._global.validarPermiso('GUARFINDI') &&
      this._global.validarPermiso('GUARFINTI') &&
      this._global.validarPermiso('GUARFINDE')
    ) {
      this.ngFechaEntregaPerm = true;
    } else if (this._global.validarPermiso('GUARFINDE') || this._global.validarPermiso('GUARFINTI')) {
      this.ngFechaEntregaPerm = true;
    } else if (this._global.validarPermiso('GUARFINDI')) {
      this.ngFechaEntregaPerm = true;
    }

    if (this.fechaVenta) {
      if (this.financiamiento.tipoDespacho == 2) {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate());
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 15);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      } else if (this.financiamiento.tipoDespacho == 3) {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate() + 3);
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 18);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      }
    }


    if (this.financiamiento.tipoTelefono) {
      switch (this.financiamiento.tipoTelefono) {
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


    if (this.financiamiento.tipoTelefonoOp) {
      switch (this.financiamiento.tipoTelefonoOp) {
        case 'T001':
          this.lenghtValidacionop = 7;
          this.visibilidadOp = 'visible';
          this.tipoValidacion = '^[0-9]+$';
          break;
        case 'T002':
          this.lenghtValidacionop = 9;
          this.visibilidadOp = 'invisible';
          this.tipoValidacion = '^[0-9]+$';
          break;
      }
    } else this.visibilidadOp = 'invisible';


    const nroBoleta = this.forma.get('nroBoleta');
    const fechaEntrega = this.forma.get('fechaEntrega');
    const correoElectronico = this.forma.get('correoElectronico');
    const numeroTelefono = this.forma.get('numeroTelefono');
    nroBoleta.setValidators([Validators.required]);
    correoElectronico.setValidators([Validators.required, Validators.email, Validators.pattern(this.emailPattern)]);
    numeroTelefono.setValidators([Validators.required]);
    fechaEntrega.setValidators([Validators.required]);
  }

  changeTipoTel(value: any) {
    this.financiamiento.tipoTelefono = value;
    switch (this.financiamiento.tipoTelefono) {
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
  }

  changeTipoTelOp(value: any) {
    this.financiamiento.tipoTelefonoOp = value;
    switch (this.financiamiento.tipoTelefonoOp) {
      case 'T001':
        this.lenghtValidacionop = 7;
        this.visibilidadOp = 'visible';
        this.tipoValidacion = '^[0-9]+$';
        break;
      case 'T002':
        this.lenghtValidacionop = 9;
        this.visibilidadOp = 'invisible';
        this.tipoValidacion = '^[0-9]+$';
        break;
    }
  }

  submit() {
    if (!this.forma.valid) {
      return;
    }
    const objetoEnviar = this.forma.getRawValue();
    objetoEnviar.correoElectronico = objetoEnviar.correoElectronico.toLowerCase(); //lordonez
    objetoEnviar.aliadoComercialId = objetoEnviar.aliadoComercialId == null ? 0 : objetoEnviar.aliadoComercialId; //lordonez
    const format = 'yyyy-MM-dd';
    const locale = 'en-US';
    const formattedDate = formatDate(this.financiamiento.fechaVenta, format, locale);

    objetoEnviar.fechaVenta = formattedDate;
    objetoEnviar.detalle = this.formatearJson(this.financiamiento.detalle);
    if(this.forma.value.vendedor == null || this.forma.value.vendedor==undefined){
      objetoEnviar.vendedor = this.financiamiento.vendedor
    }else{
      objetoEnviar.vendedor = this.forma.value.vendedor.value;
    }
    
    this._financiamientoEdicionService.grabarFinanciamiento(objetoEnviar, "e");
  }
  displayFn(vendedor: any) {
      return vendedor.label === undefined?vendedor:vendedor.label;
   
  }
  formatearJson(lista: any) {
    let json = [];
    lista.forEach(aliadoX => {
      let aliado: ComboProducto = {};
      aliado.data = {};
      aliado.data.id = aliadoX.data.id;
      aliado.data.nombre = aliadoX.data.nombre;
      aliado.data.precio = aliadoX.data.precio;
      aliado.data.sku = aliadoX.data.sku;
      aliado.data.cantidad = aliadoX.data.cantidad;
      aliado.data.despacho = aliadoX.data.despacho;
      aliado.children = [];
      aliado.expanded = aliadoX.expanded;
      aliadoX.children.forEach(comboProductoX => {
        let combProducto: ComboProducto = {};
        combProducto.data = {};
        combProducto.data.id = comboProductoX.data.id;
        combProducto.data.nombre = comboProductoX.data.nombre;
        combProducto.data.precio = comboProductoX.data.precio;
        combProducto.data.sku = comboProductoX.data.sku;
        combProducto.data.cantidad = comboProductoX.data.cantidad;
        combProducto.data.tipo = comboProductoX.children != null ? 'C' : 'P';
        combProducto.expanded = comboProductoX.expanded;
        combProducto.children = [];
        if (comboProductoX.children != null) {
          comboProductoX.children.forEach(productoX => {
            let producto: ComboProducto = {};
            producto.data = {};
            producto.data.id = productoX.data.id;
            producto.data.nombre = productoX.data.nombre;
            producto.data.precio = productoX.data.precio;
            producto.data.sku = productoX.data.sku;
            producto.data.cantidad = productoX.data.cantidad;
            combProducto.children.push(producto);
          });
        }
        aliado.children.push(combProducto);
      });
      json.push(aliado);
    });
    return json;
  }

  obtenerTotal(): number {
    return Math.min(this.lineaCredito, this.sumarSubTotales());
  }

  verificarExcesoLineaCredito(): boolean {
    this.hayExceso = this.sumarSubTotales() > this.lineaCredito;
    return this.hayExceso;
  }

  sumarSubTotales() {
    let suma = 0;
    let cantidad = 0;
    if (this.financiamiento.detalle.length > 0) {
      let lista = this.financiamiento.detalle;
      lista.forEach(aliado => {
        aliado.children.forEach(comboproducto => {
          suma += comboproducto.data.cantidad * comboproducto.data.precio;
          cantidad += comboproducto.data.cantidad;
        });
        aliado.data.cantidad = cantidad;
        aliado.data.precio = suma;
        cantidad = 0;
        suma = 0;
      });
      this.financiamiento.detalle = lista;
      this.formatearJson(lista);
      suma = this.financiamiento.detalle.map(item => item.data.precio).reduce((prev, next) => prev + next);
    }
    this.totalMonto = suma;
    return suma;
  }

  notify() {
    this._financiamientoEdicionService.totalPedidoChange.next(this.obtenerTotal());
    this._financiamientoEdicionService.hayExcesoLinea.next(this.verificarExcesoLineaCredito());
    this.financiamiento.detalle = [...this.financiamiento.detalle];
  }
  public ngSelectAutocomplete_onOptionsSelected(event) {
    const valueSelected = this.cboEmails.nativeElement.value;

    const valueInput = this.txtSearchEmails.nativeElement.value;
    const findArroba = valueInput.indexOf("@");
    const newValueCharset = findArroba >= 0 ? valueInput.substr(findArroba, valueInput.length) : '';

    this.forma.get('correoElectronico').setValue(valueInput.replace(newValueCharset, valueSelected));
    this.forma.get('correoElectronico').updateValueAndValidity();

    this.cboEmails.nativeElement.value = ""
    this.isHiddenListEmail = true;


  }

  public ngtxtSearchEmails_keyPress(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const valueInput = this.txtSearchEmails.nativeElement.value;
    const newValue = `${valueInput}${inputChar}`
    const findArroba = newValue.indexOf("@");
    const newValueCharset = findArroba >= 0 ? newValue.substr(findArroba, newValue.length) : ''

    this.mpFillListEmail(newValueCharset)
    this.isHiddenListEmail = (findArroba < 0 || findArroba >= 0) && this.emails.length == 0

    this.cboEmails.nativeElement.selectedIndex = 0

  }

  public ngtxtSearchEmails_keyDown(event: KeyboardEvent) {
    const key = event.key;
    if (key == 'ArrowDown') {

      const lengthEmailsFind = this.emails.length;
      this.cboEmails.nativeElement.focus();
      this.cboEmails.nativeElement.value = this.emails[0];

    } else if (key === "Backspace" || key === "Delete") {
      const valueInput = this.txtSearchEmails.nativeElement.value;
      const findArroba = valueInput.indexOf("@");
      const newValueCharset = findArroba >= 0 ? valueInput.substr(findArroba, valueInput.length) : ''

      this.mpFillListEmail(newValueCharset)
      this.isHiddenListEmail = (findArroba < 0 || findArroba >= 0) && this.emails.length == 0
      this.txtSearchEmails.nativeElement.setAttribute("selected", true)
    }
  }

  public ngcboEmails_keydown(event: KeyboardEvent) {
    const key = event.key;
    const valueSelected = this.cboEmails.nativeElement.value;
    const siseMaxEmails = this.emails.length - 1;
    if (key === "Enter") {
      this.ngSelectAutocomplete_onOptionsSelected(event)
      this.txtSearchEmails.nativeElement.focus()
    } else if ((key == "ArrowDown" || key == "ArrowUp") &&
      (valueSelected == "-1" || siseMaxEmails == 0)
    ) {
      this.txtSearchEmails.nativeElement.focus()
      this.cboEmails.nativeElement.value = this.emails[0];
    }
  }
  private mpFillListEmail(newValue: string) {

    this.emails = newValue == "" ? [] : this.emailsFind.filter(x => x.toString().indexOf(newValue) >= 0)
    this.cboEmails.nativeElement.value = null

  }

  alerta(tipo: number, mensaje: string) {
    if (tipo == 2) {
      swal({
        text: mensaje,
        type: 'warning',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: false
      });
    }
  }
}
