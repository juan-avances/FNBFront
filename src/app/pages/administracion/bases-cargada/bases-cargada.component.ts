import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Option, State } from 'src/app/@core/models/option.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { AliadoComercialService, UsuarioService } from 'src/app/services/backend.service.index';
import { UsuarioListadoService, UsuarioEdicionService, ArchivoCargaService } from 'src/app/services/feature.service.index';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { BasesListadoService } from 'src/app/services/feature/Administracion/BasesCargadas/bases-listado.service';
import { FileUpload64 } from '../../../models/fileUpload64.model';
import { UploadFile } from 'ngx-file-drop';
import { formatDate } from '@angular/common';
import { ProductoService } from 'src/app/services/backend/producto.service';
import swal from 'sweetalert2';
import { BasesService } from 'src/app/services/backend/bases.service';
import { BaseEdicionService } from 'src/app/services/feature/Administracion/BasesCargadas/base-edicion-service';

export interface Carga {

  value: string;
  valueName: string;
}




@Component({
  selector: 'app-bases-cargada',
  templateUrl: './bases-cargada.component.html',
  styleUrls: ['./bases-cargada.component.scss']
})
export class BasesCargadaComponent implements OnInit, AfterViewInit {

  
  public files: UploadFile[] = [];
  archivoActual: string;
  archivo: string;
  estadoCarga: string;
  forma: FormGroup;
  base64: FileUpload64;
  valorMonto: number;
  showFecha: boolean;
  showAliado: boolean;
  optionTurno: Option[];
  optionOpcion: Option[];
  optionAliados: Option[];
  cargas: Carga[] = [];
  setFecha = formatDate(new Date(), 'yyyy, MM, dd', 'en');
  minDate = new Date(this.setFecha);
  countRdn: number;
  idAliado: String;
  idFechaVencimiento: String;

  fechaVencimientoFilter: String;
  fechaCarga: String;

  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  rolId: number;
  aliadoComercialId: number;
  sedeId: number;

   baseGroup = new FormGroup({
    idAliado: new FormControl(""),
    idFechaVencimiento: new FormControl(""),
    idFechaCarga: new FormControl(""),
    idCanalVenta: new FormControl(''),
    
  });

  getItemForm: any;
  optionCanalVenta: Option[];
  aliados: Option[];
  id: Option[];
  roles: Option[];
  bases: Option[];
  fechav: Option[];
  fechac: Option[];
  fcar: '11/04/2022';
  fven: '16/04/2022';
  sku: Option[];
  sedes: Option[];
  estado: number = 1;
  constructor(
    public _archivoCargaService: ArchivoCargaService,
    public _activatedRoute: ActivatedRoute,
    public _usuarioListadoService: UsuarioListadoService,
    public _usuarioEdicionService: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute,


    public _usuarioService: UsuarioService,
    public _productoService: ProductoService,
    public _aliadoComercialService: AliadoComercialService,
    public _usuarioEdicionServicio: UsuarioEdicionService,



    public _basesListadoService: BasesListadoService,
    public _basesService: BasesService,
    public _basesEdicionService: BaseEdicionService

  ) { this.countRdn = 1;}

  ngAfterViewInit() {


    this.valorMonto = 2000;
    this.showFecha = true;
    this.showAliado = true;
    if (!this._global.isAdministradorWeb() && !this._global.isGOperacionWeb()) {
      this.idAliado = localStorage.getItem('IdAliado').toString();
    }

    this.forma = new FormGroup({
      tipoCarga: new FormControl('', Validators.required),
      credito: new FormControl('', [Validators.required, Validators.min(1)]),
      archivo: new FormControl('', Validators.required),
      fechaVencimiento: new FormControl(''),
      idHorario: new FormControl(''),
      idCanalVenta: new FormControl(''),
      idAliado: new FormControl(this.idAliado)
    });

    this.loadData();
    this.setTipoCargaArchivoValidators();
 

    
    this._basesListadoService.callbackInitAsync().subscribe(response => {
      this.id = response.id;
      this.bases = response.bases;
      this.fechav = response.fechav;
      this.sku = response.sku;



      if (response.bases) {
        this.bases = response.bases.toString();
 
        this.dataTable.filter(response.bases, 'bases', 'equals')

      }

      if (response.idFechaVencimiento) {
        this.idFechaVencimiento = response.idFechaVencimiento.toString();

        this.dataTable.filter(response.idFechaVencimiento, 'idFechaVencimiento', 'equals');
      }

      if (response.sku) {
        this.sku = response.sku.toString();

        this.dataTable.filter(response.sku, 'sku', 'equals');
      }
     

      this.dataTable.filter(this.estado.toString(), 'estado', 'equals');
    });
    this.dataEntity = this.init(this.dataTable);
   
  }

