import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinanciamientoForm, FinanciamientoListas } from 'src/app/models/financiamiento.model';
import { GlobalService } from 'src/app/services/global.service';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { SimuladorCuotasComponent } from '../simulador-cuotas/simulador-cuotas.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Option } from '../../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';

import { formatDate } from '@angular/common';
import { ComboProducto } from '../../../../models/financiamiento.model';
import { FinanciamientoCombosComponent } from '../financiamiento-combos/financiamiento-combos.component';
import { FinanciamientoDespachoComponent } from '../financiamiento-despacho/financiamiento-despacho.component';
import swal from 'sweetalert2';
import { OfflineService } from 'src/app/services/backend/offline.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DataService } from 'src/app/services/servicesData';
import { ValidacionReniecComponent } from 'src/app/pages/shared/validacion-reniec/validacion-reniec.component';
import { ClienteService, UsuarioService } from 'src/app/services/backend.service.index';
import { Cliente } from 'src/app/models/cliente.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Console } from 'console';
@Component({
  selector: 'app-financiamiento-create',
  
  
  templateUrl: './financiamiento-create.component.html',
  styleUrls: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FinanciamientoCreateComponent implements OnInit {
  @Input() financiamiento: FinanciamientoForm;
  @Input() listas: FinanciamientoListas;
  @Input() lineaCredito: 0;
  @ViewChild(FinanciamientoCombosComponent, { static: false }) financiamientoCombosComponent;
  @ViewChild('txtSearchEmails', { static: false }) txtSearchEmails: ElementRef;
  @ViewChild('cboEmails', { static: false }) cboEmails: ElementRef;

  emails: string[] = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]
  emailsFind: string[] = this.emails;
  emailFirstElement = this.emailsFind[0]
  consentimiento: boolean = undefined;
  isHiddenListEmail = true;

  
  forma: FormGroup;


  Vendedores: Observable<Option[]>;
  distritoId:string;
  provinciaId:string;
  departamentoId:string;
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
  fechaEmision: Date;

  ngGuardarFinanciamiento: boolean;

  ngFechaEntregaPerm: boolean;

  ViewUserResto: string;
  ViewUserVendedor: string;

  totalMonto: number = 0;
  hayExceso: boolean = false;
  idCanalAnterior: number = 0;
  cliente: Cliente;

  isValiadIndentidad = false;
  isValidReniec:boolean = false;
  tipoVal:number=0;
  photob64 : any;
  firmab64: any;
  usuariosValidadores: any;
  showCertificado:boolean = false;
  statusValidacionReniec:boolean = false;
  isRolVolante:boolean=false;
  public  TipoValidacion:Array<{id: number, text: string}> = [
   
    {id: 1, text: 'RENIEC'},
    {id: 2, text: 'Whatsapp'},

  ];

  

  public rol;
  public NombreCompleto;
  consentimientoInvalid: boolean = false;
  consentimientoApi: boolean = false;

  constructor(
    public _global: GlobalService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public dialog: MatDialog,
    public _headerComponente: HeaderComponent,
    public _dataServices : DataService,
    public _offlineService: OfflineService,
    public _clienteService: ClienteService,
    public _usuarioService: UsuarioService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    
    this.consultarConsentimiento();

    this._financiamientoEdicionService.statusValidacionReniec().subscribe(r => {
      //debugger;
      this.statusValidacionReniec = r;
    });

    this.forma = this._financiamientoEdicionService.setForm(this.financiamiento);
    
    this.forma.get('correoElectronico').setValidators([Validators.required,Validators.email]);
    this.rol = localStorage.getItem('RolUsuario');
    this.isRolVolante=this._global.isVendedorRetailVolante() || this._global.isVendedorCSCVolante();
    if(this.isRolVolante){
      this.forma.get('vendedor').setValue=this.vendedor;
    }
    this.fechaActual = new Date(Date.now());

    if (this.isRolVolante ||  this.rol == 'Vendedor Retail' || this.rol == 'Vendedor Call Center' || this.rol == 'Vendedor CSC'|| this.rol == 'Vendedor Retail 2'){
    let idAliado: number = Number(localStorage.getItem('IdAliado'));
      if(idAliado)
      {
        
        this._financiamientoEdicionService.showButtonCertificado(idAliado).subscribe(r => {
          this.showCertificado = r;
        });
      }
    }
    this.Vendedores = this.forma.get('vendedor').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this._financiamientoEdicionService.obtenerListaVendedores(value))
    );

    this.forma.get('nroCuota').valueChanges.subscribe(value => {
      this.updateMontoCuota(value.replace('NB', ''), this._financiamientoEdicionService.totalPedidoChange.value);
    });

    this._financiamientoEdicionService.totalPedidoChange.subscribe(newTotal => {
      const nroCuota = this.forma.get('nroCuota').value;
      if (nroCuota) {
        this.updateMontoCuota(nroCuota.replace('NB', ''), newTotal);
      }
    });


    this.forma.get('nroCuota').valueChanges.subscribe(value => {
      this.updatePagoMensual(value.replace('NB', ''), this._financiamientoEdicionService.totalPedidoChange.value);
    });

    this._financiamientoEdicionService.totalPedidoChange.subscribe(newTotal => {
      const nroCuota = this.forma.get('nroCuota').value;
      if (nroCuota) {
        this.updatePagoMensual(nroCuota.replace('NB', ''), newTotal);
      }
    });

    this._financiamientoEdicionService.hayExcesoLinea.subscribe(estado => {
      this.forma.get('excesoLinea').setValue(estado);
    });

    this._clienteService.get(this.financiamiento.clienteId).subscribe(value =>{
      this.cliente = value.data;

      if(this.cliente.tipoDocumento == 'PE2' && this.statusValidacionReniec)
      {
        this.TipoValidacion = this.TipoValidacion.filter(f=>f.id == 1);
      }
      else if(this.cliente.tipoDocumento == 'PE2' && !this.statusValidacionReniec)
      {
        this.TipoValidacion = this.TipoValidacion.filter(f=>f.id == 2);
      }
      else if(this.cliente.tipoDocumento != 'PE2')
      {
        this.TipoValidacion = this.TipoValidacion.filter(f=>f.id == 2);
      }

    });

    this._usuarioService.usuariosValidadores().subscribe(value => {
      this.usuariosValidadores = value.data;
    });

    this.fechaVenta = this.fechaActual;
    
    if (this.isRolVolante || this.rol == 'Vendedor Retail' || this.rol == 'Vendedor Call Center' || this.rol == 'Vendedor CSC'|| this.rol == 'Vendedor Retail 2') {
      this.ViewUserResto = 'd-none';
      this.ViewUserVendedor = 'd-block';
      this.NombreCompleto = localStorage.getItem('NombreyApellidos');
      this.vendedor = localStorage.getItem('id').toString();
    } else {
      this.ViewUserResto = 'd-block';
      this.ViewUserVendedor = 'd-none';
    }

    this.activarControles();
   
    this.aliadoChange(this.financiamiento.aliadoComercialId);

    this.financiamiento.detalle = [];
    this.notify();
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
          if(this.consentimiento){
            this.consentimientoApi = true;
          }
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
      if (this.financiamiento.tipoDespacho == 1) {
        this.fechaEntrega = this.fechaVenta;
      } else {
        this.fecMinRecojo = new Date(this.fechaVenta);
        this.fecMaxRecojo = new Date(this.fechaVenta);
        this.fecMinRecojo.setDate(this.fecMinRecojo.getDate() + 3);
        this.fecMaxRecojo.setDate(this.fecMaxRecojo.getDate() + 18);
        localStorage.setItem('fechaMinRecojo', this.fecMinRecojo.toString());
        localStorage.setItem('fechaMaxRecojo', this.fecMaxRecojo.toString());
      }
    }

    if (this.financiamiento.tipoTelefono) {
      this.changeTipoTel(this.financiamiento.tipoTelefono);
    } else {
      this.visibilidad = 'invisible';
    }

    if (this.financiamiento.tipoTelefonoOp) {
      this.changeTipoTelOp(this.financiamiento.tipoTelefonoOp);
    } else {
      this.visibilidadOp = 'invisible';
    }
  }

  updateMontoCuota(nroCuota: number, montoTotal: number) {
    this._financiamientoEdicionService.tasaMensualFinanciamiento().subscribe(tasa => {
      const tasaMensual = parseFloat(tasa.toString());
      const cuotaActual = this._financiamientoEdicionService.calcularCuotaSinIGV(montoTotal, nroCuota, tasaMensual);
      this.forma.get('montoCuota').setValue(cuotaActual);
    });
  }

  //Pago Mensual Funcion
  updatePagoMensual(nroCuota: number, montoTotal: number) {
    this._financiamientoEdicionService.tasaMensualFinanciamiento().subscribe(tasa => {
      const tasaMensual = parseFloat(tasa.toString());
      const cuotaActual = this._financiamientoEdicionService.calcularCuota(montoTotal, nroCuota, tasaMensual);
      this.forma.get('pagoMensual').setValue(cuotaActual);
    });
  }

  aliadoChange(idAliadoComercial: number) {
 
    this._financiamientoEdicionService.obtenerSedesAliado(idAliadoComercial).subscribe(response => {
  
      this.listas.sedes = response;
    });
  }

  canalChange(idCanal: any) {
    const canalVenta = this.forma.get('canalVentaId');
    if (this.financiamiento.detalle.length > 0) {
      swal({
        text:
          'Está cambiando de canal de venta, se eliminará todos los productos o combos registrados, ¿Está seguro de su cambio?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          canalVenta.setValue(idCanal.value.toString());
          this.idCanalAnterior = idCanal.value;
          this.financiamiento.canalVentaId = this.idCanalAnterior;
          this.financiamientoCombosComponent.cargarCombos(this.financiamiento.aliadoComercialId, idCanal.value, '');
          this.financiamiento.detalle = [];
          this.notify();
        } else {
          this.financiamiento.canalVentaId = this.idCanalAnterior;
          canalVenta.setValue(this.idCanalAnterior.toString());
        }
      });
    } else {
      this.idCanalAnterior = idCanal.value;
      canalVenta.setValue(this.idCanalAnterior);
      this.financiamientoCombosComponent.cargarCombos(this.financiamiento.aliadoComercialId, idCanal.value, '');
    }
  }


  submit() {
    if( this.consentimiento == undefined){
      swal('Error','Gestionar el consentimiento de datos del cliente.','error');
      this.consentimientoInvalid = true;
      return;
    }
    if(this.vendedor == null){
      swal('Error','Seleccionar un vendedor correcto.','error');
      return;
    }

    var op = this.forma.get("tipoValidacionIdentidad").value;
    if(op == 1)
    {
      if(this.cliente.tipoDocumento == 'PE2' && !this.isValidReniec)
        {
          if(!this.forma.controls['validacionReniec'].value)
          {
            swal('Requiere validacion por reniec!','','error');
          }
        }
    }

    if(!this.forma.valid)
    {
      return;
    }
    if (this.validarSubmit()) {
      this._offlineService.getConfiguraciones().subscribe(obj=>{
        this._headerComponente.estado = obj.data.estadoSap;
        this._headerComponente.getCssColor(this._headerComponente.estado);
        
        this._dataServices.setMessage(this._headerComponente.color);
      })   
      this.distritoId=localStorage.getItem('distritoId')?localStorage.getItem('distritoId').toString():"";
      this.departamentoId=localStorage.getItem('departamentoId')?localStorage.getItem('departamentoId').toString():"";
      this.provinciaId=localStorage.getItem('provinciaId')?localStorage.getItem('provinciaId').toString():"";
      const objetoEnviar = this.forma.getRawValue();
      objetoEnviar.correoElectronico = objetoEnviar.correoElectronico.toLowerCase(); //lordonez
      objetoEnviar.aliadoComercialId = objetoEnviar.aliadoComercialId == null ? 0 : objetoEnviar.aliadoComercialId; //lordonez
      const format = 'yyyy-MM-dd';
      const locale = 'en-US';
      const formattedDate = formatDate(this.financiamiento.fechaVenta, format, locale);

      objetoEnviar.fechaVenta = formattedDate;
      objetoEnviar.detalle = this.formatearJson(this.financiamiento.detalle);
      objetoEnviar.vendedor = this.vendedor;
      objetoEnviar.pagoenTienda = this.totalMonto > this.lineaCredito ? this.lineaCredito - this.totalMonto : 0;
      objetoEnviar.totalMonto = this.totalMonto > this.lineaCredito ? this.lineaCredito : this.totalMonto;
      objetoEnviar.consentimiento = this.consentimiento;
      this._financiamientoEdicionService.grabarFinanciamientoForm(objetoEnviar);

    }
    this._offlineService.getConfiguraciones().subscribe(obj=>{
      this._headerComponente.estado = obj.data.estadoSap;
      this._headerComponente.getCssColor(this._headerComponente.estado);
      this._dataServices.setMessage(this._headerComponente.color);
    }) 
  }

 
  validarSubmit() {
    //Setear validadores
    let monto = this.lineaCredito;
    this.financiamiento.detalle.map(aliado => {
      monto -= aliado.data.despacho.tipoDespacho == 3 ? aliado.data.precio : 0;
    });

    for (let i = 0; i < this.financiamiento.detalle.length; i++) {
      let aliado = this.financiamiento.detalle[i];
      if (aliado.data.despacho.tipoDespacho == null) {
        this.alerta(2, 'Por favor elegir el despacho de ' + aliado.data.nombre);
        return false;
      }
      if (monto < 0 && aliado.data.sedes > 0 && aliado.data.despacho.tipoDespacho == 3) {
        this.alerta(2, 'Por favor elegir tipo despacho Recojo en Tienda o Entrega Inmediata de  ' + aliado.data.nombre);
        return false;
      }
    }
    if(this.consentimiento == undefined){
      this.alerta(2, 'Por favor elegir el consentimiento  para fines adicionales / comerciales.');
      return false;
    }
    return true;
  }

  formatearJson(lista: any) {
    let json = [];
    lista.forEach(aliadoX => {
      let aliado: ComboProducto = {};      
      aliadoX.data.despacho.distritoId=this.distritoId;
      aliadoX.data.despacho.provinciaId=this.provinciaId;
      aliadoX.data.despacho.departamentoId=this.departamentoId;
      aliado.data = {};
      aliado.data.id = aliadoX.data.id;
      aliado.data.nombre = aliadoX.data.nombre;
      aliado.data.precio = aliadoX.data.precio;
      aliado.data.sku = aliadoX.data.sku;
      aliado.data.cantidad = aliadoX.data.cantidad;
      aliado.data.sedes = aliadoX.data.sedes;
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

  simularCuotas() {
    const dialogRef = this.dialog.open(SimuladorCuotasComponent, {
      width: '90%'
    });
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

  changeVendedor(Vendedor: any) {
    this.vendedor = Vendedor.option.value.value;
  }

  displayFn(vendedor: any) {
    if (vendedor) {
      return vendedor.label;
    }
  }

  agregarComboProducto(objCP: any) {
    let aliadoExiste: boolean = false;
    let comboproductoExiste: boolean = false;
    let tipo: string = '';
    let cantidad: number = 0;
    let lista = this.financiamiento.detalle;
    tipo = objCP.children[0].children != null ? 'C' : 'P';
    cantidad = objCP.children[0].data.cantidad;

    if (this.validarAgregarProducto(objCP)) {
      lista.map(aliado => {
        if (aliado.data.id === objCP.data.id) {
          aliado.children.map(comboproducto => {
            if (comboproducto.data.id === objCP.children[0].data.id && comboproducto.data.tipo === tipo) {
              if (comboproducto.children !== null) {
                comboproducto.children.map(producto => {
                  producto.data.cantidad += cantidad;
                });
              }
              comboproducto.data.cantidad += cantidad;
              comboproductoExiste = true;
            }
          });
          if (!comboproductoExiste) {
            aliado.children.push(objCP.children[0]);
          }
          aliadoExiste = true;
        }
      });

      if (!aliadoExiste && !comboproductoExiste) {
        lista.push(objCP);
        this.despachoComboProducto(objCP.data);
      }
    }

    this.financiamiento.detalle = this.formatearJson(lista);

    this.notify();
  }

  eliminarComboProducto(objCP: any) {
    let aliado = -1;
    let comboproducto = -1;
    let lista = this.financiamiento.detalle;
    for (let a = 0; a < lista.length; a++) {
      if (lista[a].data.id == objCP.id && objCP.nivel == 0) {
        aliado = a;
        break;
      }
      for (let cp = 0; cp < lista[a].children.length; cp++) {
        if (lista[a].children[cp].data.id == objCP.id && objCP.nivel == 1) {
          aliado = a;
          comboproducto = cp;
          break;
        }
      }
    }

    if (objCP.nivel == 0) lista.splice(aliado, 1);
    if (objCP.nivel == 1) lista[aliado].children.splice(comboproducto, 1);

    if (lista.length > 0 && lista[aliado].children.length == 0) {
      lista.splice(aliado, 1);
    }

    this.financiamiento.detalle = this.formatearJson(lista);

    this.notify();
  }

  despachoComboProducto(objCP: any) {
    const dialogRef = this.dialog.open(FinanciamientoDespachoComponent, {
      width: '700px',
      data: {
        cuentaContrato: this.financiamiento.cuentaContrato,
        despacho: objCP.despacho,
        aliado: objCP,
        departamentos: this.listas.departamentos,
        tipoVentas: this.listas.tipoVenta,
        fechaVenta: this.fechaVenta
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let lista = this.financiamiento.detalle;
        lista.forEach(aliado => {
          if (aliado.data.id == objCP.id) {
            aliado.data.despacho = result;
          }
        });
        this.financiamiento.detalle = this.formatearJson(lista);
      }
      this.notify();
    });
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


  validarAgregarProducto(objCP: any) {
    let lista: any = [];
    let monto: number = 0;

    //Obtener aliados
    this.financiamiento.detalle.map(aliado => {
      let ali: any = {};
      ali.sedes = aliado.data.sedes;
      ali.id = aliado.data.id;
      ali.precio = aliado.data.precio;
      ali.tipoDespacho = aliado.data.despacho.tipoDespacho;
      lista.push(ali);
    });

    //Validar
    if (this.financiamiento.detalle.length == 0) {
      monto += objCP.children[0].data.precio * objCP.children[0].data.cantidad;
      if (monto > this.lineaCredito && objCP.data.sedes == 0 && this.financiamiento.canalVentaId == 2) {
        let mensaje =
          'No puede agregar ' +
          objCP.children[0].data.nombre +
          ', porque supera su linea de crédito y el proveedor no cuenta con sedes para realizar la compra.';
        this.alerta(2, mensaje);
        return false;
      }
    } else if (this.financiamiento.detalle.length > 0) {
      monto = this.lineaCredito;
      let existeAliadoSedes = false;
      lista.map(aliado => {
        if (aliado.sedes == 0) {
          monto -= aliado.precio;
        } else {
          existeAliadoSedes = true;
        }
      });
      let esMenorMonto = monto - objCP.children[0].data.precio * objCP.children[0].data.cantidad;
      if (objCP.data.sedes == 0 && esMenorMonto < 0) {
        let mensaje = 'No puede agregar ' + objCP.children[0].data.nombre + ', porque supera su linea de crédito.';
        this.alerta(2, mensaje);
        return false;
      } else if (existeAliadoSedes && esMenorMonto < 0 && objCP.data.sedes == 0) {
        lista.map(aliado => {
          if (aliado.id == objCP.data.id) {
            if (aliado.sedes == 0) {
              let mensaje =
                'No puede agregar ' +
                objCP.children[0].data.nombre +
                ', porque supera su linea de crédito y no cuenta con sedes disponibles.';
              this.alerta(2, mensaje);
              return false;
            }
          }
        });
      } else if (!existeAliadoSedes && esMenorMonto < 0 && objCP.data.sedes == 0) {
        let mensaje =
          'No puede agregar ' +
          objCP.children[0].data.nombre +
          ', porque supera su linea de crédito y no existe proveedores con sedes disponibles en su compra.';
        this.alerta(2, mensaje);
        return false;
      }
    }

    return true;
  }

  get getTipoVal() { return this.forma.get('tipoValidacionIdentidad').value; }

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

  openReniecModal($event: any) {
    if(this.isValidReniec)
    {
      swal('Ya se valido correctamente!','','success');
      return;
    }

    var dialogRef = this.dialog.open(ValidacionReniecComponent, {
      disableClose: true,
      data: {
        clientId: this.financiamiento.clienteId,
        dni: this.cliente.nroDocumento,
        clientY: $event.clientY
      }
      // position: {
      //   top: ($event.clientY - 250)+'px'
      // }
    });

    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result.excedioIntentos){
          this.changeTipoVal(2);
          this.TipoValidacion = [{id: 2, text: 'Whatsapp'}];
          this.forma.get('tipoValidacionIdentidad').setValue(2);
          return;
        }
        this.isValidReniec = result.valid;
        
        this.forma.controls['validacionReniec'].setValue(this.isValidReniec);
        this.photob64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
        + result.data.photob64);

        this.firmab64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
        + result.data.firmab64);

        this.fechaEmision = result.data.fechaEmision;
        // let lista = this.financiamiento.detalle;
        // lista.forEach(aliado => {
        //   if (aliado.data.id == objCP.id) {
        //     aliado.data.despacho = result;
        //   }
        // });
        // this.financiamiento.detalle = this.formatearJson(lista);
      }
      // this.notify();
    });
  }
  changeSede(idSede:number){
    if(this.isRolVolante) {
    this._financiamientoEdicionService.showButtonCertificadoCrediCalidda(idSede).subscribe(isConCertificado => {
      this.showCertificado = isConCertificado;
    });
  }
  }
  changeTipoVal(value:any){
    
    if(value == 1){
      this.forma.get('validacionReniec').setValidators([Validators.requiredTrue]);
      this.forma.get('validacionReniec').updateValueAndValidity();
    }
    else
    {
      this.forma.controls['validacionReniec'].setValue(false);
      this.forma.get('validacionReniec').clearValidators();
      this.forma.get('validacionReniec').updateValueAndValidity();
      this.isValidReniec = false;
    }

    if(value == 2)
    {
      this.forma.get('idUsuarioValidador').setValidators([Validators.required]);
      this.forma.get('codigoValidador').setValidators([Validators.required]);
      this.forma.get('idUsuarioValidador').updateValueAndValidity();
      this.forma.get('codigoValidador').updateValueAndValidity();
    }
    else
    {
      this.forma.controls['idUsuarioValidador'].setValue(null);
      this.forma.controls['codigoValidador'].setValue(null);
      this.forma.get('idUsuarioValidador').clearValidators();
      this.forma.get('codigoValidador').clearValidators();
      this.forma.get('idUsuarioValidador').updateValueAndValidity();
      this.forma.get('codigoValidador').updateValueAndValidity();
    }

  }

  get f() { return this.forma.controls; }
 
  get isEnabledCertificado() { return this.forma.get('sedeId').value ? true : false; }

  async downloadCertificado()
  {
    var _idSede = this.forma.get('sedeId').value;
    
    if(!_idSede) return;
    var response = await this._financiamientoEdicionService.exportarCertificado(this.financiamiento.clienteId, this.forma.get('sedeId').value);
      
      
      this.forma.get('idCertificado').setValue(response.idCertificado);

  }

  ChangeConsentimiento(event: any) {    
    this.consentimiento = event.value;    
    this.consentimientoInvalid = false;
    
  }
}
