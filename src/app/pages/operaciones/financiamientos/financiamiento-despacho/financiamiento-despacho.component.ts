import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ClienteListadoService, FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { GlobalService } from 'src/app/services/global.service';
import { Option } from '../../../../@core/models/option.model';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Despacho, FinanciamientoForm } from '../../../../models/financiamiento.model';
import swal from 'sweetalert2';
import { Cliente } from 'src/app/models/cliente.model';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/backend.service.index';

@Component({
  selector: 'app-financiamiento-despacho',
  templateUrl: './financiamiento-despacho.component.html',
  styleUrls: []
})
export class FinanciamientoDespachoComponent implements OnInit {
  forma: FormGroup;

  verDelivery: boolean;
  verRetiroTienda: boolean;

  provincias: Option[];
  distritos: Option[];
  sedes: Option[];

  lenghtValidacion: number;
  visibilidad: string;
  tipoValidacion: string;

  longitudDocumento: number;
  tiposDocumento: Option[];


  tipoDocumento : string;
  nroDocumento :string;


  fechaMinRecojo: Date;
  fechaMaxRecojo: Date;
  despacho: Despacho;
  private _clienteEdicionServicio: any;
 

  constructor(
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public _global: GlobalService,
    public _clienteService: ClienteService,
    public _clienteListadoService: ClienteListadoService,
    public dialogRef: MatDialogRef<FinanciamientoDespachoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.setForm();
    this.tipoVentaChange(this.forma.get('tipoDespacho'), 1);

    this._clienteListadoService.callbackInitAsync().subscribe(response => {
      this.tiposDocumento = response.tiposDocumento;
    });

    this._clienteListadoService.callbackInitAsync().subscribe(response => {
      this.nroDocumento = response.nroDocumento;
    });

    if(this.despacho.selected){
      this.tipoDocumento= localStorage.getItem('tipoDocumento').toString()
      this.nroDocumento= localStorage.getItem('dnicuenta').toString()
      this._financiamientoEdicionService.buscarDireccion(this.data.cuentaContrato,this.tipoDocumento,this.nroDocumento).subscribe(response => {
          this.distritos=response
          this.provincias=response
          this.forma.get('calleDespacho').setValue(response.direccion);
          this.forma.get('distritoId').setValue(response.distrito);
          this.forma.get('departamentoId').setValue(response.departamento);
          this.forma.get('provinciaId').setValue(response.provincia);
          localStorage.setItem('distritoId',response.distritoId);
          localStorage.setItem('departamentoId',response.departamentoId);
          localStorage.setItem('provinciaId',response.provinciaId);
          this.despacho.distritoId = response.distritoId;
          this.despacho.departamentoId = response.departamentoId;
          this.despacho.distritoId = response.distritoId;
          
      });
    }
   
    
  }

  setForm() {
    this.despacho = this.data.despacho;
    this._financiamientoEdicionService.obtenerSedesAliado(this.data.aliado.id).subscribe(response => {
      this.sedes = response;
    });
    this.forma = new FormGroup({
      tipoDespacho: new FormControl(
        this.despacho.tipoDespacho != null ? this.despacho.tipoDespacho.toString() : null,
        Validators.required
      ),
      selected1: new FormControl(this.despacho.selected),
      nroBoleta: new FormControl(this.despacho.nroBoleta != null ? this.despacho.nroBoleta : null, Validators.required),
      departamentoId: new FormControl(
        this.despacho.departamentoId != null ? this.despacho.departamentoId : this.despacho.departamentoId,
        Validators.required
      ),

      provinciaId: new FormControl(
        
        this.despacho.provinciaId != null ? this.despacho.provinciaId : null,
        Validators.required
      ),
 
      distritoId: new FormControl(
        this.despacho.distritoId != null ? this.despacho.distritoId : null,
        Validators.required
      ),

      selected: new FormControl(this.despacho.selected),
      calleDespacho: new FormControl(
        this.despacho.calleDespacho != null ? this.despacho.calleDespacho : null,
        Validators.required
      ),
      referenciaDespacho: new FormControl(
        this.despacho.referenciaDespacho != null ? this.despacho.referenciaDespacho : null,
        Validators.required
      ),
      fechaRecojo: new FormControl(
        this.despacho.fechaRecojo != null ? this.despacho.fechaRecojo : null,
        Validators.required
      ),
      horarioRecojo: new FormControl(
        this.despacho.horarioRecojo != null ? this.despacho.horarioRecojo : null,
        Validators.required
      ),
      costoEnvioDespacho: new FormControl(
        this.despacho.costoEnvioDespacho != null ? this.despacho.costoEnvioDespacho : null,
        Validators.required
      ),
      quienRecibe: new FormControl(
        this.despacho.quienRecibe != null ? this.despacho.quienRecibe : null,
        Validators.required
      ),
      otraPersona: new FormGroup({
        dni: new FormControl(
          this.despacho.otraPersona != null ? this.despacho.otraPersona.dni : null,
          Validators.required
        ),
        nombre: new FormControl(
          this.despacho.otraPersona != null ? this.despacho.otraPersona.nombre : null,
          Validators.required
        ),
        parentesco: new FormControl(
          this.despacho.otraPersona != null ? this.despacho.otraPersona.parentesco : null,
          Validators.required
        )
      }),
      otraSedeTiendaId: new FormControl(this.despacho.otraSedeTiendaId, Validators.required)
    });
  }