  setearDatos() {
    if (!this._rutaActiva.snapshot.paramMap.get('id')) {
      localStorage.removeItem('getItemForm');
    }
    this.getItemForm = JSON.parse(localStorage.getItem('getItemForm'));
    if (this.getItemForm) {
      for (let key in this.getItemForm) {

      }
    }
  }


ngOnInit() {
    this.dataEntity = this.init(this.dataTable);
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._basesListadoService.getConfigTable());
  }

  loadLazy(event: LazyLoadEvent) {
    var obj = {
      "aliadoComercialId": 0,
      "canalVentaId": 0,
      "fechaVencimientoFilter": "",
      "fechaCarga": ""
    }

    this._basesService.loadLazyFilter(obj).subscribe(response => {
        this.dataEntity.data = response;
        this.dataEntity.totalRegistros = this.dataEntity.data.length;
    });
  }

  callServices(params: any){
    this._basesService.loadLazyFilter(params).subscribe(response => {
      this.dataEntity.data = response;
      this.dataEntity.totalRegistros = this.dataEntity.data.length;
  });
  }

zeroFill(number,width){
  width -= number.toString().length;
  if(width>0){
    return new Array(width + (/\./.test(number)? 2:1)).join('0')+number;
  }
    return number + "";
}

 fnCastFecha(fecha){
   if(fecha!=""){
    var fechaReturn = new Date(fecha);
    var day = fechaReturn.getDate();
    var mes = fechaReturn.getMonth();
    var anio = fechaReturn.getFullYear();
    var mesF;
    var dayF;
    
    mes= mes+1;
    if(mes<10){
      mesF = this.zeroFill(mes,2);
    }else{
      mesF=mes;
    }
    if(day<10){
      dayF=this.zeroFill(day,2);
    }else{
      dayF=day;
    }
    return anio+"-"+mesF+"-"+dayF;
   }else{
     return fecha
   }
  
 }


 fnCastFecha2(fecha){
  var fechaReturn = new Date(fecha);
  var day = fechaReturn.getDate();
  var mes = fechaReturn.getMonth();
  var anio = fechaReturn.getFullYear();
  var mesF;
  var dayF;
  
  mes= mes+1;
  if(mes<13){
    mesF = this.zeroFill(mes,2);
  }
  if(day<32){
    dayF=this.zeroFill(day,2);
  }
  return dayF+"/"+mesF+"/"+anio;
 }

  exportar() {
    var aliado = this.baseGroup.get("idAliado").value;
    var canal = this.baseGroup.get("idCanalVenta").value;
    var fven = this.baseGroup.get("idFechaVencimiento").value;
    var fcar = this.baseGroup.get("idFechaCarga").value;
    if(fcar==null){
      fcar=""
    }
    if(fven==null){
      fven=""
    }
    var fvenc = this.fnCastFecha(fven);
    var fcarg = this.fnCastFecha(fcar);
    
    var objeto={
      aliadoComercialId:  Number(aliado),
      canalVentaId: canal = "" ? 0 : Number(canal),
      fechaVencimientoFilter: fvenc,
      fechaCarga: fcarg,
     
      
    }

    this._basesService.exportarBase(objeto).subscribe(blobFile => {
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'BasesCargadas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
   /* let obj = this.formGroup.getRawValue();*/
    /*this._usuarioListadoService.exportarUsuario(obj);*/
  }


  updateState(stateModel: State) {
    this._basesService.updateStateBases(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();
    const filters = {
      fechaVencimientoFilter: { value: '2022-04-19'},
      fechaCarga: { value: '2022-04-11'} 
    };

    this.loadLazy({
      filters: filters,
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }

  onBusquedaChange(){
    var aliado = this.baseGroup.get("idAliado").value;
    var canal = this.baseGroup.get("idCanalVenta").value;
    var fven = this.baseGroup.get("idFechaVencimiento").value;
    var fcar = this.baseGroup.get("idFechaCarga").value;
    if(fcar==null){
      fcar=""
    }
    if(fven==null){
      fven=""
    }
    var fvenc = this.fnCastFecha(fven);
    var fcarg = this.fnCastFecha(fcar);
    
    var objeto={
      aliadoComercialId:  Number(aliado),
      canalVentaId: canal == "" ? 0 : Number(canal),
      fechaVencimientoFilter: fvenc,
      fechaCarga: fcarg,
    }  
    this.callServices(objeto);
  }

  change2(event, dataTable: any) {
    if (event.value != null) {
      this._basesEdicionService.initSede(event.value).subscribe(res => {
        this.sedes = res.optionSede;
      });
    } else {
      this.sedes = null;
    }
    var obj = {
      "aliadoComercialId": event.value,
      "canalVentaId": 0,
      "fechaVencimientoFilter": "",
      "fechaCarga": ""
    }
    this.callServices(obj);
  }


  loadData() {
    this._archivoCargaService.initArchivoCarga().subscribe(res => {
      this.optionCanalVenta = res.optionCanal;
      this.optionTurno = res.optionTurno;
      this.optionOpcion = res.optionOpcion;
      this.optionAliados = res.optionAliados;
    });
  }

  setTipoCargaArchivoValidators() {
    const fechaVencimientoCtrl = this.forma.get('fechaVencimiento');
    const horarioCtrl = this.forma.get('idHorario');
    const canalCtrl = this.forma.get('idCanalVenta');
    const idAliadoCtrl = this.forma.get('idAliado');
    const archivo = this.forma.get('archivo');
    this.forma.get('tipoCarga').valueChanges.subscribe(tipoCargaArchivo => {
      fechaVencimientoCtrl.reset();
      horarioCtrl.reset();
      canalCtrl.reset();
      idAliadoCtrl.reset();
      document.getElementById('archivo').innerText = 'Ningún archivo seleccionado';
      archivo.reset();
      if (tipoCargaArchivo !== '1') {
        fechaVencimientoCtrl.setValidators(null);
        horarioCtrl.setValidators(null);
        canalCtrl.setValidators(null);
      } else {
        fechaVencimientoCtrl.setValidators([Validators.required]);
        horarioCtrl.setValidators([Validators.required]);
        canalCtrl.setValidators([Validators.required]);
      }
      if (tipoCargaArchivo === '2' || !this._global.isAdministradorWeb()) {
        idAliadoCtrl.setValidators(null);
        idAliadoCtrl.setValue(this.idAliado);
      } else {
        idAliadoCtrl.setValidators([Validators.required]);
      }
      fechaVencimientoCtrl.updateValueAndValidity();
      horarioCtrl.updateValueAndValidity();
      canalCtrl.updateValueAndValidity();
      idAliadoCtrl.updateValueAndValidity();
    });
  }

  change(event) {
    this.showFecha = true;
    if (event.value == 4) {
      const control = this.forma.get('credito');
      control.enable();
      document.getElementById('update').removeAttribute('disabled');
    } else {
      const control = this.forma.get('credito');
      if (control.enabled) {
        control.disable();
      }
      document.getElementById('update').removeAttribute('disabled');
    }
    if (event.value == 1) {
      this.showFecha = true;
    } else {
      document.getElementById('update').removeAttribute('disabled');
    }
   /* if (event.value == 2 || !this._global.isAdministradorWeb()) {
      this.showAliado = false;
    }
    */
    if (event.value == 2) {
      this.showAliado = true;
    }
    else {
      this.showAliado = true;
    }
  }

  onArchivoSeleccionado($event) {
    if ($event.target.files.length === 1) {
      document.getElementById('archivo').innerText = $event.target.files[0].name;
      this.archivoActual = $event.target.files[0].name;
      this.getBase64($event.target.files[0]);
      document.getElementById('archivo').style.color = '#7ccef3';
      $event.target.value = '';
    } else {
      document.getElementById('archivo').innerText = 'Ningún archivo seleccionado';
      document.getElementById('archivo').style.color = 'red';
    }
  }

  getBase64(file): string {
    let vm_r = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
      let fileBase64 = reader.result;
      fileBase64 = fileBase64.toString().split(',')[1];
      vm_r = fileBase64;

      document.getElementById('valor').innerText = vm_r;
      file = null;
    };
    return vm_r;
  }

  sendFile() {
    if (!this.forma.valid) {
      if (document.getElementById('valor').innerText.toString() == '') {
        document.getElementById('archivo').style.color = 'red';
      }
      return;
    }

    this.base64 = {};
    this.base64.id = localStorage.getItem('id').toString();
    this.base64.Base64 = this.forma.value.archivo = document.getElementById('valor').innerText.toString();
    this.base64.monto = parseInt(this.forma.value.credito, 10);
    this.base64.tipoCargaArchivo = parseInt(this.forma.value.tipoCarga, 10);
    this.base64.idAliadoComercial = +this.forma.value.idAliado;
    this.base64.nombreArchivo= this.forma.controls.archivo.value.split("\\")[2];
    if (this.forma.value.tipoCarga == 1) {
      this.base64.fechaVencimiento = this.forma.value.fechaVencimiento;
      this.base64.idHorario = this.forma.value.idHorario;
      this.base64.idCanalVenta = this.forma.value.idCanalVenta;
      this.sendFileProducto(this.base64);
    } else {
      this._archivoCargaService.sendFilePost(this.base64);
    }
  }

  sendFileProducto(base64: FileUpload64) {
    swal({
      title: 'Carga de Archivos',
      text: '¿Desea confirmar la carga?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._usuarioService.loadExcel(base64);
        resultadoServicio.subscribe(response => {
          var msg = '';
          if (response.valid) {
            msg='<div class="alert_content">' +
            '<i class="far fa-check-circle"></i> ' +
            response.data.cantidadRegistrosEnArchivo + ' Registro(s) en el archivo' +
            '<br>' +
            '<i class="far fa-check-circle"></i> ' +
            response.data.cantidadRegistrosActualizados + ' Registro(s) Actualizados(s) con éxito.' +
            '<br>' +
            '<i class="far fa-check-circle"></i> ' +
            response.data.cantidadRegistrosCargados + ' Registro(s) Nuevos(s) con éxito. ' +
            '<br>' +
            '<i class="far fa-times-circle"></i> ' +
            response.data.cantidadRegistrosErroneos + ' Registro(s) no cargado(s) por error(es) en el archivo.' +
            '</div>';
            if(response.data.ocupado)
              msg = 'Existe un proceso de carga en curso';
              
            swal(
              response.data.ocupado ? 'Advertencia!' : 'Archivo subido correctamente!',
              msg,
              response.data.ocupado ? 'warning' : 'success'
            );
            this.forma.get('tipoCarga').setValue(0);
          }
        });
      }
    });
    return this.estadoCarga;
  }
  changeCanales(event){   
    var aliado = this.baseGroup.get("idAliado").value;
    var canal = this.baseGroup.get("idCanalVenta").value;
    var fven = this.baseGroup.get("idFechaVencimiento").value;
    var fcar = this.baseGroup.get("idFechaCarga").value;
    if(fven==null){
      fven=""
    }
    if(fcar==null){
      fcar=""
    }
    var fvenc = this.fnCastFecha(fven);
    var fcarg = this.fnCastFecha(fcar);
    
    var objeto={
      aliadoComercialId:  Number(aliado),
      canalVentaId: canal == "" ? 0 : Number(canal),
      fechaVencimientoFilter: fvenc,
      fechaCarga: fcarg,
    }  
    this.callServices(objeto);
  }


  

}
