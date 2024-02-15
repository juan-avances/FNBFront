import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { FinanciamientoListadoService, FinanciamientoEdicionService } from '../../../services/feature.service.index';
import { FinanciamientoListInit } from '../../../models/financiamiento.model';
import { GlobalService } from '../../../services/global.service';
import { formatDate } from '@angular/common';
import { Option } from '../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { LazyLoadEvent } from 'primeng/primeng';
import { AliadoComercialService, FinanciamientoService } from 'src/app/services/backend.service.index';
import { ActivatedRoute, Router } from '@angular/router';
import { OfflineService } from 'src/app/services/backend/offline.service';
import { DataService } from 'src/app/services/servicesData';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import Swal from 'sweetalert2';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { MatDialog } from '@angular/material';
import { RolService } from 'src/app/services/backend/rol.service';
import { Rol } from 'src/app/models/rol.model';
import { HELPER } from 'src/app/constants/helper';

@Component({
  selector: 'app-financiamientos',
  templateUrl: './financiamientos.component.html',
  styles: []
})
export class FinanciamientosComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTablev2: Table;

  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  visibleColumns: Column[];
  financiamientoInit: FinanciamientoListInit;
  tipoDocumento: string;
  tipoValidacion: string;
  lenghtValidacion: number;
  fechaFinanciamientoVenta: Date;
  fechaFinanciamientoVentaFin: Date;
  fechaFinanciamientoEntrega: Date;
  ViewUserResto: string;
  ViewUserVendedor: string;
  idAliadoComercial: string = null;
  idSede: string = null;
  showExportar = this._global.validarPermiso('EXPFIN');  
  rol: string;
  NombreCompleto: string;
  filteredOptions: Observable<Option[]>;
  formGroup: FormGroup;
  getItemForm: any;
  EsProveedor: boolean;
  hasSede: boolean;
  roles: Rol[];
  isload: boolean = false;
  ultimoload: LazyLoadEvent;
  isOrderByButton = true;
  constructor(
    public dialog: MatDialog,
    public _financiamientoListadoService: FinanciamientoListadoService,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public _financiamientoService: FinanciamientoService,
    public _aliadoComercialService: AliadoComercialService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute,
    public _offlineService: OfflineService,
    public _dataServices : DataService,
    public _rolService: RolService,
    public _headerComponente: HeaderComponent,
    private _router: Router
  ) {
    if (localStorage.getItem('EsProveedor')) {
      localStorage.removeItem('EsProveedor');
    }
    this.dataEntity = this.init(this.dataTable);
  }

  ngAfterViewInit() {
        
    this.isload = true;
    this._financiamientoListadoService.refreshAfterUploadFile = this;

    this._offlineService.getConfiguraciones().subscribe(obj => {
      this._headerComponente.estado = obj.data.estadoSap;
      this._headerComponente.getCssColor(this._headerComponente.estado);
      
      this._dataServices.setMessage(this._headerComponente.color);
    })           
  }

  ngOnInit() {            
    
    this.formGroup = this._financiamientoEdicionService.newForm();
    this.setearDatos();
   
    this._financiamientoListadoService.initAsync(this.dataTablev2).subscribe(response => {
      this.financiamientoInit = response;
      this.EsProveedor = response.proveedores.find((x) => x.value == localStorage.getItem('IdAliado'));
      if (this.EsProveedor) {
        localStorage.setItem('EsProveedor', '1');
      }
      this.rol = localStorage.getItem('RolUsuario');

      if (this.rol == 'Vendedor Retail' || this.rol == 'Vendedor Call Center' || this.rol == 'Vendedor CSC'|| this.rol == 'Vendedor Retail 2') {
        this.ViewUserResto = 'd-none';
        this.ViewUserVendedor = 'd-block';
        this.NombreCompleto = localStorage.getItem('NombreyApellidos');
        this.formGroup.get('vendedor').setValue(this.NombreCompleto);
        this.dataTable.filter(this.NombreCompleto, 'vendedor', 'Equals');
      } else {
        this.ViewUserResto = 'd-block';
        this.ViewUserVendedor = 'd-none';
        this.filteredOptions = this.formGroup.get('vendedor').valueChanges.pipe(
          debounceTime(300),
          switchMap((value) => this._financiamientoEdicionService.obtenerListaVendedores(value))
        );
      }            
      var idRol: number = +localStorage.getItem('IdRolUsuario');
      this._rolService.initList(null).subscribe((response) => {
        this.roles = response.data;
     
      if (this.roles.find(x=> x.id == idRol).esAliado){
        this.idAliadoComercial = localStorage.getItem('IdAliado').toString();
  
        if (this.EsProveedor) {
          this.formGroup.get('proveedorId').setValue(this.idAliadoComercial);
          this.dataTable.filter(this.idAliadoComercial, 'proveedorId', 'equals');
        } else {
          this.formGroup.get('aliadoId').setValue(this.idAliadoComercial);
          this.dataTable.filter(this.idAliadoComercial, 'aliadoComercialId', 'equals');
        }
  
        if (localStorage.getItem('IdSede').toString() !== 'null') {
          this.idSede = localStorage.getItem('IdSede').toString();
          this.hasSede = true;
          this.formGroup.get('sedeId').setValue(this.idSede);
          this.formGroup.get('aliadoId').setValue(this.idAliadoComercial);
  
          this.dataTable.filter(this.idAliadoComercial, 'aliadoComercialId', 'equals');
          this.dataTable.filter(this.idSede, 'sedeId', 'equals');
        }
      }
      
      if (!this.roles.find(x=> x.id == idRol).esAliado) {
        let respVentaId = this.formGroup.get('aliadoId').value;
        if (respVentaId) {
  
          this._financiamientoListadoService.callbackInitAsync().subscribe((response) => {
            this.financiamientoInit = response;
            this._financiamientoListadoService.obtenerSedesAliado(respVentaId).subscribe((sedes) => {
              this.financiamientoInit.sedes = sedes;
            });
          });
        }
      }
    });
    this.dataTable.filter('','cuentaContrato','equals');
    });
       
  }

  setearDatos() {
    const paramGetObj = this._router.routerState.snapshot.root.queryParams["obj"];

    if (paramGetObj) {
      this.getItemForm = JSON.parse(HELPER.b64DecodeUnicode(paramGetObj));
    }

    if (this.getItemForm) {
      for (let key in this.getItemForm) {
        this.formGroup.get(key).setValue(this.getItemForm[key]);
      }
    }
  }

  reloadParams = () => {
    
    this._financiamientoListadoService.paramFilterSerialize = JSON.stringify(this.formGroup.value);
    const HELP_PARAM = HELPER.b64EncodeUnicode(
      this._financiamientoListadoService.paramFilterSerialize
    );
    history.replaceState(history.state, "", "financiamientos?obj=" + HELP_PARAM);
  }

  private ngParamsFitlers() {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    var json = {
      estado: { value: this.formGroup.get('estado').value, matchMode: 'equals' },
      fechaVenta: {
        value: this.formGroup.get('fechaVenta').value
          ? formatDate(this.formGroup.get('fechaVenta').value, format, locale)
          : '',
        matchMode: 'equals',
      },
      nroContrato: { value: this.formGroup.get('nroContrato').value, matchMode: 'contains' },
      aliadoComercialId: { value: this.formGroup.get('aliadoId').value, matchMode: 'equals' },
      proveedorId: { value: this.formGroup.get('proveedorId').value, matchMode: 'equals' },
      tipoDocumento: { value: this.formGroup.get('tipoDocumento').value, matchMode: 'equals' },
      nroDocumento: { value: this.formGroup.get('nroDocumento').value, matchMode: 'contains' },
      idCategoria: { value: this.formGroup.get('idCategoria').value, matchMode: 'equals' },
      canalVentaId: { value: this.formGroup.get('canalId').value, matchMode: 'equals' },
      cuentaContrato: { value: this.formGroup.get('cuentaContrato').value, matchMode: 'contains' },
      fechaEntrega: {
        value: this.formGroup.get('fechaEntrega').value
          ? formatDate(this.formGroup.get('fechaEntrega').value, format, locale)
          : '',
        matchMode: 'equals',
      },
      nroPedido: { value: this.formGroup.get('nroPedido').value, matchMode: 'contains' },
      sedeId: { value: this.formGroup.get('sedeId').value, matchMode: 'equals' },
      vendedor: { value: this.formGroup.get('vendedor').value.label, matchMode: 'Equals' },
    };
    
    return json;
  }

  init(table: PagingGridComponent): PrimeTable {
    
    this.dataTable = table;
    return (this.dataEntity = this._financiamientoListadoService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {        
    this.ultimoload = event;
    if(!this.isload) return;
    
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    
    if (this.getItemForm) {

      const filters = this.ngParamsFitlers();

      if (this.formGroup.get('estado').value === undefined || this.formGroup.get('estado').value.trim() === '') {
        delete filters['estado'];
      }
      if (this.formGroup.get('fechaVenta').value === null || this.formGroup.get('fechaVenta').value.length === 0) {
        delete filters['fechaVenta'];
      }
      if (this.formGroup.get('nroContrato').value === null || this.formGroup.get('nroContrato').value.trim() === '') {
        delete filters['nroContrato'];
      }
      if (this.formGroup.get('aliadoId').value === undefined || this.formGroup.get('aliadoId').value.trim() === '') {
        delete filters['aliadoComercialId'];
      }
      if (
        this.formGroup.get('proveedorId').value === undefined ||
        this.formGroup.get('proveedorId').value.trim() === ''
      ) {
        delete filters['proveedorId'];
      }
      if (
        this.formGroup.get('tipoDocumento').value === undefined ||
        this.formGroup.get('tipoDocumento').value.trim() === ''
      ) {
        delete filters['tipoDocumento'];
      }
      if (this.formGroup.get('nroDocumento').value === null || this.formGroup.get('nroDocumento').value.trim() === '') {
        delete filters['nroDocumento'];
      }
      if (
        this.formGroup.get('idCategoria').value === undefined ||
        this.formGroup.get('idCategoria').value.length === 0
      ) {
        delete filters['idCategoria'];
      }
      if (this.formGroup.get('canalId').value === undefined || this.formGroup.get('canalId').value.trim() === '') {
        delete filters['canalVentaId'];
      }
      if (this.formGroup.get('fechaEntrega').value === null || this.formGroup.get('fechaEntrega').value.length === 0) {
        delete filters['fechaEntrega'];
      }
      if (this.formGroup.get('nroPedido').value === null || this.formGroup.get('nroPedido').value.length === 0) {
        delete filters['nroPedido'];
      }
      if (this.formGroup.get('sedeId').value === undefined || this.formGroup.get('sedeId').value.length === 0) {
        delete filters['sedeId'];
      }
      if (this.formGroup.get('vendedor').value === null || this.formGroup.get('vendedor').value.length === 0) {
        delete filters['vendedor'];
      }
      if (filters) {
        primerNgFilter.filters = filters;
      }
    }

    
    this._financiamientoListadoService.paramFilterSerialize = JSON.stringify(this.formGroup.value);
    this._financiamientoListadoService.paramLoadLazy = event;

    
    this._financiamientoService.loadLazyFilter(primerNgFilter, '')
    .subscribe((response) => {
      if (response.valid) {
        const ids = response.data.entities.map(item => item.id);
        
        let data = response.data.entities;
        this._financiamientoService.appplyColorDocs(ids).subscribe( res => {   
          

          let status = res.data.statusList
          data.forEach(dataItem => {
            const relatedStatus = status.find(s => s.financiamientoId === dataItem.id);
            
            if (relatedStatus) {
              let documentosAConsiderar: string[] = [];
              
              if (dataItem.estado === 4) {
                documentosAConsiderar = relatedStatus.cantidadArchivoSutentoAnulacion.split(', ');
              } else {
                documentosAConsiderar = [
                  ...relatedStatus.cantidadArchivoSutentoVenta.split(', '),
                  ...relatedStatus.cantidadArchivoSutentoEntrega.split(', ')
                ];
              }
              
              const documentosFiltrados = documentosAConsiderar.filter(doc => !doc.includes("Otros"));
              let contadorSI = 0;
              let contadorNO = 0;
              
              documentosFiltrados.forEach(doc => {
                if (doc.includes("SI")) {
                  contadorSI++;
                } else if (doc.includes("NO")) {
                  contadorNO++;
                }
              });
              
              if (contadorSI === documentosFiltrados.length) {
                dataItem.estadoArchivo = 2;  // Verde
              } else if (contadorSI > 0) {
                dataItem.estadoArchivo = 1;  // Amarillo
              } else {
                dataItem.estadoArchivo = 0;  // Rojo
              }
            }
            
          });
          this.dataEntity.data = data;
          
        })               
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
    
  }

  
  fnCastFecha(fecha) {
    if (fecha != "") {
      var fechaReturn = new Date(fecha);
      var day = fechaReturn.getDate();
      var mes = fechaReturn.getMonth();
      var anio = fechaReturn.getFullYear();
      var mesF;
      var dayF;

      mes = mes + 1;
      if (mes < 10) {
        mesF = this.zeroFill(mes, 2);
      } else {
        mesF = mes;
      }
      if (day < 10) {
        dayF = this.zeroFill(day, 2);
      } else {
        dayF = day;
      }
      return anio + "" + mesF + "" + dayF;
    } else {
      return fecha
    }

  }
  zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + "";
  }

  abrirCargaMasiva() {
    const dialogRef = this.dialog.open(CargaMasivaComponent, {
      width: '800px',
    });


  }

  exportar() {
    let obj = this.formGroup.getRawValue();
    obj.FechaVentaIni = this.fnCastFecha(obj.FechaVentaIni);
    obj.FechaVentaFin = this.fnCastFecha(obj.FechaVentaFin);
    obj.FechaEntregaIni = this.fnCastFecha(obj.FechaEntregaIni);
    obj.FechaEntregaFin = this.fnCastFecha(obj.FechaEntregaFin);
    
    
    obj.vendedor = this.NombreCompleto ? localStorage.getItem('id') : this.formGroup.get('vendedor').value ? this.formGroup.get('vendedor').value.value : '';
    
    const fechaActual = new Date();
    const fechaVentaIni = new Date(obj.FechaVentaIni);
    const diferenciaMeses = (fechaActual.getFullYear() - fechaVentaIni.getFullYear()) * 12 + fechaActual.getMonth() - fechaVentaIni.getMonth();

    this.ejecutarExportacion(obj);

    /*if (!obj.FechaVentaIni || diferenciaMeses > 6) {
        Swal({
            title: 'Advertencia',
            text: 'Es recomendable elegir una fecha menor a 6 meses. ¿Deseas continuar?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {                
                this.ejecutarExportacion(obj);
            }
        });
    } else {
        this.ejecutarExportacion(obj);
    }*/
    
  }
  exportarValidacion(){
    let obj = this.formGroup.getRawValue();
    obj.FechaVentaIni = this.fnCastFecha(obj.FechaVentaIni);
    obj.FechaVentaFin = this.fnCastFecha(obj.FechaVentaFin);
    obj.FechaEntregaIni = this.fnCastFecha(obj.FechaEntregaIni);
    obj.FechaEntregaFin = this.fnCastFecha(obj.FechaEntregaFin);
    
    
    obj.vendedor = this.NombreCompleto ? localStorage.getItem('id') : this.formGroup.get('vendedor').value ? this.formGroup.get('vendedor').value.value : '';
    
    const fechaActual = new Date();
    const fechaVentaIni = new Date(obj.FechaVentaIni);
    const diferenciaMeses = (fechaActual.getFullYear() - fechaVentaIni.getFullYear()) * 12 + fechaActual.getMonth() - fechaVentaIni.getMonth();

    this.ejecutarExportacionValidacion(obj);
  }
  ejecutarExportacionValidacion(obj: any) {
    this._financiamientoListadoService.exportarValidacion(obj);
  }
  ejecutarExportacion(obj: any) {
    this._financiamientoListadoService.exportarFinanciamiento(obj);
  }

  async filtrarPorAliado(id: any) {
    
    if(!this.idAliadoComercial){
      if (this.financiamientoInit) {
        const response = await this._financiamientoListadoService.obtenerSedesAliado(id).toPromise();
        this.financiamientoInit.sedes = response;
        this.dataTable.filter(id, 'aliadoComercialId', 'equals', this.reloadParams);
      }
    }
  }

  changeTipoDoc(_event: any) {
    this.tipoDocumento = _event.value;
    switch (this.tipoDocumento) {
      case 'PE2':
        this.tipoValidacion = '^[0-9]+$';
        this.lenghtValidacion = 8;
        break;
      case 'PE3':
      case 'PE5':
        this.tipoValidacion = '^$|^[A-Za-z0-9]+';
        this.lenghtValidacion = 12;
        break;
    }
  }
  
  displayFn(vendedor: any) {
    if (vendedor) {
      return vendedor.label;
    }
  }

  validarNumero(event) {
    return (event.charCode >= 48 && event.charCode <= 57);
  }

  /* filtros */

  //Estado Financiamiento
  filterEstadoFin(val: string)
  {
    
    this.dataTable.filter(val, 'estado', 'equals', this.reloadParams);
  }

  filterFechaVenta(event) {
    
    if (event.value != null) {

      if (this.formGroup.value.FechaVentaFin < this.formGroup.value.FechaVentaIni && this.formGroup.value.FechaVentaFin != "") {
        Swal(" ", "La Fecha de Venta Inicio debe ser menor o igual a la Fecha de Venta Fin", "warning");
        Swal.hideLoading();
        return;
      }
      this.fechaFinanciamientoVenta = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoVenta, format, locale);
      this.dataTable.filter(formattedDate, 'FechaVentaIni', 'GreatherThanOrEqual', this.reloadParams);
    }

    else {
      this.dataTable.filter(null, 'FechaVentaFin', 'LessThanOrEqual', this.reloadParams);
    }
  }

  filterFechaEntrega(event) {
    
    if (this.formGroup.value.FechaEntregaFin < this.formGroup.value.FechaEntregaIni && this.formGroup.value.FechaEntregaFin != "") {
      Swal(" ", "La Fecha de Entrega Inicio debe ser menor o igual a la Fecha de Entrega Fin", "warning");
      Swal.hideLoading();
      return;
    }

    if (event.value != null) {
      this.fechaFinanciamientoVentaFin = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoVentaFin, format, locale);
      this.dataTable.filter(formattedDate, 'FechaEntregaIni', 'GreatherThanOrEqual', this.reloadParams);
    } else {
      this.dataTable.filter(null, 'FechaEntregaIni', 'GreatherThanOrEqual', this.reloadParams);
    }

  }

  filterCuentaContrato(val: string)
  {
    
    this.dataTable.filter(val, 'cuentaContrato', 'contains',this.reloadParams);
  }

  filterContratoFinanciamiento(val: string)
  {
    
    this.dataTable.filter(val, 'nroContrato', 'contains', this.reloadParams);
  }

  change(event: any) {
    
    if(!this.idAliadoComercial || !this.idSede){
      if (event.value != null) {
        this.filtrarPorAliado(event.value);
      } else {
        this.financiamientoInit.sedes = null;
        this.dataTable.filter(null, 'sedeId', 'equals', this.reloadParams);
        this.dataTable.filter(null, 'aliadoComercialId', 'equals', this.reloadParams);
      }
    }
  }

  changeProveedor(event: any) {
    
    if(!this.isload) return;
    if (event.value != null) {
      this.dataTable.filter(event.value, 'proveedorId', 'equals', this.reloadParams);
    } else {
      this.dataTable.filter(null, 'proveedorId', 'equals', this.reloadParams);
    }
  }

  filterTipoDocumento(val: string){
    
    this.dataTable.filter(val, 'tipoDocumento', 'equals', this.reloadParams);
  }

  filterNroDocumento(val: string){
    
    this.dataTable.filter(val, 'nroDocumento', 'contains', this.reloadParams);
  }


  changeCategoria(event: any) {
    
    if(!this.isload) return;
    if (event.value != null) {
      this.dataTable.filter(event.value, 'idCategoria', 'equals', this.reloadParams);
    } else {
      this.dataTable.filter(null, 'idCategoria', 'equals', this.reloadParams);
    }
  }

  filterCanalVenta(val: string){
    
    //this.dataTable.filter(val, 'canalVentaId', 'equals', this.reloadParams);
  }

  filterFechaVentaFin(event) {
    
    if (event.value != null) {

      if (this.formGroup.value.FechaVentaFin < this.formGroup.value.FechaVentaIni) {
        Swal(" ", "La Fecha de Venta Fin debe ser mayor o igual a la Fecha de Venta Inicio", "warning");
        Swal.hideLoading();
        return;
      }
      this.fechaFinanciamientoVentaFin = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoVentaFin, format, locale);
      this.dataTable.filter(formattedDate, 'FechaVentaFin', 'LessThanOrEqual', this.reloadParams);
    } else {
      this.dataTable.filter(null, 'FechaVentaFin', 'LessThanOrEqual', this.reloadParams);
    }
  }

  filterFechaEntregaFin(event) {
    
    if (this.formGroup.value.FechaEntregaFin < this.formGroup.value.FechaEntregaIni) {
      Swal(" ", "La Fecha de Entrega Fin debe ser mayor o igual a la Fecha de Entrega Inicio", "warning");
      Swal.hideLoading();
      return;
    }

    if (event.value != null) {
      this.fechaFinanciamientoVentaFin = event.value;
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
      const formattedDate = formatDate(this.fechaFinanciamientoVentaFin, format, locale);
      this.dataTable.filter(formattedDate, 'FechaEntregaFin', 'LessThanOrEqual', this.reloadParams);
    } else {
      this.dataTable.filter(null, 'FechaEntregaFin', 'LessThanOrEqual', this.reloadParams);
    }
  }

  filterNroPedido(val: string){
    
    this.dataTable.filter(val, 'nroPedido', 'contains', this.reloadParams);
  }

  filterSede(sede: string)
  {
    if(!this.idSede)
    {
      
      this.dataTable.filter(sede, 'sedeId', 'equals', this.reloadParams)
    }
  }

  filterVendedor(vendedor: string, idVendedor: string) {
    if(!this.NombreCompleto){
      this.dataTable.filter(vendedor, 'vendedor', 'Equals', this.reloadParams);
    }
  }

  orderByInformation() {
    this.isOrderByButton = false;
    if (!this.isload) return;
    this._aliadoComercialService.orderByProviders(true)
      .subscribe(res => {
        this.financiamientoInit.proveedores = res.data.proveedores
      })      
  }

  orderByInformationReciente() {
    this.isOrderByButton = true;
    if (!this.isload) return;
    this._aliadoComercialService.orderByProviders(false)
      .subscribe(res => {
        this.financiamientoInit.proveedores = res.data.proveedores
      })
  }

}