  setValidators() {
    const tipoDespacho = this.forma.get('tipoDespacho');
    const departamentoId = this.forma.get('departamentoId');
    const provinciaId = this.forma.get('provinciaId');
    const distritoId = this.forma.get('distritoId');
    const calleDespacho = this.forma.get('calleDespacho');
    const referenciaDespacho = this.forma.get('referenciaDespacho');
    const fechaRecojo = this.forma.get('fechaRecojo');
    const horarioRecojo = this.forma.get('horarioRecojo');
    const costoEnvioDespacho = this.forma.get('costoEnvioDespacho');
    const otraSedeTiendaId = this.forma.get('otraSedeTiendaId');
    const nroBoleta = this.forma.get('nroBoleta');
    const quienRecibe = this.forma.get('quienRecibe');

    if (tipoDespacho.value == 1) {
      nroBoleta.setValidators([Validators.required]);
      otraSedeTiendaId.clearValidators();
      departamentoId.clearValidators();
      provinciaId.clearValidators();
      distritoId.clearValidators();
      calleDespacho.clearValidators();
      referenciaDespacho.clearValidators();
      fechaRecojo.clearValidators();
      horarioRecojo.clearValidators();
      costoEnvioDespacho.clearValidators();
      quienRecibe.clearValidators();
    }
    if (tipoDespacho.value == 2) {
      nroBoleta.clearValidators();
      otraSedeTiendaId.setValidators([Validators.required]);
      departamentoId.clearValidators();
      provinciaId.clearValidators();
      distritoId.clearValidators();
      calleDespacho.clearValidators();
      referenciaDespacho.clearValidators();
      fechaRecojo.setValidators([Validators.required]);
      horarioRecojo.setValidators([Validators.required]);
      costoEnvioDespacho.clearValidators();
      quienRecibe.setValidators([Validators.required]);
    }
    if (tipoDespacho.value == 3) {
      nroBoleta.clearValidators();
      otraSedeTiendaId.clearValidators();
      departamentoId.setValidators([Validators.required]);
      provinciaId.setValidators([Validators.required]);
      distritoId.setValidators([Validators.required]);
      calleDespacho.setValidators([Validators.required]);
      referenciaDespacho.setValidators([Validators.required]);
      fechaRecojo.setValidators([Validators.required]);
      horarioRecojo.setValidators([Validators.required]);
      costoEnvioDespacho.setValidators([Validators.required, Validators.pattern('^[0-9]+([,][0-9]+)?$')]);
      quienRecibe.setValidators([Validators.required]);
    }

    nroBoleta.updateValueAndValidity();
    otraSedeTiendaId.updateValueAndValidity();
    departamentoId.updateValueAndValidity();
    provinciaId.updateValueAndValidity();
    distritoId.updateValueAndValidity();
    calleDespacho.updateValueAndValidity();
    referenciaDespacho.updateValueAndValidity();
    fechaRecojo.updateValueAndValidity();
    horarioRecojo.updateValueAndValidity();
    costoEnvioDespacho.updateValueAndValidity();
    quienRecibe.updateValueAndValidity();

    this.ChangeOtraPersona(quienRecibe);
  }

  btnCerrar(): void {
    this.dialogRef.close();
  }

  enviar() {
    
    if (this.forma.invalid) {
      return;
    }

    if (this.validarDespacho()) {
      const despachoEnviar = this.forma.getRawValue() as Despacho;
      despachoEnviar.selected = this.despacho.selected;
      this.dialogRef.close(despachoEnviar);
    }
  }

