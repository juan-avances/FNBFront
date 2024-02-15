import { Component, OnInit, ViewChild, AfterViewInit, Inject, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { Option, State } from 'src/app/@core/models/option.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { AliadoComercialService, UsuarioService } from 'src/app/services/backend.service.index';
import { UsuarioListadoService, UsuarioEdicionService, ArchivoCargaService } from 'src/app/services/feature.service.index';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BasesListadoService } from 'src/app/services/feature/Administracion/BasesCargadas/bases-listado.service';
import { UploadFile } from 'ngx-file-drop';
import { formatDate } from '@angular/common';
import { ProductoService } from 'src/app/services/backend/producto.service';
import swal from 'sweetalert2';
import { BasesService } from 'src/app/services/backend/bases.service';
import { BaseEdicionService } from 'src/app/services/feature/Administracion/BasesCargadas/base-edicion-service';
import { FileUpload64 } from 'src/app/models/fileUpload64.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FinanciamientoFormComponent } from '../financiamiento-form/financiamiento-form.component';
import { FinanciamientoForm } from 'src/app/models/financiamiento.model';
import { ProductService } from 'src/app/services/backend/productOv/product.service';
import { ProductManual } from 'src/app/models/virtualOficce/productManual.model';
export interface Carga {

  value: string;
  valueName: string;
}
@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit, AfterViewInit {

  product = new ProductManual

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
    idAliadoComercial: new FormControl(""),
    FechaVentaFin: new FormControl(""),
    FechaVentaIni: new FormControl(""),

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
    public dialogRef: MatDialogRef<CargaMasivaComponent>,
    public _productService: ProductService,
    public _archivoCargaService: ArchivoCargaService,
    public _activatedRoute: ActivatedRoute,
    public _usuarioListadoService: UsuarioListadoService,
    public _usuarioEdicionService: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,


    public _usuarioService: UsuarioService,
    public _productoService: ProductoService,
    public _aliadoComercialService: AliadoComercialService,
    public _usuarioEdicionServicio: UsuarioEdicionService,



    public _basesListadoService: BasesListadoService,
    public _basesService: BasesService,
    public _basesEdicionService: BaseEdicionService

  ) { this.countRdn = 1; }



  ngAfterViewInit() {


    this.valorMonto = 2000;
    this.showFecha = true;
    this.showAliado = true;
    if (!this._global.isAdministradorWeb()) {
      this.idAliado = localStorage.getItem('IdAliado').toString();
    }

    this.loadData();



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

    var fini = this.fnCastFecha(this.product.FechaVentaIni);
    var ffin = this.fnCastFecha(this.product.FechaVentaFin);

    this.baseGroup.controls['idAliadoComercial'].setValue(this.product.idAliadoComercial);
    this.baseGroup.controls['FechaVentaIni'].setValue(fini);
    this.baseGroup.controls['FechaVentaFin'].setValue(ffin);

  }



  ValidateForm() {

    var fini = this.fnCastFecha(this.product.FechaVentaIni);
    var ffin = this.fnCastFecha(this.product.FechaVentaFin);

    this.baseGroup = this.formBuilder.group({

      aliadoComercial: [""],
      FechaVentaIni: [fini],
      FechaVentaFin: [ffin],

    });

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

  save() {
    if (this.baseGroup.invalid) {
      return Object.values(this.baseGroup.controls).forEach(control => control.markAllAsTouched());
    }
    if (this.baseGroup.valid) {
      this.product = this.baseGroup.value;
      
      //this.commercialAllyUpdateService.save(this.formGroup.getRawValue());
      if (this.product.FechaVentaFin <  this.product.FechaVentaIni ) {
        swal(" ","La Fecha Fin debe ser mayor o igual a la Fecha Inicio","warning");
        return;
      }

      const diferenciatiempo = (this.product.FechaVentaFin as any).getTime() - (this.product.FechaVentaIni as any).getTime();
      const diferenciaDias = diferenciatiempo / (1000 * 3600 * 24);

      if(diferenciaDias>30){
        swal(" ","La cantidad máxima de descarga es de 30 días","warning");
        return;
      }
      
      
        swal({
          text: '¿Estás seguro de realizar esta operación?',
          type: 'question',
          confirmButtonClass: 'btn-azul',
          confirmButtonText: 'Aceptar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then(result => {

          if (result.value) {

            this.ejecutarCarga();
          
          }
  

        });
      

      
    }
  }



  ejecutarCarga() {
    this.product = this.baseGroup.value
    this.product.FechaVentaIni=(this.product.FechaVentaIni as any).toISOString().split("T")[0];
    this.product.FechaVentaFin=(this.product.FechaVentaFin as any).toISOString().split("T")[0];
    this._productService.cargaMasiva(this.product).subscribe(blobFile => {
        const url = window.URL.createObjectURL(blobFile);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'FinanciamientosArchivos.zip';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        swal('Se realizó el proceso correctamente.', '', 'success');
        this.dialogRef.close();
      
    });
  }

  callServices(params: any) {
    this._basesService.loadLazyFilter(params).subscribe(response => {
      this.dataEntity.data = response;
      this.dataEntity.totalRegistros = this.dataEntity.data.length;
    });
  }

  zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + "";
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
      return anio + "-" + mesF + "-" + dayF;
    } else {
      return fecha
    }

  }


  fnCastFecha2(fecha) {
    var fechaReturn = new Date(fecha);
    var day = fechaReturn.getDate();
    var mes = fechaReturn.getMonth();
    var anio = fechaReturn.getFullYear();
    var mesF;
    var dayF;

    mes = mes + 1;
    if (mes < 13) {
      mesF = this.zeroFill(mes, 2);
    }
    if (day < 32) {
      dayF = this.zeroFill(day, 2);
    }
    return dayF + "/" + mesF + "/" + anio;
  }

  exportar() {
    var aliado = this.baseGroup.get("idAliado").value;
    var fini = this.baseGroup.get("FechaVentaIni").value;
    var ffin = this.baseGroup.get("FechaVentaFin").value;


    if (ffin == null) {
      ffin = ""
    }
    var fvenc = this.fnCastFecha(ffin);
    var fcarg = this.fnCastFecha(fini);



    var product = {
      aliadoComercialId: Number(aliado),
      FechaVentaIni: fini,
      FechaVentaFin: ffin,


    }

    this._productService.cargaMasiva(this.product).subscribe(blobFile => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.download = 'BasesCargadas.xlsx';
      a.click();
      a.remove();
    });

  }




  onBusquedaChange() {
    var aliado = this.baseGroup.get("idAliado").value;
    var canal = this.baseGroup.get("idCanalVenta").value;
    var fven = this.baseGroup.get("idFechaVencimiento").value;
    var fcar = this.baseGroup.get("idFechaCarga").value;
    if (fcar == null) {
      fcar = ""
    }
    if (fven == null) {
      fven = ""
    }
    var fvenc = this.fnCastFecha(fven);
    var fcarg = this.fnCastFecha(fcar);

    var objeto = {
      aliadoComercialId: Number(aliado),
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
    this._archivoCargaService.initArchivo().subscribe(res => {
      this.optionCanalVenta = res.optionCanal;
      this.optionTurno = res.optionTurno;
      this.optionOpcion = res.optionOpcion;
      this.optionAliados = res.optionAliados;
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



  changeCanales(event) {
    this._archivoCargaService.getRolCanalVenta(event.value).subscribe(e => {
      this.optionCanalVenta = e;
    })
    var aliado = this.baseGroup.get("idAliado").value;
    var canal = this.baseGroup.get("idCanalVenta").value;
    var fven = this.baseGroup.get("idFechaVencimiento").value;
    var fcar = this.baseGroup.get("idFechaCarga").value;
    if (fven == null) {
      fven = ""
    }
    if (fcar == null) {
      fcar = ""
    }
    var fvenc = this.fnCastFecha(fven);
    var fcarg = this.fnCastFecha(fcar);

    var objeto = {
      aliadoComercialId: Number(aliado),
      canalVentaId: canal == "" ? 0 : Number(canal),
      fechaVencimientoFilter: fvenc,
      fechaCarga: fcarg,
    }
    this.callServices(objeto);
  }


  btnCerrar(): void {
    this.dialogRef.close();
  }

}