  validarDespacho() {
    if (this.data.aliado.sedes == 0 && this.forma.get('tipoDespacho').value == 1) {
      this.alerta(2, 'Este proveedor no cuenta con sedes para realizar entrega inmediata.');
      return false;
    }
    return true;
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

  buscarUbigeo(valor: number, nivel: number) {
    this._financiamientoEdicionService.buscarUbigeo(nivel, valor).subscribe(response => {
      if (nivel === 2) {
        this.distritos = [];
        this.provincias = response;
      } else if (nivel === 3) {
        this.distritos = response;
      }
    });
  }

  searchUbigeo(event: any, nivel: number) {
    this.buscarUbigeo(event.value, nivel);
  }

  

  
  showDireccion(event: any) {
    
    if (event.checked) {
      this.tipoDocumento= localStorage.getItem('tipoDocumento').toString()
      this.nroDocumento= localStorage.getItem('dnicuenta').toString()
      this._financiamientoEdicionService.buscarDireccion(this.data.cuentaContrato,this.tipoDocumento,this.nroDocumento).subscribe(response => {
        this.distritos=response
        this.provincias=response
        this.forma.get('calleDespacho').setValue(response.direccion);
        this.forma.get('distritoId').setValue(response.distrito);
        this.forma.get('departamentoId').setValue(response.departamento);
        this.forma.get('provinciaId').setValue(response.provincia);
        localStorage.setItem('distritoId',response.distritoId);
        localStorage.setItem('departamentoId',response.departamentoId);
        localStorage.setItem('provinciaId',response.provinciaId);
        this.despacho.distritoId = response.distritoId;
        this.despacho.departamentoId = response.departamentoId;
        this.despacho.distritoId = response.distritoId;
        
      });
      this.despacho.selected = true;
    } else {
      this.forma.get('calleDespacho').setValue('');
      this.forma.get('distritoId').setValue('');
      this.forma.get('departamentoId').setValue('');
      this.forma.get('provinciaId').setValue('');
      this.despacho.selected = false;
    }
  }

  ChangeOtraPersona(event: any) {
    const dni = this.forma.get('otraPersona').get('dni');
    const nombre = this.forma.get('otraPersona').get('nombre');
    const parentesco = this.forma.get('otraPersona').get('parentesco');

    if (event.value === '2') {
      dni.setValidators([Validators.required, Validators.pattern('^[0-9]+([,][0-9]+)?$')]);
      nombre.setValidators([Validators.required, Validators.pattern('^[A-Za-zÑñ]+([ A-Za-zÑñ]+)?$')]);
      parentesco.setValidators([Validators.required, Validators.pattern('^[A-Za-zÑñ]+([ A-Za-zÑñ]+)?$')]);
    } else {
      dni.clearValidators();
      dni.updateValueAndValidity();
      nombre.clearValidators();
      nombre.updateValueAndValidity();
      parentesco.clearValidators();
      parentesco.updateValueAndValidity();
    }
  }

  tipoVentaChange(event: any, tipo: number) {
    let tipoDespacho = event.value;
    if (tipo == 2) {
      this.forma.get('departamentoId').setValue(null);
      this.forma.get('provinciaId').setValue(null);
      this.forma.get('distritoId').setValue(null);
      this.forma.get('calleDespacho').setValue(null);
      this.forma.get('referenciaDespacho').setValue(null);
      this.forma.get('fechaRecojo').setValue(null);
      this.forma.get('horarioRecojo').setValue(null);
      this.forma.get('costoEnvioDespacho').setValue(null);
      this.forma.get('otraSedeTiendaId').setValue(null);
      this.forma.get('quienRecibe').setValue(null);
      this.forma
        .get('otraPersona')
        .get('dni')
        .setValue(null);
      this.forma
        .get('otraPersona')
        .get('nombre')
        .setValue(null);
      this.forma
        .get('otraPersona')
        .get('parentesco')
        .setValue(null);
      this.despacho.selected = false;
    }
    if (tipoDespacho == 1) {
      this.verDelivery = false;
      this.verRetiroTienda = false;
    } else if (tipoDespacho == 2) {
      this.verDelivery = false;
      this.verRetiroTienda = true;
      this.fechaMinRecojo = new Date(this.data.fechaVenta);
      this.fechaMaxRecojo = new Date(this.data.fechaVenta);
      this.fechaMinRecojo.setDate(this.fechaMinRecojo.getDate());
      this.fechaMaxRecojo.setDate(this.fechaMaxRecojo.getDate() + 15);
      localStorage.setItem('fechaMinRecojo', this.fechaMinRecojo.toString());
      localStorage.setItem('fechaMaxRecojo', this.fechaMaxRecojo.toString());
    } else if (tipoDespacho == 3) {
      this.verDelivery = true;
      this.verRetiroTienda = false;
      this.fechaMinRecojo = new Date(this.data.fechaVenta);
      this.fechaMaxRecojo = new Date(this.data.fechaVenta);
      this.fechaMinRecojo.setDate(this.fechaMinRecojo.getDate() + 3);
      this.fechaMaxRecojo.setDate(this.fechaMaxRecojo.getDate() + 18);
      localStorage.setItem('fechaMinRecojo', this.fechaMinRecojo.toString());
      localStorage.setItem('fechaMaxRecojo', this.fechaMaxRecojo.toString());
    }
    this.setValidators();
  }
}
